import os
import sys
import numpy as np
from PIL import Image

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
            # Alternating white and black checkerboard for grid constraints
            color = 240 if (r + c) % 2 == 0 else 15
            y_start, y_end = r * cell_size, (r + 1) * cell_size
            x_start, x_end = c * cell_size, (c + 1) * cell_size
            board[y_start:y_end, x_start:x_end] = color
            
            # Draw a subtle center dot in each cell
            cy, cx = y_start + cell_size // 2, x_start + cell_size // 2
            board[cy-4:cy+4, cx-4:cx+4] = [255, 0, 0] # red center target
            
    img = Image.fromarray(board, "RGB")
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    img.save(output_path, "PNG")
    print(f"Created Pose Board template at: {output_path}")

def key_chroma_green(rgba_array):
    """
    Replaces chroma green background with transparency.
    Samples the corners of the image to detect the flat background color dynamically,
    then keys out only that color to avoid matching organic green items like broccoli.
    """
    h, w, c = rgba_array.shape
    # Sample four corners: (0,0), (0,w-1), (h-1,0), (h-1,w-1)
    corners = [
        rgba_array[0, 0, :3],
        rgba_array[0, w-1, :3],
        rgba_array[h-1, 0, :3],
        rgba_array[h-1, w-1, :3]
    ]
    # Use median corner color as background color
    bg_color = np.median(corners, axis=0)
    
    # Calculate Euclidean distance in RGB to the background color
    dist = np.linalg.norm(rgba_array[:, :, :3] - bg_color, axis=2)
    
    # Key out pixels very close to the background color (tolerance = 30)
    mask = dist < 30
    
    output = rgba_array.copy()
    output[mask] = [0, 0, 0, 0] # Make transparent
    return output

def clean_despeckle(rgba_array):
    """
    Cleans isolated pixels (speckles) on transparency edges.
    """
    alphas = rgba_array[:, :, 3]
    h, w = alphas.shape
    cleaned = rgba_array.copy()
    
    # 3x3 kernel check
    for y in range(1, h-1):
        for x in range(1, w-1):
            if alphas[y, x] > 0:
                # Count non-transparent neighbors
                neighbors = alphas[y-1:y+2, x-1:x+2] > 0
                if np.sum(neighbors) <= 2: # lone pixel or tiny cluster
                    cleaned[y, x] = [0, 0, 0, 0]
    return cleaned

def get_landmark_bottom_center(alphas):
    """
    Finds the bottom-most center pixel of the sprite silhouette.
    """
    y_indices, x_indices = np.where(alphas > 0)
    if len(y_indices) == 0:
        return None
        
    y_bottom = np.max(y_indices)
    # Find all x values at the bottom-most row
    x_at_bottom = x_indices[y_indices == y_bottom]
    x_center = int(np.mean(x_at_bottom))
    return (y_bottom, x_center)

def process_spritesheet(sheet_path, output_sheet_path, num_frames=10, cols=4, rows=3, frame_out_size=256):
    """
    Extracts frames from a Pose Board sheet, aligns them, cleans them, and packs them.
    """
    print(f"Processing spritesheet: {sheet_path}")
    img = Image.open(sheet_path).convert("RGBA")
    w, h = img.size
    
    cell_w = w / cols
    cell_h = h / rows
    
    rgba = np.array(img)
    # Key out chroma green background
    rgba_keyed = key_chroma_green(rgba)
    
    frames = []
    landmarks = []
    
    # Step 1: Extract cells and find landmarks
    for i in range(num_frames):
        r = i // cols
        c = i % cols
        
        # Calculate bounding box using floats to avoid rounding accumulative error
        x_start = int(c * cell_w)
        x_end = int((c + 1) * cell_w)
        y_start = int(r * cell_h)
        y_end = int((r + 1) * cell_h)
        
        cell = rgba_keyed[y_start:y_end, x_start:x_end]
        cell_cleaned = clean_despeckle(cell)
        
        alphas = cell_cleaned[:, :, 3]
        landmark = get_landmark_bottom_center(alphas)
        
        frames.append(cell_cleaned)
        landmarks.append(landmark)
        
    # Target feet anchor in 256x256 frame: X=128, Y=210 (leaving room at top)
    target_x = frame_out_size // 2
    target_y = int(frame_out_size * 0.82) 
    
    aligned_frames = []
    
    # Step 2: Align frames relative to landmark
    for idx, (frame, landmark) in enumerate(zip(frames, landmarks)):
        aligned = np.zeros((frame_out_size, frame_out_size, 4), dtype=np.uint8)
        
        if landmark is None:
            aligned_frames.append(aligned)
            continue
            
        ly, lx = landmark
        # Translate frame so that (lx, ly) in the crop maps to (target_x, target_y) in the output frame
        offset_x = target_x - lx
        offset_y = target_y - ly
        
        frame_h, frame_w, _ = frame.shape
        
        for y in range(frame_out_size):
            src_y = y - offset_y
            if src_y < 0 or src_y >= frame_h:
                continue
            for x in range(frame_out_size):
                src_x = x - offset_x
                if src_x < 0 or src_x >= frame_w:
                    continue
                aligned[y, x] = frame[src_y, src_x]
                
        aligned_frames.append(aligned)
        
    # Step 3: Pack into a single horizontal sprite sheet
    pack_w = frame_out_size * num_frames
    pack_h = frame_out_size
    packed = np.zeros((pack_h, pack_w, 4), dtype=np.uint8)
    
    for idx, f in enumerate(aligned_frames):
        x_start = idx * frame_out_size
        x_end = (idx + 1) * frame_out_size
        packed[:, x_start:x_end] = f
        
    packed_img = Image.fromarray(packed, "RGBA")
    os.makedirs(os.path.dirname(output_sheet_path), exist_ok=True)
    packed_img.save(output_sheet_path, "PNG")
    print(f"Successfully packed {num_frames} frames into: {output_sheet_path}")

