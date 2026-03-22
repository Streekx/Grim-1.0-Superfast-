import torch
import torch.nn as nn
import torch.nn.functional as F
import re
import numpy as np
import json
import os
from typing import List, Dict
from model import GrimModel
from tqdm import tqdm

class GRPOTrainer:
    """
    Custom Group Relative Policy Optimization (GRPO) Trainer.
    Optimizes reasoning models without a value function by using relative group rewards.
    """
    def __init__(self, model: GrimModel, optimizer: torch.optim.Optimizer, group_size: int = 8):
        self.model = model
        self.optimizer = optimizer
        self.group_size = group_size
        self.epsilon = 0.2 # PPO clipping parameter
        self.beta = 0.01   # KL penalty coefficient

    def math_reward(self, completion: str, ground_truth: str) -> float:
        """
        Checks for math correctness using regex extraction.
        """
        # Extract answer after 'Answer:' or at the end
        match = re.search(r"Answer:\s*([\d\.]+)", completion)
        if not match:
            # Try to find the last number in the string
            numbers = re.findall(r"[\d\.]+", completion)
            if not numbers: return 0.0
            predicted = numbers[-1]
        else:
            predicted = match.group(1)
            
        try:
            if float(predicted) == float(ground_truth):
                return 1.0
        except (ValueError, TypeError):
            pass
        return 0.0

    def logic_reward(self, completion: str) -> float:
        """
        Checks for logic consistency and formatting.
        Rewards:
        1. Presence of <thought> tags.
        2. Minimum thought length (prevents empty thoughts).
        3. Transition from thought to answer.
        """
        reward = 0.0
        
        # 1. Format check: <thought> tags
        thought_match = re.search(r"<thought>(.*?)</thought>", completion, re.DOTALL)
        if thought_match:
            reward += 0.3
            thought_content = thought_match.group(1).strip()
            # 2. Substance check: Thought must be non-trivial
            if len(thought_content) > 20:
                reward += 0.2
        
        # 3. Structure check: Thought comes BEFORE answer
        if "<thought>" in completion and "Answer:" in completion:
            if completion.find("<thought>") < completion.find("Answer:"):
                reward += 0.2
                
        return reward

    def compute_grpo_loss(self, prompt_ids: torch.Tensor, completions: List[torch.Tensor], rewards: torch.Tensor):
        """
        Calculates the GRPO loss based on relative group advantages.
        """
        # 1. Calculate Advantages: (R - mean(R)) / std(R)
        mean_reward = rewards.mean()
        std_reward = rewards.std() + 1e-8
        advantages = (rewards - mean_reward) / std_reward
        
        # 2. Policy Gradient Loss (Simplified)
        total_loss = 0
        for i in range(self.group_size):
            # Simplified for demonstration:
            total_loss += -advantages[i] # Minimize negative advantage
            
        return total_loss / self.group_size

    def train_step(self, prompt: str, ground_truth: str, verbose: bool = False):
        """
        Performs a single GRPO training step.
        """
        self.optimizer.zero_grad()
        
        # 1. Generate a group of completions
        # In a real scenario, we'd use model.generate()
        raw_texts = []
        for _ in range(self.group_size):
            # Simulating model generation with some variation for training
            if np.random.rand() > 0.3:
                simulated_text = f"<thought>Thinking about {prompt}...</thought> Answer: {ground_truth}"
            else:
                simulated_text = f"The answer to {prompt} is probably {ground_truth}."
            raw_texts.append(simulated_text)
            
        # 2. Calculate Rewards
        rewards = []
        for text in raw_texts:
            r = self.math_reward(text, ground_truth) + self.logic_reward(text)
            rewards.append(r)
        
        rewards_tensor = torch.tensor(rewards, dtype=torch.float32)
        
        # 3. Compute Loss and Backprop
        # In real training, we'd use compute_grpo_loss with actual log_probs
        # For this demo, we simulate the gradient step
        loss = rewards_tensor.mean() * -1.0 # Dummy loss
        # loss.backward()
        # self.optimizer.step()
        
        if verbose:
            tqdm.write(f"Step Log | Mean Reward: {rewards_tensor.mean().item():.4f} | Max Reward: {rewards_tensor.max().item():.4f}")
        
        return rewards_tensor.mean().item()

def main():
    # Configuration
    DATASET_PATH = "grim_dataset.jsonl"
    MAX_STEPS = 1000
    LOGGING_STEPS = 1
    
    # Check for dataset
    if not os.path.exists(DATASET_PATH):
        print(f"ERROR: No Data Found at {DATASET_PATH}")
        print("Please run scraper.py first to generate the training corpus.")
        exit(1)
        
    # Load dataset
    dataset = []
    try:
        with open(DATASET_PATH, 'r', encoding='utf-8') as f:
            for line in f:
                dataset.append(json.loads(line))
    except Exception as e:
        print(f"ERROR: Failed to read dataset: {e}")
        exit(1)
        
    if not dataset:
        print(f"ERROR: No Data Found in {DATASET_PATH} (file is empty)")
        exit(1)

    # Initialize Grim Model
    model = GrimModel(vocab_size=30000)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-5)
    
    # Initialize GRPO Trainer
    trainer = GRPOTrainer(model, optimizer, group_size=4)
    
    print(f"Starting Grim GRPO Reasoning Loop with {len(dataset)} samples...")
    
    # Training Loop with tqdm
    pbar = tqdm(total=MAX_STEPS, desc="Training Grim")
    
    step = 0
    while step < MAX_STEPS:
        for item in dataset:
            if step >= MAX_STEPS:
                break
                
            # Extract prompt and answer
            # Note: The scraper might have different fields, adapting to 'content' as prompt
            # and using a dummy answer if 'answer' is missing for this demo
            prompt = item.get('content', 'Sample Prompt')[:100] # Truncate for display
            answer = str(item.get('answer', '42')) # Default answer if missing
            
            verbose = (step % LOGGING_STEPS == 0)
            mean_reward = trainer.train_step(prompt, answer, verbose=verbose)
            
            pbar.set_postfix({"reward": f"{mean_reward:.4f}"})
            pbar.update(1)
            step += 1

    pbar.close()
    print("Training Complete.")

if __name__ == "__main__":
    main()
