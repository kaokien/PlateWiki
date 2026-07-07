import os
from process_spritesheet import synthesize_accessory_sheet

# Paths
public_dir = r"C:\Users\kevin\Documents\antigravity\quick-planck\public\fighters"

# Base items
apple_hat_base = os.path.join(public_dir, "apple_hat.png")
broccoli_shield_base = os.path.join(public_dir, "broccoli_shield.png")

# Synthesize Apple Hat animations for all 3 stages
stages = ["stage1", "stage2", "stage3"]
anims = [
    ("idle", 10),
    ("eating", 8),
    ("levelup", 10)
]

for stage in stages:
    for anim, num_frames in anims:
        char_sheet = os.path.join(public_dir, f"{stage}_{anim}.png")
        
        # Apple Hat
        out_hat = os.path.join(public_dir, f"apple_hat_{stage}_{anim}.png")
        if os.path.exists(char_sheet) and os.path.exists(apple_hat_base):
            synthesize_accessory_sheet(char_sheet, apple_hat_base, out_hat, num_frames)
            
        # Broccoli Shield
        out_shield = os.path.join(public_dir, f"broccoli_shield_{stage}_{anim}.png")
        if os.path.exists(char_sheet) and os.path.exists(broccoli_shield_base):
            synthesize_accessory_sheet(char_sheet, broccoli_shield_base, out_shield, num_frames)
