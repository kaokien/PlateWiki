import os
import sys
import numpy as np
from PIL import Image, ImageDraw

def create_pose_board(output_path):
    """
    Creates a 2048x1536 grid (twelve 512x512 cells) with alternating checkerboard blocks.
    """
    cell_size = 512
    cols, rows = 4, 3
    w = cols * cell_size
    h = rows * cell_size
    
    board = np.zeros((h, w, 3), dtype=np.uint8)
    for r in range(rows):
        for c in range(cols):
            # Alternating light and dark green checkerboard for grid constraints
            color = [0, 230, 0] if (r + c) % 2 == 0 else [0, 180, 0]
            y_start, y_end = r * cell_size, (r + 1) * cell_size
            x_start, x_end = c * cell_size, (c + 1) * cell_size
            board[y_start:y_end, x_start:x_end] = color
            
            # Draw a subtle center dot in each cell
            cy, cx = y_start + cell_size // 2, x_start + cell_size // 2
            board[cy-4:cy+4, cx-4:cx+4] = [0, 100, 0] # subtle green center target
            
    img = Image.fromarray(board, "RGB")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Created Pose Board template at: {output_path}")

def key_chroma_green(img, thresh=85):
    """
    Replaces chroma green background with transparency.
    Uses PIL's floodfill from the four corners to remove the background green,
    avoiding matching similar greens inside the character/item itself.
    Then, keys out remaining neon green border/fringe pixels using HSV distance checks.
    """
    img = img.convert("RGBA")
    w, h = img.size
    
    # 1. Flood fill transparent from each corner
    for corner in [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)]:
        try:
            ImageDraw.floodfill(img, corner, (0, 0, 0, 0), thresh=thresh)
        except Exception:
            pass
            
    # 2. Key out any remaining neon green fringe pixels
    arr = np.array(img)
    r = arr[:, :, 0].astype(float) / 255.0
    g = arr[:, :, 1].astype(float) / 255.0
    b = arr[:, :, 2].astype(float) / 255.0
    a = arr[:, :, 3]
    
    mx = np.maximum(np.maximum(r, g), b)
    mn = np.minimum(np.minimum(r, g), b)
    df = mx - mn
    
    s = np.zeros_like(mx)
    s[mx > 0] = df[mx > 0] / mx[mx > 0]
    
    h_val = np.zeros_like(mx)
    mask_g = (mx == g) & (df > 0)
    h_val[mask_g] = (b[mask_g] - r[mask_g]) / df[mask_g] + 2.0
    mask_b = (mx == b) & (df > 0)
    h_val[mask_b] = (r[mask_b] - g[mask_b]) / df[mask_b] + 4.0
    mask_r = (mx == r) & (df > 0)
    h_val[mask_r] = (g[mask_r] - b[mask_r]) / df[mask_r]
    h_val = (h_val / 6.0) % 1.0
    
    h_deg = h_val * 360.0
    s_val = s * 255.0
    v_val = mx * 255.0
    
    # Neon green fringe: Hue in [75, 165], Saturation > 110, Value > 120
    is_fringe = (h_deg >= 75) & (h_deg <= 165) & (s_val > 110) & (v_val > 120) & (a > 0)
    
    arr[is_fringe] = [0, 0, 0, 0]
    return Image.fromarray(arr, "RGBA")

def clean_despeckle(img):
    """
    Cleans isolated pixels (speckles) on transparency edges.
    """
    rgba_array = np.array(img)
    alphas = rgba_array[:, :, 3]
    h, w = alphas.shape
    cleaned = rgba_array.copy()
    
    # 3x3 kernel check
    for y in range(1, h-1):
        for x in range(1, w-1):
            if alphas[y, x] > 0:
                neighbors = alphas[y-1:y+2, x-1:x+2] > 0
                if np.sum(neighbors) <= 2: # lone pixel
                    cleaned[y, x] = [0, 0, 0, 0]
    return Image.fromarray(cleaned, "RGBA")

def get_landmark_bottom_center(alphas):
    """
    Finds the bottom-most center pixel of the sprite silhouette.
    """
    y_indices, x_indices = np.where(alphas > 0)
    if len(y_indices) == 0:
        return None
        
    y_bottom = np.max(y_indices)
    x_at_bottom = x_indices[y_indices == y_bottom]
    x_center = int(np.mean(x_at_bottom))
    return (y_bottom, x_center)

