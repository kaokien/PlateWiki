import os
from process_spritesheet import process_spritesheet

# Directory paths
raw_dir = r"C:\Users\kevin\.gemini\antigravity\brain\34ed7b6a-bef7-4a06-9f65-c2e7ab68e314"
public_dir = r"C:\Users\kevin\Documents\antigravity\quick-planck\public\fighters"

jobs = [
    # Stage 1 (Seedling)
    ("stage1_idle_raw_1783384489379.jpg", "stage1_idle.png", 10),
    ("stage1_eating_raw_1783384500081.jpg", "stage1_eating.png", 8),
    ("stage1_levelup_raw_1783384510088.jpg", "stage1_levelup.png", 10),
    
    # Stage 2 (Sprout)
    ("stage2_idle_raw_1783384519870.jpg", "stage2_idle.png", 10),
    ("stage2_eating_raw_1783384529633.jpg", "stage2_eating.png", 8),
    ("stage2_levelup_raw_1783384539741.jpg", "stage2_levelup.png", 10),
    
    # Stage 3 (Fully Mature Hero)
    ("stage3_idle_raw_1783384550356.jpg", "stage3_idle.png", 10),
    ("stage3_eating_raw_1783384559042.jpg", "stage3_eating.png", 8),
    ("stage3_levelup_raw_1783384569916.jpg", "stage3_levelup.png", 10),
    
    # Accessories
    ("apple_hat_idle_raw_1783384578740.jpg", "apple_hat_idle.png", 10),
    ("broccoli_shield_idle_raw_1783384588440.jpg", "broccoli_shield_idle.png", 10)
]

for raw_name, out_name, num_frames in jobs:
    raw_path = os.path.join(raw_dir, raw_name)
    out_path = os.path.join(public_dir, out_name)
    
    if os.path.exists(raw_path):
        print(f"Batch processing: {raw_name} -> {out_name} ({num_frames} frames)")
        try:
            process_spritesheet(raw_path, out_path, num_frames)
        except Exception as e:
            print(f"Failed to process {raw_name}: {e}")
    else:
        print(f"File not found: {raw_path}")
