import os
import sys
import numpy as np
from PIL import Image

def get_palette_colors(img, k):
    """
    Extracts the K most dominant colors from the image (excluding transparent pixels)
    using Pillow's adaptive quantization.
    """
    # Filter transparent pixels out to avoid black/green bias in palette
    rgba = np.array(img.convert("RGBA"))
    r, g, b, a = rgba[:,:,0], rgba[:,:,1], rgba[:,:,2], rgba[:,:,3]
    visible_pixels = rgba[a > 127]
    
    if len(visible_pixels) == 0:
        return np.array([[0, 255, 0, 255]])  # default chroma green
        
    # Convert visible pixels to a temporary RGB image to quantize
    rgb_data = visible_pixels[:, :3]
    temp_img = Image.fromarray(rgb_data.reshape(1, -1, 3), "RGB")
    quantized = temp_img.convert("P", palette=Image.Palette.ADAPTIVE, colors=k)
    
    # Extract palette colors
    palette = quantized.getpalette()
    colors = []
    for i in range(min(k, len(palette) // 3)):
        colors.append([palette[i*3], palette[i*3+1], palette[i*3+2], 255])
    return np.array(colors)

def find_nearest_palette_color(pixel_rgb, palette):
    """
    Finds the index of the nearest color in the palette using Euclidean distance.
    """
    distances = np.linalg.norm(palette[:, :3] - pixel_rgb, axis=1)
    return np.argmin(distances)

def snap_pixels(image_path, output_path, grid_size=64, k_colors=16, scale_up_size=1024):
    """
    Snaps an image to a pixel art grid and K-color palette, then scales it back up.
    """
    print(f"Processing: {image_path}")
    img = Image.open(image_path).convert("RGBA")
    w, h = img.size
    
    # Step 1: Extract dominant palette colors
    palette = get_palette_colors(img, k_colors)
    
    # Step 2: Divide into grid and snap
    # Calculate cell dimensions (may be floats, we will iterate using ranges)
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
            
            # Extract cell slice
            cell = rgba[y_start:y_end, x_start:x_end]
            if cell.size == 0:
                continue
                
            # Filter non-transparent pixels
            alphas = cell[:, :, 3]
            visible_mask = alphas > 127
            visible_count = np.sum(visible_mask)
            total_count = cell.shape[0] * cell.shape[1]
            
            # If cell is mostly transparent, keep it transparent
            if visible_count < total_count * 0.4:
                snapped_grid[y, x] = [0, 0, 0, 0] # fully transparent
            else:
                # Find dominant color in cell
                visible_pixels = cell[visible_mask][:, :3]
                
                # Map each visible pixel to its nearest palette color
                color_indices = [find_nearest_palette_color(p, palette) for p in visible_pixels]
                
                # Vote for dominant palette color
                counts = np.bincount(color_indices)
                dominant_idx = np.argmax(counts)
                
                snapped_grid[y, x] = palette[dominant_idx]

    # Create small grid image
    snapped_img = Image.fromarray(snapped_grid, "RGBA")
    
    # Step 3: Scale back up using Nearest Neighbor to retain sharp edges
    scaled_img = snapped_img.resize((scale_up_size, scale_up_size), Image.Resampling.NEAREST)
    
    # Create directory if it doesn't exist
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    scaled_img.save(output_path, "PNG")
    print(f"Saved snapped and scaled pixel art to: {output_path}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pixel_snapper.py <input_image> <output_image> [grid_size] [k_colors] [scale_up_size]")
        sys.exit(1)
        
    in_img = sys.argv[1]
    out_img = sys.argv[2]
    grid = int(sys.argv[3]) if len(sys.argv) > 3 else 64
    k = int(sys.argv[4]) if len(sys.argv) > 4 else 16
    scale = int(sys.argv[5]) if len(sys.argv) > 5 else 1024
    
    snap_pixels(in_img, out_img, grid, k, scale)
