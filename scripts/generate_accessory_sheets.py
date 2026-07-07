import os
from process_spritesheet import synthesize_accessory_sheet

# Paths
public_dir = r"C:\Users\kevin\Documents\antigravity\quick-planck\public\fighters"

# Base items
apple_hat_base = os.path.join(public_dir, "apple_hat.png")
broccoli_shield_base = os.path.join(public_dir, "broccoli_shield.png")

stages = ["stage1", "stage2", "stage3"]
genders = ["", "female_"] # empty string for male, 'female_' for female
anims = [
    ("idle", 10),
    ("eating", 8),
    ("levelup", 10)
]

for stage in stages:
    for gender in genders:
        for anim, num_frames in anims:
            # character sheet name e.g. stage1_idle.png or stage1_female_idle.png
            char_sheet_name = f"{stage}_{gender}{anim}.png"
            char_sheet = os.path.join(public_dir, char_sheet_name)
            
            if os.path.exists(char_sheet):
                # Apple Hat output sheet e.g. apple_hat_stage1_female_idle.png
                out_hat_name = f"apple_hat_{stage}_{gender}{anim}.png"
                out_hat = os.path.join(public_dir, out_hat_name)
                if os.path.exists(apple_hat_base):
                    synthesize_accessory_sheet(char_sheet, apple_hat_base, out_hat, num_frames)
                    
                # Broccoli Shield output sheet e.g. broccoli_shield_stage1_female_idle.png
                out_shield_name = f"broccoli_shield_{stage}_{gender}{anim}.png"
                out_shield = os.path.join(public_dir, out_shield_name)
                if os.path.exists(broccoli_shield_base):
                    synthesize_accessory_sheet(char_sheet, broccoli_shield_base, out_shield, num_frames)
            else:
                print(f"Skipping: {char_sheet} not found.")
