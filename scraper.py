import scrapy
from bs4 import BeautifulSoup
import json
import re
import hashlib
from typing import List, Dict, Optional

class DataCleaner:
    """
    Cleans raw HTML and filters PII/Duplicates.
    """
    def __init__(self):
        self.seen_hashes = set()
        # Regex for PII (Emails, Phone Numbers, etc.)
        self.email_regex = re.compile(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}')
        self.phone_regex = re.compile(r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b')

    def clean_html(self, html: str) -> str:
        """
        Removes scripts, styles, and navigation elements.
        """
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove unwanted tags
        for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
            tag.decompose()
            
        # Wikipedia specific: remove references and edit links
        for tag in soup.find_all(class_=['reflist', 'mw-editsection', 'navbox']):
            tag.decompose()
            
        return soup.get_text(separator=' ', strip=True)

    def filter_pii(self, text: str) -> str:
        """
        Redacts PII from text.
        """
        text = self.email_regex.sub('[EMAIL_REDACTED]', text)
        text = self.phone_regex.sub('[PHONE_REDACTED]', text)
        return text

    def is_duplicate(self, text: str) -> bool:
        """
        Checks if text is a duplicate using SHA-256 hashing.
        """
        text_hash = hashlib.sha256(text.encode('utf-8')).hexdigest()
        if text_hash in self.seen_hashes:
            return True
        self.seen_hashes.add(text_hash)
        return False

class GrimSpider(scrapy.Spider):
    name = 'grim_spider'
    allowed_domains = ['wikipedia.org', 'github.com']
    start_urls = [
        'https://en.wikipedia.org/wiki/Artificial_intelligence',
        'https://github.com/trending/python'
    ]
    
    def __init__(self, *args, **kwargs):
        super(GrimSpider, self).__init__(*args, **kwargs)
        self.cleaner = DataCleaner()
        self.output_file = open('grim_dataset.jsonl', 'w', encoding='utf-8')

    def parse(self, response):
        """
        Main parsing logic.
        """
        raw_html = response.text
        
        # 1. Clean HTML
        clean_text = self.cleaner.clean_html(raw_html)
        
        # 2. Filter PII
        safe_text = self.cleaner.filter_pii(clean_text)
        
        # 3. De-duplicate
        if not self.cleaner.is_duplicate(safe_text):
            item = {
                'url': response.url,
                'content': safe_text,
                'length': len(safe_text)
            }
            
            # 4. Save to JSONL
            self.output_file.write(json.dumps(item) + '\n')
            self.logger.info(f"Extracted: {response.url} ({len(safe_text)} chars)")

        # Follow links (limited for safety)
        if 'wikipedia' in response.url:
            links = response.css('div#bodyContent a::attr(href)').getall()
            for link in links[:10]: # Limit to 10 links per page
                if link.startswith('/wiki/') and ':' not in link:
                    yield response.follow(link, self.parse)

    def closed(self, reason):
        self.output_file.close()
        self.logger.info("Scraper finished. Dataset saved to grim_dataset.jsonl")

if __name__ == "__main__":
    from scrapy.crawler import CrawlerProcess
    
    process = CrawlerProcess({
        'USER_AGENT': 'GrimBot/1.0 (+https://grim-ai.labs)',
        'LOG_LEVEL': 'INFO',
        'CONCURRENT_REQUESTS': 16,
        'DOWNLOAD_DELAY': 1
    })
    
    process.crawl(GrimSpider)
    process.start()
