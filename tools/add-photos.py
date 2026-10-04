#!/usr/bin/env python3
"""
Add a folder of photos to the photo book.

    python3 tools/add-photos.py "/path/to/Folder" my-chapter-slug

What it does:
  - makes two web copies of every JPG or PNG image in the folder:
      assets/photos/<slug>/NNN-lg.jpg  (1600px, for big layouts and the viewer)
      assets/photos/<slug>/NNN-sm.jpg  (720px, for small grid cells)
  - strips all metadata (camera data and GPS location never reach the site)
  - records each photo's shape in assets/photos/ratios.js so the book can lay it out
  - prints a chapter block to paste into content.js (fill in the alt text)

Needs Pillow:  python3 -m pip install Pillow
"""
import json, os, re, sys
from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RATIOS = os.path.join(ROOT, 'assets', 'photos', 'ratios.js')


def load_ratios():
    if not os.path.exists(RATIOS):
        return {}
    text = open(RATIOS, encoding='utf-8').read()
    m = re.search(r'Object\.assign\(window\.PHOTO_RATIOS \|\| \{\}, (\{.*\})\);', text, re.S)
    return json.loads(m.group(1)) if m else {}


def save_ratios(ratios):
    with open(RATIOS, 'w', encoding='utf-8') as f:
        f.write('/* Width / height of each photo, written by tools/add-photos.py. Used to lay out the photo book. */\n')
        f.write('window.PHOTO_RATIOS = Object.assign(window.PHOTO_RATIOS || {}, ' + json.dumps(ratios, separators=(',', ':')) + ');\n')


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    src, slug = sys.argv[1], sys.argv[2]
    if not re.fullmatch(r'[a-z0-9-]+', slug):
        sys.exit('The slug should be lowercase letters, numbers and dashes, e.g. "bay-area-birds".')
    files = sorted(f for f in os.listdir(src) if re.search(r'\.(jpe?g|png)$', f, re.I))
    if not files:
        sys.exit('No JPG or PNG files found in that folder.')
    out = os.path.join(ROOT, 'assets', 'photos', slug)
    os.makedirs(out, exist_ok=True)
    ratios = load_ratios()
    lines = []
    for n, fn in enumerate(files, 1):
        im = Image.open(os.path.join(src, fn))
        try:
            im.draft('RGB', (2000, 2000))
        except Exception:
            pass
        im = ImageOps.exif_transpose(im)
        if im.mode in ('RGBA', 'LA', 'P'):
            im = im.convert('RGBA')
            bg = Image.new('RGB', im.size, (20, 20, 20))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert('RGB')
        ratios[f'{slug}/{n:03d}'] = round(im.width / im.height, 3)
        for tag, edge, q in (('lg', 1600, 76), ('sm', 720, 72)):
            c = im.copy()
            c.thumbnail((edge, edge), Image.LANCZOS)
            c.save(os.path.join(out, f'{n:03d}-{tag}.jpg'), 'JPEG', quality=q, optimize=True, progressive=True)
        lines.append(f"            [{n}, ''],  // {fn}")
        print(f'  {n:3d}  {fn}')
    save_ratios(ratios)
    print(f'\nAdded {len(files)} photos. Paste this into the photo book in content.js and write the alt text:\n')
    print(f"        {{ slug: '{slug}', title: 'Chapter title', part: 'Wildlife & landscape', text: ['One line about this set.'],")
    print(f"          media: PH('{slug}', [")
    print('\n'.join(lines))
    print('          ]) },')


if __name__ == '__main__':
    main()
