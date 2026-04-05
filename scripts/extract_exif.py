#!/usr/bin/env python3
"""
Extract EXIF metadata from photos and generate gallery JSON
"""

import subprocess
import json
import os
from pathlib import Path
from datetime import datetime

PHOTO_DIR = "/DATA/nest/fotki"
OUTPUT_FILE = "/home/hushus/main_page/data/gallery.json"

def get_exif_data(filepath):
    """Extract EXIF data using exiftool"""
    try:
        result = subprocess.run(
            ['exiftool', '-json', filepath],
            capture_output=True,
            text=True,
            timeout=5
        )

        if result.returncode == 0:
            data = json.loads(result.stdout)[0]

            # Extract key fields
            exif = {
                'filename': Path(filepath).name,
                'camera': data.get('Model', 'Unknown'),
                'lens': data.get('LensModel', 'Unknown'),
                'focal_length': data.get('FocalLength', 'Unknown'),
                'aperture': data.get('FNumber', 'Unknown'),
                'iso': data.get('ISO', 'Unknown'),
                'shutter': data.get('ExposureTime', 'Unknown'),
                'date': data.get('DateTimeOriginal', 'Unknown'),
            }

            return exif
    except Exception as e:
        print(f"Error extracting EXIF from {filepath}: {e}")

    return None

def categorize_photo(exif_data, index):
    """Simple categorization based on focal length & aperture"""
    focal = exif_data.get('focal_length', '')
    camera = exif_data.get('camera', '')

    # Sony A6600 + longer focal length = portraits
    if 'ILCE-6600' in camera and ('85' in str(focal) or '200' in str(focal)):
        return 'portraits'

    # Sony A7C + wider = nature/landscape
    if 'ILCE-7C' in camera and ('24' in str(focal) or '33' in str(focal)):
        return 'nature'

    # Default distribution
    if index % 3 == 0:
        return 'portraits'
    elif index % 3 == 1:
        return 'nature'
    else:
        return 'urban'

def main():
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    photos = []

    # Get all JPG files
    jpg_files = sorted(Path(PHOTO_DIR).glob('*.jpg'))

    print(f"📸 Processing {len(jpg_files)} photos...")

    for idx, photo_path in enumerate(jpg_files):
        exif = get_exif_data(str(photo_path))

        if exif:
            category = categorize_photo(exif, idx)
            exif['category'] = category
            photos.append(exif)
            print(f"✓ {exif['filename']} | {category} | {exif['camera']} | f/{exif['aperture']} | ISO {exif['iso']}")
        else:
            print(f"✗ {photo_path.name}")

    # Save to JSON
    gallery_data = {
        'total': len(photos),
        'generated': datetime.now().isoformat(),
        'photos': photos,
        'stats': {
            'portraits': len([p for p in photos if p['category'] == 'portraits']),
            'nature': len([p for p in photos if p['category'] == 'nature']),
            'urban': len([p for p in photos if p['category'] == 'urban']),
        }
    }

    with open(OUTPUT_FILE, 'w') as f:
        json.dump(gallery_data, f, indent=2)

    print(f"\n✅ Saved to {OUTPUT_FILE}")
    print(f"\n📊 Summary:")
    print(f"   Portraits: {gallery_data['stats']['portraits']}")
    print(f"   Nature: {gallery_data['stats']['nature']}")
    print(f"   Urban: {gallery_data['stats']['urban']}")

    return gallery_data

if __name__ == '__main__':
    main()
