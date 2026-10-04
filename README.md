# Evan Egan portfolio

A static site. No build step, no framework, no dependencies.

```
index.html    page shell (title, meta tags, fonts)
fonts.css     self-hosted fonts (files in assets/fonts)
tools/        add-photos.py: turns a folder of photos into a book chapter
styles.css    the Bauhaus design and layout
app.js        shelf, reader, work grid, viewer, routing
content.js    ← everything you edit
assets/       your images, videos, résumé
```

## Adding your work

Open `content.js`. Every book, project, link and line of copy is in there.

- **Swap placeholders for real media.** Put files in `assets/`, then fill a project's `media` list.
  The first item is the main image. Every extra item gets its own page in the book and shows up in the viewer.
  ```js
  media: [
    { type: 'image', src: 'assets/night-shift-1.jpg', alt: 'Baker shaping dough at 4am', caption: 'Reel 3' },
    { type: 'video', embed: 'https://player.vimeo.com/video/123456789',
      url: 'https://vimeo.com/123456789', poster: 'assets/night-shift-poster.jpg' },
  ],
  ```
  When `media` is empty, the drawn `placeholder` art shows instead, so you can fill things in gradually.
- **Add a project.** Copy an existing project block and give it a unique `slug` (lowercase, dashes).
- **Add or reorder books.** Edit the `books` list. Set `flat: true` on a book to lay it on its side.
- **Contact details.** Set `email`, `links`, `location`, `availability`, and `resume` (a path to a PDF in `assets/`).
- **Portrait.** Set `about.photo` to an image path. When it's empty, your monogram shows instead.

Icons come from Phosphor Icons (MIT); fonts are Josefin Sans, Archivo, IBM Plex Mono and Caveat (SIL Open Font License).

Images look best around 2000px on the long edge, saved as JPG or WebP at roughly 80% quality.

## Book formats

Each book sets `format`, which decides how its pages are designed:

- **`photo`**: a dense photo book on square pages. Each project is a chapter, grouped into
  `part`s. Photos are packed into tight grids automatically, in the order you list them: landscapes
  share grids with landscapes and portraits with portraits, so crops stay gentle. The first photo
  opens the chapter. Mark a landscape `{ feature: true }` to run it across a whole spread.

  **Adding a folder of photos:**
  ```bash
  python3 tools/add-photos.py "/path/to/Folder" chapter-slug
  ```
  This makes web-sized copies in `assets/photos/chapter-slug/` with all camera and GPS data
  stripped, records each photo's shape, and prints a chapter block to paste into `content.js`.
  Write a short alt text for each photo, and delete the lines for any you don't want.
- **`film`**: a screening programme. The first still runs across both pages, with the synopsis
  on the left and `award`, `credits` and the watch link on the right.
- **`notebook`**: an engineering notebook with `problem`, `built` and `result`, and the first
  media item shown as a numbered figure with `figCaption`.

## Links you can share

- `yoursite.com/#video` opens the Video book.
- `yoursite.com/#video.night-shift` opens it at that project.
- Inside a book, **Copy link** copies the current project's link.

## Previewing locally

```bash
python3 -m http.server 4317
```
Then open http://localhost:4317.

## Deploying

Any static host works. Upload the folder as it is.

- **Netlify:** drag the folder onto app.netlify.com/drop.
- **Vercel:** `npx vercel` from inside this folder.
- **GitHub Pages:** push to a repository, then turn on Pages in Settings → Pages.

Before going live, update the `og:` and `description` meta tags in `index.html`, and the email address in the `<noscript>` line.
