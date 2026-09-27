"""Package actual browser screenshot samples; does not synthesize motion frames."""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parents[1] / 'Review-Screenshots'
for context in ['home', 'series-i', 'series-ii']:
    paths = sorted(root.glob(f'reliability-{context}-recording-*.png'))
    frames = [Image.open(p).convert('RGB') for p in paths]
    durations = [max(60, min(1200, int((b.stat().st_mtime-a.stat().st_mtime)*1000))) for a, b in zip(paths, paths[1:])] + [1000]
    frames[0].save(root / f'reliability-{context}-recording.webp', save_all=True, append_images=frames[1:], duration=durations, loop=0, quality=80)
    sheet = Image.new('RGB', (1200, ((len(frames)+7)//8)*350), '#e8e5df')
    draw = ImageDraw.Draw(sheet)
    for i, frame in enumerate(frames):
        frame.thumbnail((150, 325))
        x, y = (i % 8)*150, (i//8)*350
        sheet.paste(frame, (x, y))
        draw.text((x+4, y+327), paths[i].stem.rsplit('-', 1)[-1], fill='#222222')
    sheet.save(root / f'reliability-{context}-contact-sheet.jpg', quality=90)
    print(context, len(paths), 'actual screenshot frames')
