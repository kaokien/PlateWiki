import os
from process_spritesheet import process_spritesheet

# Directory paths
raw_dir = r"C:\Users\kevin\.gemini\antigravity\brain\34ed7b6a-bef7-4a06-9f65-c2e7ab68e314"
public_dir = r"C:\Users\kevin\Documents\antigravity\quick-planck\public\fighters"

jobs = [
    # Stage 1 (Male Rookie Boxer)
    ("stage1_athlete_idle_raw_1783385136268.jpg", "stage1_idle.png", 10),
    ("stage1_athlete_eating_raw_1783385143735.jpg", "stage1_eating.png", 8),
    ("stage1_athlete_levelup_raw_1783385156720.jpg", "stage1_levelup.png", 10),
    
    # Stage 2 (Male Contender Boxer)
    ("stage2_athlete_idle_raw_1783385166159.jpg", "stage2_idle.png", 10),
    ("stage2_athlete_eating_raw_1783385176673.jpg", "stage2_eating.png", 8),
    ("stage2_athlete_levelup_raw_1783385188465.jpg", "stage2_levelup.png", 10),
    
    # Stage 3 (Male Champion Boxer)
    ("stage3_athlete_idle_raw_1783385198353.jpg", "stage3_idle.png", 10),
    ("stage3_athlete_eating_raw_1783385206083.jpg", "stage3_eating.png", 8),
    ("stage3_athlete_levelup_raw_1783385217500.jpg", "stage3_levelup.png", 10),

    # Stage 1 (Female Rookie Boxer)
    ("stage1_female_athlete_idle_raw_1783385859951.jpg", "stage1_female_idle.png", 10),
    ("stage1_female_athlete_eating_raw_1783385869761.jpg", "stage1_female_eating.png", 8),
    ("stage1_female_athlete_levelup_raw_1783385880234.jpg", "stage1_female_levelup.png", 10),
    
    # Stage 2 (Female Contender Boxer)
    ("stage2_female_athlete_idle_raw_1783385890045.jpg", "stage2_female_idle.png", 10),
    ("stage2_female_athlete_eating_raw_1783385901287.jpg", "stage2_female_eating.png", 8),
    ("stage2_female_athlete_levelup_raw_1783385915196.jpg", "stage2_female_levelup.png", 10),
    
    # Stage 3 (Female Champion Boxer)
    ("stage3_female_athlete_idle_raw_1783385924143.jpg", "stage3_female_idle.png", 10),
    ("stage3_female_athlete_eating_raw_1783385934883.jpg", "stage3_female_eating.png", 8),
    ("stage3_female_athlete_levelup_raw_1783385945982.jpg", "stage3_female_levelup.png", 10),
    
    # Accessories (Male version)
    ("apple_hat_idle_raw_1783384578740.jpg", "apple_hat_idle.png", 10),
    ("broccoli_shield_idle_raw_1783384588440.jpg", "broccoli_shield_idle.png", 10)
]

for raw_name, out_name, num_frames in jobs:
    raw_path = os.path.join(raw_dir, raw_name)
    out_path = os.path.join(public_dir, out_name)
    
    if os.path.exists(raw_path):
        print(f"Batch processing: {raw_name} -> {out_name} ({num_frames} frames)")
        try:
            process_spritesheet(raw_path, out_path, num_frames, cols=4, rows=3)
        except Exception as e:
            print(f"Failed to process {raw_name}: {e}")
    else:
        print(f"File not found: {raw_path}")