def get_character_height(alphas):
    """
    Finds the vertical height of the sprite silhouette.
    """
    y_indices, _ = np.where(alphas > 0)
    if len(y_indices) == 0:
        return 0
    return int(np.max(y_indices) - np.min(y_indices))

def process_spritesheet(sheet_path, output_sheet_path, num_frames=10, cols=4, rows=3, frame_out_size=256):
    """
    Extracts frames from a Pose Board sheet, resizes, aligns, cleans, and packs them.
    """
    print(f"Processing spritesheet: {sheet_path}")
    raw_img = Image.open(sheet_path).convert("RGBA")
    
    # Key out background chroma green using high-threshold corner floodfill
    keyed_img = key_chroma_green(raw_img, thresh=85)
    
    w, h = keyed_img.size
    cell_w = w / cols
    cell_h = h / rows
    
    # Determine target height based on output stage
    if "stage1" in output_sheet_path.lower():
        target_height = 120
    elif "stage2" in output_sheet_path.lower():
        target_height = 145
    elif "stage3" in output_sheet_path.lower():
        target_height = 170
    else:
        # Default target height (e.g. for general items matching stage 2)
        target_height = 145

    cells = []
    cell_bboxes = [] # (xmin, ymin, xmax, ymax)
    cell_heights = []
    
    # Extract frames
    for i in range(num_frames):
        r = i // cols
        c = i % cols
        
        x_start = int(c * cell_w)
        x_end = int((c + 1) * cell_w)
        y_start = int(r * cell_h)
        y_end = int((r + 1) * cell_h)
        
        cell = keyed_img.crop((x_start, y_start, x_end, y_end))
        cell_cleaned = clean_despeckle(cell)
        
        alphas = np.array(cell_cleaned)[:, :, 3]
        y_indices, x_indices = np.where(alphas > 0)
        
        cells.append(cell_cleaned)
        if len(y_indices) > 0:
            ymin, ymax = np.min(y_indices), np.max(y_indices)
            xmin, xmax = np.min(x_indices), np.max(x_indices)
            cell_bboxes.append((xmin, ymin, xmax, ymax))
            cell_heights.append(int(ymax - ymin + 1))
        else:
            cell_bboxes.append(None)

    # Compute sheet-wide uniform scaling factor
    if len(cell_heights) > 0:
        median_h = np.median(cell_heights)
        scale_factor = target_height / median_h
    else:
        scale_factor = 0.5 # fallback
        median_h = 100

    print(f"  Scale Factor calculated: {scale_factor:.3f} (median character height: {median_h:.1f}px)")

    aligned_frames = []
    
    # Align and crop each frame
    for idx, cell in enumerate(cells):
        bbox = cell_bboxes[idx]
        aligned = Image.new("RGBA", (frame_out_size, frame_out_size), (0, 0, 0, 0))
        
        if bbox is not None:
            xmin, ymin, xmax, ymax = bbox
            # Crop just the character
            char_crop = cell.crop((xmin, ymin, xmax, ymax))
            
            # Scale character to fit target height exactly
            new_h = int(target_height)
            new_w = int((xmax - xmin + 1) * scale_factor)
            
            # Avoid 0 width
            if new_w <= 0:
                new_w = 1
                
            scaled_char = char_crop.resize((new_w, new_h), Image.Resampling.NEAREST)
            
            # Place character: feet centered at X=128, Y=205
            offset_x = 128 - (new_w // 2)
            offset_y = 205 - new_h
            
            # Paste scaled sprite into 256x256 frame
            aligned.paste(scaled_char, (int(offset_x), int(offset_y)), scaled_char)
            
        aligned_frames.append(np.array(aligned))

    # Pack horizontally
    pack_w = frame_out_size * num_frames
    packed = np.zeros((frame_out_size, pack_w, 4), dtype=np.uint8)
    
    for idx, f in enumerate(aligned_frames):
        xs = idx * frame_out_size
        xe = (idx + 1) * frame_out_size
        packed[:, xs:xe] = f
        
    packed_img = Image.fromarray(packed, "RGBA")
    os.makedirs(os.path.dirname(output_sheet_path), exist_ok=True)
    packed_img.save(output_sheet_path, "PNG")
    print(f"  Successfully saved spritesheet to: {output_sheet_path}")

def synthesize_accessory_sheet(char_sheet_path, base_item_path, output_sheet_path, num_frames=10, frame_size=256):
    """
    Synthesizes an accessory sprite sheet by tracking character head/body movement
    across its animation frames and shifting the base item frame-by-frame.
    """
    print(f"Synthesizing accessory sheet: {output_sheet_path}")
    char_img = Image.open(char_sheet_path).convert("RGBA")
    char_rgba = np.array(char_img)
    
    # Load base item
    item_img = Image.open(base_item_path).convert("RGBA")
    # Clean chroma green on item
    item_keyed = clean_despeckle(key_chroma_green(item_img, thresh=85))
    
    # Scale item to match output frame size
    item_rgba_256 = np.array(item_keyed.resize((frame_size, frame_size), Image.Resampling.NEAREST))
    
    alphas_item = item_rgba_256[:, :, 3]
    y_idx, x_idx = np.where(alphas_item > 0)
    
    if len(y_idx) == 0:
        print(f"WARNING: Item {base_item_path} is fully transparent after keying! Saving empty.")
        packed = np.zeros((frame_size, frame_size * num_frames, 4), dtype=np.uint8)
        Image.fromarray(packed, "RGBA").save(output_sheet_path, "PNG")
        return
        
    ymin, ymax = np.min(y_idx), np.max(y_idx)
    xmin, xmax = np.min(x_idx), np.max(x_idx)
    item_cropped = item_rgba_256[ymin:ymax+1, xmin:xmax+1]
    
    # Find head/body top height in character frame 0
    char_f0 = char_rgba[:, 0:frame_size]
    f0_alphas = char_f0[:, :, 3]
    f0_y = np.where(f0_alphas > 0)[0]
    base_head_y = np.min(f0_y) if len(f0_y) > 0 else frame_size // 2
    
    packed = np.zeros((frame_size, frame_size * num_frames, 4), dtype=np.uint8)
    
    for i in range(num_frames):
        char_fi = char_rgba[:, i*frame_size:(i+1)*frame_size]
        fi_alphas = char_fi[:, :, 3]
        fi_y = np.where(fi_alphas > 0)[0]
        
        curr_head_y = np.min(fi_y) if len(fi_y) > 0 else base_head_y
        dy = curr_head_y - base_head_y
        
        f0_x = np.where(f0_alphas > 0)[1]
        fi_x = np.where(fi_alphas > 0)[1]
        base_center_x = int(np.mean(f0_x)) if len(f0_x) > 0 else frame_size // 2
        curr_center_x = int(np.mean(fi_x)) if len(fi_x) > 0 else base_center_x
        dx = curr_center_x - base_center_x
        
        out_frame = np.zeros((frame_size, frame_size, 4), dtype=np.uint8)
        
        dest_ymin = ymin + dy
        dest_xmin = xmin + dx
        
        for y in range(item_cropped.shape[0]):
            oy = dest_ymin + y
            if oy < 0 or oy >= frame_size:
                continue
            for x in range(item_cropped.shape[1]):
                ox = dest_xmin + x
                if ox < 0 or ox >= frame_size:
                    continue
                out_frame[oy, ox] = item_cropped[y, x]
                
        packed[:, i*frame_size:(i+1)*frame_size] = out_frame
        
    packed_img = Image.fromarray(packed, "RGBA")
    packed_img.save(output_sheet_path, "PNG")
    print(f"Saved synthesized accessory sheet: {output_sheet_path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python process_spritesheet.py create_template <output_path>")
        print("  python process_spritesheet.py process <sheet_path> <output_path> [num_frames]")
        sys.exit(1)
        
    mode = sys.argv[1]
    if mode == "create_template":
        create_pose_board(sys.argv[2])
    elif mode == "process":
        num_fr = int(sys.argv[4]) if len(sys.argv) > 4 else 10
        process_spritesheet(sys.argv[2], sys.argv[3], num_fr)
    else:
        print(f"Unknown mode: {mode}")
