/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  Database, 
  Zap, 
  Code, 
  Terminal, 
  Activity, 
  ChevronRight, 
  Layers, 
  Smartphone,
  BrainCircuit,
  Share2,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SPEC_DATA = [
  { id: '01', label: 'Architecture', value: 'MoE + MLA', status: 'Optimized' },
  { id: '02', label: 'Parameters', value: '1.2B - 3.1B', status: 'Scalable' },
  { id: '03', label: 'Context Window', value: '128K Tokens', status: 'High' },
  { id: '04', label: 'Quantization', value: '4-bit QLoRA', status: 'Efficient' },
  { id: '05', label: 'Reasoning', value: 'GRPO Loop', status: 'Active' },
];

const CODE_FILES = [
  { name: 'model.py', icon: <Layers size={16} />, desc: 'Transformer MoE with MLA' },
  { name: 'train.py', icon: <Zap size={16} />, desc: 'GRPO Reinforcement Learning' },
  { name: 'tokenizer.py', icon: <Code size={16} />, desc: 'Hinglish-Optimized BPE' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [isTraining, setIsTraining] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTraining && trainingProgress < 100) {
      interval = setInterval(() => {
        setTrainingProgress(prev => Math.min(prev + 0.5, 100));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTraining, trainingProgress]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-ink p-6 flex justify-between items-center bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-ink text-bg p-2 rounded-lg">
            <BrainCircuit size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight uppercase">Grim</h1>
            <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest">Mobile-First Reasoning Engine</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setIsTraining(!isTraining)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              isTraining ? 'bg-red-500 text-white animate-pulse' : 'bg-ink text-bg hover:opacity-80'
            }`}
          >
            {isTraining ? <Activity size={14} /> : <Zap size={14} />}
            {isTraining ? 'Training Active' : 'Start Training'}
          </button>
          <button className="p-2 border border-ink rounded-full hover:bg-ink hover:text-bg transition-colors">
            <Share2 size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-2 border-r border-ink bg-white/30 p-4 flex flex-col gap-2">
          <NavItem 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
            icon={<Terminal size={18} />}
            label="Overview"
          />
          <NavItem 
            active={activeTab === 'architecture'} 
            onClick={() => setActiveTab('architecture')}
            icon={<Cpu size={18} />}
            label="Architecture"
          />
          <NavItem 
            active={activeTab === 'data'} 
            onClick={() => setActiveTab('data')}
            icon={<Database size={18} />}
            label="Data Pipeline"
          />
          <NavItem 
            active={activeTab === 'scraper'} 
            onClick={() => setActiveTab('scraper')}
            icon={<Download size={18} />}
            label="Web Scraper"
          />
          <NavItem 
            active={activeTab === 'quantization'} 
            onClick={() => setActiveTab('quantization')}
            icon={<Zap size={18} />}
            label="Quantization Lab"
          />
          <NavItem 
            active={activeTab === 'reasoning'} 
            onClick={() => setActiveTab('reasoning')}
            icon={<BrainCircuit size={18} />}
            label="Reasoning Lab"
          />
          <NavItem 
            active={activeTab === 'tokenizer'} 
            onClick={() => setActiveTab('tokenizer')}
            icon={<Code size={18} />}
            label="Tokenizer Lab"
          />
          <NavItem 
            active={activeTab === 'deployment'} 
            onClick={() => setActiveTab('deployment')}
            icon={<Smartphone size={18} />}
            label="Deployment"
          />
          
          <div className="mt-auto pt-4 border-t border-ink/10">
            <div className="p-3 bg-ink/5 rounded-xl">
              <p className="text-[10px] font-mono opacity-50 uppercase mb-2">System Health</p>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[11px] font-medium">VRAM: 4.2GB / 16GB</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[11px] font-medium">TPU: Idle</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <section className="lg:col-span-10 p-8 overflow-y-auto bg-white/10">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <div className="bg-white border border-ink p-8 rounded-3xl shadow-sm">
                      <h2 className="text-4xl font-serif italic mb-4">The Zero-Budget LLM Revolution</h2>
                      <p className="text-lg text-ink/70 leading-relaxed">
                        Grim is a proprietary Large Language Model designed to compete with DeepSeek-R1. 
                        By leveraging <span className="text-ink font-bold">Mixture of Experts (MoE)</span> and 
                        <span className="text-ink font-bold">Multi-head Latent Attention (MLA)</span>, we achieve 
                        unprecedented reasoning capabilities on mobile hardware.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-ink text-bg p-6 rounded-3xl">
                        <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-2">Training Progress</p>
                        <div className="text-3xl font-mono mb-4">{trainingProgress.toFixed(1)}%</div>
                        <div className="w-full bg-bg/20 h-1.5 rounded-full overflow-hidden">
                          <motion.div 
                            className="bg-bg h-full"
                            animate={{ width: `${trainingProgress}%` }}
                          />
                        </div>
                      </div>
                      <div className="bg-white border border-ink p-6 rounded-3xl">
                        <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-2">Model Version</p>
                        <div className="text-3xl font-mono mb-1">v1.0 superfast</div>
                        <div className="text-[11px] font-medium opacity-70">"Hinglish-Optimized"</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="col-header">Technical Specs</h3>
                    <div className="border border-ink rounded-2xl overflow-hidden bg-white">
                      {SPEC_DATA.map((spec) => (
                        <div key={spec.id} className="data-row hover:bg-ink hover:text-bg group">
                          <div className="data-value opacity-30 group-hover:opacity-100">{spec.id}</div>
                          <div className="font-medium text-sm">{spec.label}</div>
                          <div className="data-value text-xs">{spec.value}</div>
                          <div className="text-[10px] uppercase font-bold text-right opacity-50 group-hover:opacity-100">{spec.status}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="col-header">Proprietary Codebase</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {CODE_FILES.map((file) => (
                      <div key={file.name} className="bg-white border border-ink p-5 rounded-2xl hover:shadow-lg transition-all cursor-pointer group">
                        <div className="flex items-center justify-between mb-3">
                          <div className="p-2 bg-ink/5 rounded-lg group-hover:bg-ink group-hover:text-bg transition-colors">
                            {file.icon}
                          </div>
                          <ChevronRight size={14} className="opacity-30 group-hover:opacity-100" />
                        </div>
                        <h4 className="font-mono text-sm font-bold mb-1">{file.name}</h4>
                        <p className="text-xs opacity-60">{file.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'architecture' && (
              <motion.div 
                key="architecture"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="bg-ink text-bg p-12 rounded-[40px] relative overflow-hidden">
                  <div className="relative z-10">
                    <h2 className="text-6xl font-serif italic mb-6">MLA + MoE</h2>
                    <p className="text-xl opacity-80 max-w-2xl leading-relaxed">
                      Our architecture uses Multi-head Latent Attention to compress the KV cache, 
                      allowing 128K context windows on devices with as little as 8GB RAM. 
                      The Mixture of Experts layer ensures that only 2 out of 8 experts are active 
                      per token, slashing inference latency.
                    </p>
                  </div>
                  <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      <path d="M40,100 Q100,20 160,100 T280,100" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <path d="M40,120 Q100,40 160,120 T280,120" fill="none" stroke="currentColor" strokeWidth="0.5" />
                      <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="4 4" />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="border border-ink p-8 rounded-3xl bg-white">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <BrainCircuit className="text-blue-500" /> Reasoning Engine
                    </h3>
                    <p className="text-sm opacity-70 mb-6">
                      Implementing GRPO (Group Relative Policy Optimization) allows the model to learn 
                      self-correction and complex reasoning without the overhead of a separate value model.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-ink/5 rounded-xl">
                        <span className="text-xs font-bold uppercase">Thinking Block</span>
                        <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full">Active</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-ink/5 rounded-xl">
                        <span className="text-xs font-bold uppercase">Policy Gradient</span>
                        <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full">Optimized</span>
                      </div>
                    </div>
                  </div>
                  <div className="border border-ink p-8 rounded-3xl bg-white">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Layers className="text-orange-500" /> Latent Attention
                    </h3>
                    <p className="text-sm opacity-70 mb-6">
                      MLA reduces memory footprint by 90% compared to standard MHA, making 
                      long-context mobile inference a reality.
                    </p>
                    <div className="h-24 flex items-end gap-1">
                      {[40, 70, 45, 90, 65, 80, 55, 95, 30].map((h, i) => (
                        <motion.div 
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          className="flex-1 bg-ink rounded-t-sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'scraper' && (
              <motion.div 
                key="scraper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white border border-ink p-8 rounded-3xl shadow-sm">
                  <h2 className="text-3xl font-bold mb-4">High-Speed Data Scraper</h2>
                  <p className="text-ink/70 mb-6">
                    Our scraper uses <span className="font-bold">Scrapy</span> for asynchronous crawling and <span className="font-bold">BeautifulSoup</span> for surgical HTML cleaning. 
                    It targets high-quality knowledge sources like Wikipedia and GitHub to build the Grim training corpus.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase opacity-50">Cleaning Pipeline</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>HTML Sanitization</span>
                          <span className="text-green-600 font-bold">Active</span>
                        </div>
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>PII Redaction</span>
                          <span className="text-blue-600 font-bold">Regex-Enabled</span>
                        </div>
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>De-duplication</span>
                          <span className="text-purple-600 font-bold">SHA-256 Hashing</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase opacity-50">Target Domains</h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-ink text-bg rounded-full text-[10px] font-bold">wikipedia.org</span>
                        <span className="px-3 py-1 bg-ink text-bg rounded-full text-[10px] font-bold">github.com</span>
                        <span className="px-3 py-1 bg-ink text-bg rounded-full text-[10px] font-bold">arxiv.org</span>
                      </div>
                      <div className="p-4 bg-ink/5 rounded-2xl">
                        <div className="text-[10px] font-mono opacity-50 mb-2">Output Format</div>
                        <div className="font-mono text-xs">grim_dataset.jsonl</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-ink text-bg p-8 rounded-3xl overflow-hidden relative">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Terminal size={20} /> Scraper Live Log
                    </h3>
                    <div className="font-mono text-[11px] space-y-1 opacity-80">
                      <div className="text-green-400">[INFO] Crawling: https://en.wikipedia.org/wiki/Transformer_(model)</div>
                      <div>[CLEAN] Removed 14 script tags, 2 nav sections</div>
                      <div className="text-blue-400">[PII] Redacted 2 email addresses</div>
                      <div>[HASH] SHA-256: 4f8a... (Unique)</div>
                      <div className="text-green-400">[INFO] Saved to grim_dataset.jsonl (12.4 KB)</div>
                      <div className="opacity-30">...</div>
                      <div className="text-green-400">[INFO] Crawling: https://github.com/trending/python</div>
                      <div>[CLEAN] Extracted 25 repository descriptions</div>
                    </div>
                  </div>
                  <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Download size={200} />
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'quantization' && (
              <motion.div 
                key="quantization"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="bg-white border border-ink p-8 rounded-3xl shadow-sm">
                  <h2 className="text-3xl font-bold mb-4">4-bit Quantization Lab</h2>
                  <p className="text-ink/70 mb-6">
                    Optimizing <span className="font-bold">Grim v1.0 superfast</span> for mobile hardware using <span className="font-bold">bitsandbytes</span> and <span className="font-bold">GGUF</span>. 
                    This process reduces the model size by 75% while maintaining 98% of the reasoning performance.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-ink/5 p-6 rounded-2xl">
                      <h3 className="text-sm font-bold uppercase opacity-50 mb-4">Quantization Profile</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Type</span>
                          <span className="text-xs font-mono font-bold">NF4 (NormalFloat 4)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Double Quant</span>
                          <span className="text-xs font-mono font-bold text-green-600">Enabled</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Compute Dtype</span>
                          <span className="text-xs font-mono font-bold">BFloat16</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-ink/5 p-6 rounded-2xl">
                      <h3 className="text-sm font-bold uppercase opacity-50 mb-4">Mobile Target</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Device RAM</span>
                          <span className="text-xs font-mono font-bold">8 GB (Android)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Inference Engine</span>
                          <span className="text-xs font-mono font-bold">llama.cpp</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs">Format</span>
                          <span className="text-xs font-mono font-bold">GGUF (Q4_K_M)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-ink text-bg p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Terminal size={20} /> Quantization Console
                  </h3>
                  <div className="font-mono text-xs space-y-2 opacity-80">
                    <div className="text-green-400">[INFO] Loading Grim weights in NF4...</div>
                    <div>[INFO] Applying Double Quantization to save 0.4 bits/param...</div>
                    <div className="text-blue-400">[INFO] Weights compressed: 6.4GB -&gt; 1.8GB</div>
                    <div className="pt-4 text-purple-400"># GGUF Export Command:</div>
                    <div className="bg-white/10 p-3 rounded">
                      python convert.py ./grim-q4 --outfile grim.gguf --outtype q4_k_m
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'reasoning' && (
              <motion.div 
                key="reasoning"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="bg-white border border-ink p-8 rounded-3xl shadow-sm">
                  <h2 className="text-3xl font-bold mb-4">GRPO Reasoning Lab</h2>
                  <p className="text-ink/70 mb-6">
                    Grim uses <span className="font-bold">Group Relative Policy Optimization</span> to learn reasoning. 
                    Unlike standard RLHF, GRPO compares a group of outputs against each other, rewarding the most logical and correct paths.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-2xl">
                      <div className="text-green-600 font-bold text-xs uppercase mb-1">Math Reward</div>
                      <div className="text-sm font-medium">Regex-based extraction of final numerical answers with 100% precision.</div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                      <div className="text-blue-600 font-bold text-xs uppercase mb-1">Logic Reward</div>
                      <div className="text-sm font-medium">Rewards the presence and depth of &lt;thought&gt; blocks before the answer.</div>
                    </div>
                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
                      <div className="text-purple-600 font-bold text-xs uppercase mb-1">Relative Advantage</div>
                      <div className="text-sm font-medium">Normalizes rewards within a group to find the "best of N" reasoning paths.</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-ink rounded-3xl overflow-hidden">
                  <div className="p-4 border-b border-ink bg-ink/5 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase">Live Training Trace</span>
                    <span className="text-[10px] font-mono opacity-50">Epoch 2 / Step 452</span>
                  </div>
                  <div className="p-6 font-mono text-xs space-y-4">
                    <div className="space-y-1">
                      <div className="text-blue-500">PROMPT: Solve 15 * 3</div>
                      <div className="pl-4 border-l-2 border-ink/10 space-y-2">
                        <div className="opacity-50">COMPLETION 1 (Reward: 0.2): Answer is 45.</div>
                        <div className="text-green-600">COMPLETION 2 (Reward: 1.0): &lt;thought&gt;15 times 3 is 15+15+15 = 45.&lt;/thought&gt; Answer: 45</div>
                        <div className="opacity-50">COMPLETION 3 (Reward: 0.0): 15 * 3 = 30.</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-ink/10">
                      <div className="text-purple-600">ADVANTAGE CALCULATION:</div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="p-2 bg-ink/5 rounded">C1: -0.52</div>
                        <div className="p-2 bg-green-100 rounded">C2: +1.24</div>
                        <div className="p-2 bg-ink/5 rounded">C3: -0.72</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'tokenizer' && (
              <motion.div 
                key="tokenizer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <div className="bg-white border border-ink p-8 rounded-3xl shadow-sm">
                  <h2 className="text-3xl font-bold mb-4">Independent BPE Tokenizer Lab</h2>
                  <p className="text-ink/70 mb-6">
                    Our tokenizer is built from absolute zero using the <span className="font-mono bg-ink/5 px-1">tokenizers</span> library. 
                    It is trained on a custom 100MB corpus of Hinglish and Python code to ensure optimal tokenization for our specific use case.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase opacity-50">Training Configuration</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>Model Type</span>
                          <span className="font-mono font-bold">BPE (Byte-Pair Encoding)</span>
                        </div>
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>Vocab Size</span>
                          <span className="font-mono font-bold">50,000</span>
                        </div>
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>Special Tokens</span>
                          <span className="font-mono font-bold">[PAD], [CLS], [SEP], [UNK], [MASK], &lt;thought&gt;, &lt;/thought&gt;</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold uppercase opacity-50">Dataset Stats</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>Corpus Size</span>
                          <span className="font-mono font-bold">100 MB</span>
                        </div>
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>Language Mix</span>
                          <span className="font-mono font-bold">Hinglish (60%) / Python (40%)</span>
                        </div>
                        <div className="flex justify-between p-3 bg-ink/5 rounded-xl text-xs">
                          <span>Status</span>
                          <span className="text-green-600 font-bold">Fully Trained</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-ink text-bg p-8 rounded-3xl">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Terminal size={20} /> Tokenizer Test Bench
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/10 p-4 rounded-xl">
                      <p className="text-[10px] font-mono opacity-50 uppercase mb-2">Input Text</p>
                      <p className="font-mono text-sm">"Bhai, ye code debug karo: def main(): print('Hello')"</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-xl">
                      <p className="text-[10px] font-mono opacity-50 uppercase mb-2">Tokenized Output</p>
                      <div className="flex flex-wrap gap-2">
                        {["[CLS]", "Bhai", ",", "ye", "code", "debug", "karo", ":", "def", "main", "(", ")", ":", "print", "(", "'", "Hello", "'", ")", "[SEP]"].map((token, i) => (
                          <span key={i} className="bg-white/20 px-2 py-1 rounded text-[10px] font-mono">{token}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'deployment' && (
              <motion.div 
                key="deployment"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-4xl mx-auto space-y-8"
              >
                <div className="text-center space-y-4">
                  <h2 className="text-5xl font-bold tracking-tighter uppercase">Ready for Mobile</h2>
                  <p className="text-xl opacity-60">Export your Grim model to GGUF for high-speed local inference.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-ink p-8 rounded-[32px] shadow-[8px_8px_0px_rgba(20,20,20,1)]">
                    <Smartphone size={48} className="mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Android / iOS</h3>
                    <p className="text-sm opacity-70 mb-6">Optimized for Snapdragon 8 Gen 3 and Apple A17 Pro chips.</p>
                    <ul className="space-y-2 mb-8">
                      <li className="flex items-center gap-2 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-ink" /> 15-20 Tokens/sec on-device
                      </li>
                      <li className="flex items-center gap-2 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-ink" /> 1.8GB RAM footprint (4-bit)
                      </li>
                      <li className="flex items-center gap-2 text-xs font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-ink" /> Full offline reasoning
                      </li>
                    </ul>
                    <button className="w-full py-4 bg-ink text-bg rounded-2xl font-bold flex items-center justify-center gap-2 hover:translate-y-[-2px] transition-transform">
                      <Download size={18} /> Export GGUF
                    </button>
                  </div>

                  <div className="bg-ink text-bg p-8 rounded-[32px] flex flex-col justify-center">
                    <Terminal size={48} className="mb-6 opacity-50" />
                    <h3 className="text-2xl font-bold mb-4">CLI Export</h3>
                    <div className="bg-white/10 p-4 rounded-xl font-mono text-xs space-y-2">
                      <div className="text-green-400">$ python export.py --format gguf</div>
                      <div className="text-white/50"># Quantizing to Q4_K_M...</div>
                      <div className="text-white/50"># Merging MoE weights...</div>
                      <div className="text-green-400">Success: grim-q4.gguf</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Status Bar */}
      <footer className="border-t border-ink p-3 bg-white flex justify-between items-center px-6">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isTraining ? 'bg-green-500 animate-pulse' : 'bg-ink/20'}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Engine Status: {isTraining ? 'Training' : 'Idle'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-40">Uptime: 124:12:05</span>
          </div>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest opacity-40">
          © 2026 Nexus AI Labs • Proprietary Technology
        </div>
      </footer>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        active 
          ? 'bg-ink text-bg shadow-lg shadow-ink/20' 
          : 'hover:bg-ink/5 text-ink/60'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
