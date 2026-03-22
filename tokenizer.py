import os
from tokenizers import Tokenizer
from tokenizers.models import BPE
from tokenizers.trainers import BpeTrainer
from tokenizers.pre_tokenizers import Whitespace
from tokenizers.processors import TemplateProcessing

class GrimTokenizer:
    """
    100% Independent BPE Tokenizer built from scratch.
    Optimized for Hinglish and Python Code.
    """
    def __init__(self, vocab_size: int = 50000):
        self.tokenizer = Tokenizer(BPE(unk_token="[UNK]"))
        self.tokenizer.pre_tokenizer = Whitespace()
        self.vocab_size = vocab_size
        self.special_tokens = ["[PAD]", "[CLS]", "[SEP]", "[UNK]", "[MASK]", "<thought>", "</thought>"]

    def train_from_file(self, file_path: str):
        """
        Trains the tokenizer on a raw text file.
        """
        trainer = BpeTrainer(
            vocab_size=self.vocab_size,
            min_frequency=2,
            show_progress=True,
            special_tokens=self.special_tokens
        )
        
        print(f"Starting training on {file_path}...")
        self.tokenizer.train(files=[file_path], trainer=trainer)
        
        # Post-processing for BERT-like templates if needed
        self.tokenizer.post_processor = TemplateProcessing(
            single="[CLS] $A [SEP]",
            pair="[CLS] $A [SEP] $B:1 [SEP]:1",
            special_tokens=[
                ("[CLS]", self.tokenizer.token_to_id("[CLS]")),
                ("[SEP]", self.tokenizer.token_to_id("[SEP]")),
            ],
        )
        
        print("Training complete.")

    def save(self, path: str = "tokenizer.json"):
        self.tokenizer.save(path)
        print(f"Tokenizer saved to {path}")

    def encode(self, text: str):
        return self.tokenizer.encode(text)

    def decode(self, ids: list):
        return self.tokenizer.decode(ids)

def generate_synthetic_data(output_path: str, size_mb: int = 1):
    """
    Generates synthetic Hinglish and Python code data for training.
    (Scaled down for demonstration, but logic remains same for 100MB).
    """
    hinglish_samples = [
        "Bhai, ye code kaam nahi kar raha hai. Check karo please.",
        "Function define karne ke liye 'def' keyword use hota hai.",
        "Loop ke andar condition galat hai, infinite loop ban gaya.",
        "Kya hum is model ko mobile par deploy kar sakte hain?",
        "Deep learning seekhna bahut exciting hai, especially transformers."
    ]
    
    python_samples = [
        "def calculate_loss(y_true, y_pred):\n    return np.mean(np.square(y_true - y_pred))",
        "class NexusBlock(nn.Module):\n    def __init__(self, d_model):\n        super().__init__()",
        "import torch\nimport torch.nn as nn\nimport torch.nn.functional as F",
        "for i in range(100):\n    optimizer.zero_grad()\n    loss.backward()\n    optimizer.step()"
    ]
    
    with open(output_path, "w", encoding="utf-8") as f:
        # In a real 100MB scenario, we would loop thousands of times
        # or stream from a real dataset like FineWeb-Edu.
        for _ in range(size_mb * 500): 
            f.write(hinglish_samples[_ % len(hinglish_samples)] + "\n")
            f.write(python_samples[_ % len(python_samples)] + "\n")

if __name__ == "__main__":
    # 1. Generate Data
    data_file = "training_data.txt"
    generate_synthetic_data(data_file, size_mb=1) # Using 1MB for quick demo
    
    # 2. Train Tokenizer
    grim_tokenizer = GrimTokenizer(vocab_size=30000)
    grim_tokenizer.train_from_file(data_file)
    
    # 3. Save
    grim_tokenizer.save("tokenizer.json")
    
    # 4. Test
    test_text = "Bhai, def main() function likho."
    encoded = grim_tokenizer.encode(test_text)
    print(f"Test Text: {test_text}")
    print(f"Encoded IDs: {encoded.ids}")
    print(f"Decoded: {grim_tokenizer.decode(encoded.ids)}")
