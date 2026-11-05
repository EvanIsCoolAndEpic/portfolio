#!/usr/bin/env python3
"""
Add a folder of photos to the photo book.

    python3 tools/add-photos.py "/path/to/Folder" my-chapter-slug
    python3 tools/add-photos.py "/path/to/Digitals" --digitals

What it does:
  - makes two web copies of every JPG or PNG image in the folder:
      assets/photos/<slug>/NNN-lg.jpg  (1600px, for big layouts and the viewer)
      assets/photos/<slug>/NNN-sm.jpg  (720px, for small grid cells)
  - strips all metadata (camera data and GPS location never reach the site)
  - records each photo's shape in assets/photos/ratios.js so the book can lay it out
  - prints a chapter block to paste into content.js (fill in the alt text)

With --digitals it fills the unlisted digitals page instead: copies go to digitals/photos/
(2000px and 720px), nothing is written to ratios.js so the main site never mentions them,
and it prints the `photos` lines to paste into digitals/index.html. It replaces what was there.

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


def web_copies(path, out, n, sizes):
    """Save upright, metadata-free JPEG copies of one photo; return its width / height."""
    im = Image.open(path)
    try:
        im.draft('RGB', (max(e for _, e, _ in sizes) * 2,) * 2)
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
    for tag, edge, q in sizes:
        c = im.copy()
        c.thumbnail((edge, edge), Image.LANCZOS)
        # saved without exif or other info: camera data and GPS location are dropped
        c.save(os.path.join(out, f'{n:03d}-{tag}.jpg'), 'JPEG', quality=q, optimize=True, progressive=True)
    return round(im.width / im.height, 3)


def digitals(src, files):
    out = os.path.join(ROOT, 'digitals', 'photos')
    os.makedirs(out, exist_ok=True)
    for old in os.listdir(out):
        if re.fullmatch(r'\d{3}-(lg|sm)\.jpg', old):
            os.remove(os.path.join(out, old))
    lines = []
    for n, fn in enumerate(files, 1):
        r = web_copies(os.path.join(src, fn), out, n, (('lg', 2000, 82), ('sm', 720, 74)))
        lines.append(f"    [{n}, '', {r}],  // {fn}")
        print(f'  {n:3d}  {fn}')
    print(f'\nAdded {len(files)} digitals. Replace `photos` in digitals/index.html with this, say what each shot is,')
    print("and add section headings such as 'Headshots' and 'Full length' above their photos:\n")
    print('  photos: [')
    print('\n'.join(lines))
    print('  ],')


def main():
    if len(sys.argv) != 3:
        print(__doc__)
        sys.exit(1)
    src, slug = sys.argv[1], sys.argv[2]
    files = sorted(f for f in os.listdir(src) if re.search(r'\.(jpe?g|png)$', f, re.I))
    if not files:
        sys.exit('No JPG or PNG files found in that folder. (Export HEIC photos as JPG first.)')
    if slug == '--digitals':
        return digitals(src, files)
    if not re.fullmatch(r'[a-z0-9-]+', slug):
        sys.exit('The slug should be lowercase letters, numbers and dashes, e.g. "bay-area-birds".')
    out = os.path.join(ROOT, 'assets', 'photos', slug)
    os.makedirs(out, exist_ok=True)
    ratios = load_ratios()
    lines = []
    for n, fn in enumerate(files, 1):
        ratios[f'{slug}/{n:03d}'] = web_copies(os.path.join(src, fn), out, n, (('lg', 1600, 76), ('sm', 720, 72)))
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
