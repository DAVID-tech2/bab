# Image Folders

Place the Foundation's official authorised photographs in these folders.

## Structure

```
images/
├── logo/              → logo.png (Foundation logo)
├── milly-babalanda/   → Photographs of Hon. Babirye Milly Babalanda
│   ├── hero.jpg           (hero image for homepage)
│   ├── leadership.jpg     (leadership section)
│   ├── community-1.jpg    (community activity)
│   ├── community-2.jpg    (community activity)
│   └── event-1.jpg        (event photo)
├── programmes/        → Programme images
│   ├── youth.jpg
│   ├── women.jpg
│   ├── education.jpg
│   ├── community.jpg
│   ├── health.jpg
│   └── livelihoods.jpg
├── projects/          → Project images
└── gallery/           → Gallery images
```

## How to Replace Placeholder Images

The website currently uses stock placeholder photos from Pexels. To use real photographs:

1. Place your image files in the appropriate folder above
2. Open `js/script.js` and update the image URLs in the data arrays:
   - `projectsData` — for project images
   - `newsData` — for news article images
   - `galleryData` — for gallery images
3. For static images in HTML pages, update the `src` attribute of the `<img>` tag

## Important

- Only use authorised, official photographs of Hon. Babirye Milly Babalanda
- Use meaningful `alt` attributes for accessibility
- Recommended image sizes:
  - Hero: 1600x900px or larger
  - Programme cards: 940x630px
  - Gallery: 940x940px (square) or wider