def synthesize_accessory_sheet(char_sheet_path, base_item_path, output_sheet_path, num_frames=10, frame_size=256):
    """
    Synthesizes an accessory sprite sheet by tracking character head/body movement
    across its animation frames and shifting the base item frame-by-frame.
    """
    print(f"Synthesizing accessory sheet: {output_sheet_path}")
    char_img = Image.open(char_sheet_path).convert("RGBA")
    char_rgba = np.array(char_img)
    
    # Load base item (which is already aligned to the standing character pose)
    item_img = Image.open(base_item_path).convert("RGBA")
    # Clean chroma green on item
    item_rgba = clean_despeckle(key_chroma_green(np.array(item_img)))
    
    # Crop item to its bounds inside the 1024x1024 anchor coordinates
    # We first resize the item to 256x256 since anchors are scaled to 1024
    item_pil = Image.fromarray(item_rgba, "RGBA").resize((frame_size, frame_size), Image.Resampling.NEAREST)
    item_rgba_256 = np.array(item_pil)
    
    alphas_item = item_rgba_256[:, :, 3]
    y_idx, x_idx = np.where(alphas_item > 0)
    
    if len(y_idx) == 0:
        print(f"WARNING: Item {base_item_path} is fully transparent after keying! Saving empty.")
        # Save empty spritesheet
        packed = np.zeros((frame_size, frame_size * num_frames, 4), dtype=np.uint8)
        Image.fromarray(packed, "RGBA").save(output_sheet_path, "PNG")
        return
        
    ymin, ymax = np.min(y_idx), np.max(y_idx)
    xmin, xmax = np.min(x_idx), np.max(x_idx)
    
    # Extracted item sprite bounding box
    item_cropped = item_rgba_256[ymin:ymax+1, xmin:xmax+1]
    
    # Find head/body top height in character frame 0
    char_f0 = char_rgba[:, 0:frame_size]
    f0_alphas = char_f0[:, :, 3]
    f0_y = np.where(f0_alphas > 0)[0]
    base_head_y = np.min(f0_y) if len(f0_y) > 0 else frame_size // 2
    
    packed = np.zeros((frame_size, frame_size * num_frames, 4), dtype=np.uint8)
    
    for i in range(num_frames):
        # Extract character frame i
        char_fi = char_rgba[:, i*frame_size:(i+1)*frame_size]
        fi_alphas = char_fi[:, :, 3]
        fi_y = np.where(fi_alphas > 0)[0]
        
        # Calculate Y offset based on head displacement
        curr_head_y = np.min(fi_y) if len(fi_y) > 0 else base_head_y
        dy = curr_head_y - base_head_y
        
        # Calculate X offset (sway)
        f0_x = np.where(f0_alphas > 0)[1]
        fi_x = np.where(fi_alphas > 0)[1]
        base_center_x = int(np.mean(f0_x)) if len(f0_x) > 0 else frame_size // 2
        curr_center_x = int(np.mean(fi_x)) if len(fi_x) > 0 else base_center_x
        dx = curr_center_x - base_center_x
        
        # Shift and place item inside output frame
        out_frame = np.zeros((frame_size, frame_size, 4), dtype=np.uint8)
        
        dest_ymin = ymin + dy
        dest_xmin = xmin + dx
        
        # Draw item_cropped into out_frame at shifted position
        for y in range(item_cropped.shape[0]):
            oy = dest_ymin + y
            if oy < 0 or oy >= frame_size:
                continue
            for x in range(item_cropped.shape[1]):
                ox = dest_xmin + x
                if ox < 0 or ox >= frame_size:
                    continue
                out_frame[oy, ox] = item_cropped[y, x]
                
        # Copy to output spritesheet
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
