# Photos

Photos are WebP files named after their slot, for example `seoboost-team.webp`. Slots and captions
are listed in `js/content.js` (`person.portrait`, `career[].feature`, `career[].photos`,
`community.events`). A slot whose file is missing is hidden on the page.

Originals live in `../../images/` (git-ignored, they contain EXIF data). To add a photo:

1. Resize to at most 1600 px wide and save as WebP without metadata, about 80 % quality.
2. Put it here as `<slot>.webp`.
3. Add `{ slot: '<slot>', cap: 'Caption' }` to the right `photos` array in `js/content.js`.

`seoboost-card.webp` has the phone number, e-mail and QR code blurred on purpose.
