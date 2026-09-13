from pathlib import Path

from PIL import Image, ImageChops


assets = Path(__file__).resolve().parents[1] / 'src' / 'assets'
for name in ('hero-image', 'card-feature', 'image-3', 'image-4'):
    source = assets / f'{name}.png'
    target = assets / f'{name}.webp'
    with Image.open(source) as image:
        image.save(target, 'WEBP', lossless=True, method=6)
        with Image.open(target) as result:
            if ImageChops.difference(image.convert('RGBA'), result.convert('RGBA')).getbbox():
                raise RuntimeError(f'{name}: pixels changed')
    print(f'{name}: {source.stat().st_size:,} -> {target.stat().st_size:,} bytes')
