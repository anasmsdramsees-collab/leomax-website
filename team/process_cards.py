#!/usr/bin/env python3
"""
Process 14 team profile card PNG images:
1. Remove top-left lion icon (cover 0,0 to 160,110 with navy background)
2. Remove top-right "LEOMAX LEADERSHIP PROFILE" text (cover 650,0 to 1122,80 with navy)
3. Replace all gold/beige/warm accent colors with silver
"""

import os
import colorsys
import numpy as np
from PIL import Image

TEAM_DIR = "/Users/anaselimam/Downloads/leomax/website/team"

FILES = [
    "dr-anas.png",
    "kaya-haddad.png",
    "rita-nasser.png",
    "rami-khalidi.png",
    "haya-kuwari.png",
    "laith-darwish.png",
    "hani-masry.png",
    "kamilia-fouad.png",
    "yasin-sherif.png",
    "mashari-otaibi.png",
    "elhanouf-harbi.png",
    "mira-mansoori.png",
    "miral-hakimi.png",
    "valeria-moreno.png",
]


def sample_bg_color(arr, x1, y1, x2, y2):
    """Sample average color from a region (x1,y1)-(x2,y2) in numpy array [H,W,C]."""
    region = arr[y1:y2, x1:x2, :3]
    avg = region.reshape(-1, 3).mean(axis=0)
    return avg.astype(np.uint8)


def process_image(filepath):
    img = Image.open(filepath)

    # Convert RGBA to RGB if needed
    if img.mode == "RGBA":
        background = Image.new("RGB", img.size, (0, 0, 0))
        background.paste(img, mask=img.split()[3])
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    arr = np.array(img, dtype=np.uint8)

    # --- Step 1: Remove top-left lion icon ---
    # Sample navy background from (170,5) to (200,40)
    bg_tl = sample_bg_color(arr, 170, 5, 200, 40)
    arr[0:110, 0:160, :] = bg_tl

    # --- Step 2: Remove top-right text ---
    # Sample navy background from (700,85) to (780,110)
    bg_tr = sample_bg_color(arr, 700, 85, 780, 110)
    arr[0:80, 650:1122, :] = bg_tr

    # --- Step 3: Replace gold/warm accent colors with silver ---
    # Work with float arrays for HSV conversion
    arr_float = arr.astype(np.float32) / 255.0

    R = arr_float[:, :, 0]
    G = arr_float[:, :, 1]
    B = arr_float[:, :, 2]

    # Vectorized HSV conversion
    Cmax = np.maximum(np.maximum(R, G), B)
    Cmin = np.minimum(np.minimum(R, G), B)
    delta = Cmax - Cmin

    # Value
    V = Cmax

    # Saturation
    S = np.where(Cmax > 0, delta / Cmax, 0.0)

    # Hue (in degrees 0-360)
    H = np.zeros_like(R)

    mask_r = (Cmax == R) & (delta > 0)
    mask_g = (Cmax == G) & (delta > 0)
    mask_b = (Cmax == B) & (delta > 0)

    H[mask_r] = (60.0 * ((G[mask_r] - B[mask_r]) / delta[mask_r]) % 6)
    H[mask_g] = (60.0 * ((B[mask_g] - R[mask_g]) / delta[mask_g]) + 2)
    H[mask_b] = (60.0 * ((R[mask_b] - G[mask_b]) / delta[mask_b]) + 4)

    H = H * 60  # H was in range 0-6 above for mask_r, fix:
    # Actually redo properly:
    H2 = np.zeros_like(R)
    # R is max
    eps = 1e-8
    with np.errstate(divide='ignore', invalid='ignore'):
        h_r = (60.0 * np.where(delta > 0, (G - B) / delta, 0.0)) % 360
        h_g = 60.0 * np.where(delta > 0, (B - R) / delta, 0.0) + 120
        h_b = 60.0 * np.where(delta > 0, (R - G) / delta, 0.0) + 240

    H2 = np.where(Cmax == R, h_r, np.where(Cmax == G, h_g, h_b))
    H2 = H2 % 360

    # Gold/warm range: hue 25-65 degrees, saturation > 0.15
    gold_mask = (H2 >= 25) & (H2 <= 65) & (S > 0.15)

    # Replace with silver: pure gray keeping brightness
    # R = V*0.73, G = V*0.73, B = V*0.73
    silver_r = V * 0.73
    silver_g = V * 0.73
    silver_b = V * 0.73

    arr_float[:, :, 0] = np.where(gold_mask, silver_r, arr_float[:, :, 0])
    arr_float[:, :, 1] = np.where(gold_mask, silver_g, arr_float[:, :, 1])
    arr_float[:, :, 2] = np.where(gold_mask, silver_b, arr_float[:, :, 2])

    # Convert back to uint8
    result = (arr_float * 255).clip(0, 255).astype(np.uint8)

    # Save
    out_img = Image.fromarray(result, mode="RGB")
    out_img.save(filepath, format="PNG")

    gold_pixel_count = gold_mask.sum()
    return gold_pixel_count


def main():
    for filename in FILES:
        filepath = os.path.join(TEAM_DIR, filename)
        if not os.path.exists(filepath):
            print(f"  MISSING: {filename}")
            continue
        print(f"Processing {filename}...", end=" ", flush=True)
        count = process_image(filepath)
        print(f"done. ({count:,} gold pixels converted to silver)")
    print("\nAll done!")


if __name__ == "__main__":
    main()
