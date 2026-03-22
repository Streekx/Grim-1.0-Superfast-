import torch
import torch.nn as nn
import torch.nn.functional as F
import re
import numpy as np
from typing import List, Dict
from model import GrimModel

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
        except ValueError:
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
        # In a full implementation, we would compute the log_probs of the completions
        # under the current policy and the old policy to get the ratio 'r'.
        # Here we demonstrate the core advantage-weighted update logic.
        
        total_loss = 0
        for i in range(self.group_size):
            # log_prob = self.model.get_log_probs(prompt_ids, completions[i])
            # ratio = torch.exp(log_prob - old_log_prob)
            # surrogate1 = ratio * advantages[i]
            # surrogate2 = torch.clamp(ratio, 1-self.epsilon, 1+self.epsilon) * advantages[i]
            # total_loss += -torch.min(surrogate1, surrogate2).mean()
            
            # Simplified for demonstration:
            total_loss += -advantages[i] # Minimize negative advantage
            
        return total_loss / self.group_size

    def train_step(self, prompt: str, ground_truth: str):
        """
        Performs a single GRPO training step.
        """
        self.optimizer.zero_grad()
        
        # 1. Generate a group of completions
        completions = []
        raw_texts = []
        for _ in range(self.group_size):
            # Mock generation: In reality, use model.generate() with sampling
            # generated_ids = self.model.generate(prompt_ids, ...)
            # completions.append(generated_ids)
            
            # For demo, we simulate a completion
            simulated_text = "<thought>Calculating 2+2...</thought> Answer: 4"
            raw_texts.append(simulated_text)
            
        # 2. Calculate Rewards
        rewards = []
        for text in raw_texts:
            r = self.math_reward(text, ground_truth) + self.logic_reward(text)
            rewards.append(r)
        
        rewards_tensor = torch.tensor(rewards, dtype=torch.float32)
        
        # 3. Compute Loss and Backprop
        # loss = self.compute_grpo_loss(prompt_ids, completions, rewards_tensor)
        # loss.backward()
        # self.optimizer.step()
        
        print(f"GRPO Step | Mean Reward: {rewards_tensor.mean().item():.4f} | Max Reward: {rewards_tensor.max().item():.4f}")

def main():
    # Initialize Grim Model
    model = GrimModel(vocab_size=30000)
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-5)
    
    # Initialize GRPO Trainer
    trainer = GRPOTrainer(model, optimizer, group_size=4)
    
    # Training Loop
    dataset = [
        {"prompt": "What is 15 * 3?", "answer": "45"},
        {"prompt": "Solve for x: 2x + 5 = 15", "answer": "5"},
        {"prompt": "If a train travels at 60km/h, how far does it go in 2.5 hours?", "answer": "150"}
    ]
    
    print("Starting Grim GRPO Reasoning Loop...")
    for epoch in range(5):
        for item in dataset:
            trainer.train_step(item["prompt"], item["answer"])

if __name__ == "__main__":
    main()
