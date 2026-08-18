"""Generate public WebP derivatives from private archival artwork masters.

Requires Pillow. Masters remain untouched under archive-masters/ and the
generated files are the only artwork images delivered by the web application.
"""

import argparse
import json
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SERIES_II_MASTER_DIR = ROOT / 'archive-masters' / 'Flagships'
SERIES_I_MANIFEST = ROOT / 'src' / 'data' / 'series-i-master-manifest.json'
PUBLIC_DIR = ROOT / 'public' / 'artworks'
WIDTHS = (480, 900, 1440, 2400)


def build_derivatives(artwork_id: str, source: Path) -> None:
    output_dir = PUBLIC_DIR / artwork_id
    output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original).convert('RGB')
        for width in WIDTHS:
            derivative = image.copy()
            derivative.thumbnail((width, image.height), Image.Resampling.LANCZOS)
            derivative.save(output_dir / f'{width}.webp', 'WEBP', quality=92, method=6)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('artwork_ids', nargs='*', help='Canonical artwork IDs to generate')
    args = parser.parse_args()

    with SERIES_I_MANIFEST.open(encoding='utf-8') as manifest_file:
        series_i_manifest = json.load(manifest_file)

    series_i_root = ROOT / series_i_manifest['mastersRoot']
    sources = [
        (entry['id'], series_i_root / entry['source'])
        for entry in series_i_manifest['artworks']
    ]
    sources.extend((source.stem, source) for source in sorted(SERIES_II_MASTER_DIR.glob('VL-B-*.jpg')))

    if not sources:
        raise SystemExit('No archival masters found')

    if args.artwork_ids:
        requested_ids = set(args.artwork_ids)
        sources = [(artwork_id, source) for artwork_id, source in sources if artwork_id in requested_ids]
        missing_ids = requested_ids - {artwork_id for artwork_id, _ in sources}
        if missing_ids:
            raise SystemExit(f'No archival master mapping found for: {", ".join(sorted(missing_ids))}')

    for artwork_id, source in sources:
        if not source.is_file():
            raise SystemExit(f'Archival master not found: {source}')
        build_derivatives(artwork_id, source)
        print(f'Generated derivatives for {artwork_id}')


if __name__ == '__main__':
    main()
