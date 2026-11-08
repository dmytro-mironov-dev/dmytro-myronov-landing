# Photos

Each photo slot on the page loads `<slot>.jpg` (then `.jpeg`, `.png`, `.webp`) and falls back to the
`<slot>.svg` placeholder. To add a photo, drop a file with the slot name next to the placeholder,
for example `conference-1.jpg`. Keep photos around 1600 px wide and under 400 KB.

| Slot | Where it shows | What to put there |
|------|----------------|-------------------|
| portrait | Hero (top) | Your portrait, vertical 4:5 |
| seoboost-1, seoboost-2 | Career: SEOBOOST | Team / office, a project screenshot |
| ssa-1 | Career: SSA Group | Team photo |
| conference-1 … conference-4 | Career: SSA Group | Magento conference photos |
| overdose-1, overdose-2 | Career: InTechSoft × Overdose | Team / store screenshots |
| startupsoft-1 | Career: StartupSoft | Screenshot |
| hoofdfabriek-1 … hoofdfabriek-3 | Career: Hoofdfabriek | Corporate party photos |

All slots also appear in the Gallery section. To add or rename slots, edit `photos` arrays in
`js/content.js`.
