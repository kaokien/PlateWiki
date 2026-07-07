import os
import sys
import numpy as np
from PIL import Image

# Add current directory to path
sys.path.append(os.path.dirname(__file__))
from process_spritesheet import key_chroma_green, synthesize_accessory_sheet
from pixel_snapper import get_palette_colors, find_nearest_palette_color

def snap_image_to_pixel_art(img, grid_size=32, k_colors=12):
    """
    Cleans up mixels, snaps image to a grid, and maps to dominant colors.
    """
    img = img.convert("RGBA")
    w, h = img.size
    palette = get_palette_colors(img, k_colors)
    
    cell_w = w / grid_size
    cell_h = h / grid_size
    
    rgba = np.array(img)
    snapped_grid = np.zeros((grid_size, grid_size, 4), dtype=np.uint8)
    
    for y in range(grid_size):
        y_start = int(y * cell_h)
        y_end = int((y + 1) * cell_h)
        for x in range(grid_size):
            x_start = int(x * cell_w)
            x_end = int((x + 1) * cell_w)
            
            cell = rgba[y_start:y_end, x_start:x_end]
            if cell.size == 0:
                continue
                
            alphas = cell[:, :, 3]
            visible_mask = alphas > 127
            visible_count = np.sum(visible_mask)
            total_count = cell.shape[0] * cell.shape[1]
            
            if visible_count < total_count * 0.35:
                snapped_grid[y, x] = [0, 0, 0, 0]
            else:
                visible_pixels = cell[visible_mask][:, :3]
                color_indices = [find_nearest_palette_color(p, palette) for p in visible_pixels]
                counts = np.bincount(color_indices)
                dominant_idx = np.argmax(counts)
                snapped_grid[y, x] = palette[dominant_idx]

    snapped_img = Image.fromarray(snapped_grid, "RGBA")
    # Resize back up to 256x256 using nearest neighbor for crispness
    return snapped_img.resize((256, 256), Image.Resampling.NEAREST)

def import_gear(raw_path, item_id, slot_name):
    public_dir = r"C:\Users\kevin\Documents\antigravity\quick-planck\public\fighters"
    
    if not os.path.exists(raw_path):
        print(f"Error: Raw file not found at {raw_path}")
        return False
        
    print(f"Step 1: Loading and keying background of raw image...")
    raw_img = Image.open(raw_path).convert("RGBA")
    keyed_img = key_chroma_green(raw_img, thresh=85)
    
    print(f"Step 2: Snapping to pixel art grid and quantizing colors...")
    snapped_base = snap_image_to_pixel_art(keyed_img, grid_size=32, k_colors=12)
    
    # Save the base inventory icon
    base_out_path = os.path.join(public_dir, f"{item_id}.png")
    snapped_base.save(base_out_path, "PNG")
    print(f"Saved base inventory asset: {base_out_path}")
    
    print(f"Step 3: Synthesizing animated paper doll layers across all stages & genders...")
    stages = ["stage1", "stage2", "stage3"]
    genders = ["", "female_"]
    anims = [("idle", 10), ("eating", 8), ("levelup", 10)]
    
    synthesized_count = 0
    for stage in stages:
        for gender in genders:
            for anim, num_frames in anims:
                char_sheet_name = f"{stage}_{gender}{anim}.png"
                char_sheet = os.path.join(public_dir, char_sheet_name)
                
                if os.path.exists(char_sheet):
                    out_sheet_name = f"{item_id}_{stage}_{gender}{anim}.png"
                    out_sheet = os.path.join(public_dir, out_sheet_name)
                    synthesize_accessory_sheet(char_sheet, base_out_path, out_sheet, num_frames)
                    synthesized_count += 1
                    
    print(f"Successfully generated {synthesized_count} paper-doll overlay sheets.")
    print(f"\nStep 4: Add the following entry to DEFAULT_GEAR in src/data/fighterSprites.ts:\n")
    print(f"  {{ id: '{item_id}', slot: '{slot_name}', name: '{item_id.replace('-', ' ').title()}', rarity: 'rare', cssClass: 'gear-{item_id}' }},")
    return True

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python import_gear_item.py <raw_image_path> <item_id> <slot>")
        print("Example: python import_gear_item.py C:\\path\\to\\raw.png strawberry-shield gloves")
        sys.exit(1)
        
    import_gear(sys.argv[1], sys.argv[2], sys.argv[3])
