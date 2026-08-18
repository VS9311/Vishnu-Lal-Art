# Vishnu Lal — Website Design System & Antigravity Build Specification V1.0

## Build North Star
**Build an archive experience, not an artist portfolio template.**

Feel: contemporary, quiet, material, editorial, precise, immersive, scarce.

## MVP Scope
Home / Encounter; Archive / Selected Corpus; Individual Fragment; Practice; Artist; Access / Private Acquisition; Contact. No ecommerce checkout.

## Design Tokens
Archive Black `#0B0B0A`
Paper `#F1EEE7`
Charcoal `#252522`
Dust `#77746D`
Rule `#C9C5BC`

Typography: Cormorant Garamond or equivalent restrained editorial serif; Inter or equivalent neutral sans; optional IBM Plex Mono or equivalent for archival notation.

Suggested hierarchy: Display XL 6–9vw; Display L 4–6vw; Section 2.5–4vw; Body 16–20px; Metadata 10–12px, increased where accessibility requires.

## Spacing
Base unit 8px. XS 8; S 16; M 32; L 64; XL 128; XXL ~20vw for major pauses.

## Layout
Desktop: 12-column grid, 5–7vw margins, ~720px reading width, full-bleed artwork allowed.
Tablet: 8-column grid, 5vw margins.
Mobile: 4-column conceptual grid, 20–24px side margins.

## Global Shell
Header: Vishnu Lal / Archive mark left; Archive / Practice / Artist / Access right. Mobile compact wordmark + minimal menu. Footer minimal.

## Homepage
Hero: one flagship work, most/all viewport, preserve aspect ratio, no aggressive crop, minimal overlay, subtle entrance.

Transition: artwork recedes as proposition enters; no scroll-jacking.

Selected corpus: alternating scales and asymmetrical placement.

## Archive
Structure: Archive introduction → Series navigation → Selected works → private/restricted indication where applicable.

Cards: image, fragment ID, series, title if final, status if appropriate.

## Fragment Template
Full artwork image; Fragment ID; Title; Series; Year; Medium/support; Dimensions; Curatorial observation; Availability; Enquiry; Previous/next.

Unknown fields stay unknown. Never invent metadata.

## Practice
Opening statement → Material → Method → Development → Current practice → Artist voice.

Use podcast-derived material for first-person statements where verified.

## Artist
Portrait/studio encounter → biography → development → mentors/formative context → present practice → selected chronology.

## Access
Primary action: **Request Private Access**. Routes: private collector, interior designer/architect, gallery/curator/institution, viewing request.

## Contact
Name, Email, Professional context/role, Enquiry type, Works of interest, Message. Optional company/studio/institution and country. Avoid public price fields in MVP.

## Artwork Data Model
`id`, `series`, `title`, `year`, `medium`, `support`, `dimensions`, `orientation`, `status`, `visibility`, `featured`, `image`, `catalogueRecord`, `curatorialObservation`, `collectorNote`, `provenance`, `exhibitionHistory`.

Visibility: public / private / archived.
Status: available / reserved / sold / placed / pending.

Start with local JSON/content data; introduce a CMS/database once the content model is proven.

## Components
`ArchiveHeader`, `ArchiveFooter`, `ArtworkHero`, `ArtworkCard`, `ArtworkMetadata`, `ArtworkCatalogue`, `CuratorialNote`, `SeriesHeader`, `SeriesNavigation`, `EditorialSection`, `ArchiveLabel`, `AccessPanel`, `EnquiryForm`, `PageTransition`.

## Motion
Entrance opacity 0→1, translation 8–20px, ~700–1200ms, restrained easing. Image crossfade and tiny scale movement only. Hover scale ~1.01–1.03. Respect `prefers-reduced-motion`.

## Image Performance
Responsive image sizes; WebP/AVIF where supported; lazy-load below fold; eager-load primary hero; explicit dimensions/aspect ratio; preserve high-resolution master separately.

## Responsive Art Direction
Preserve artwork proportions. Simplify navigation and reduce display type on small screens while keeping margins and metadata legible.

## Accessibility
Semantic HTML, keyboard navigation, visible focus, meaningful alt text, proper heading hierarchy, sufficient contrast, reduced-motion support, labelled forms, no hover-only information.

## SEO
Unique title, artist, work title, medium, structured description, Open Graph image, canonical URL. Example: `/archive/series-ii/vl-b-001`. Keep private metadata out of indexing.

## Recommended Project Structure
`/app`
`/components`
`/content`
`/data`
`/public/artworks`
`/styles`
`/lib`

Separate content/artwork data from presentation code.

## Build Order
1. Global tokens + fonts + shell
2. Homepage encounter
3. Archive corpus
4. Reusable fragment page
5. Practice and Artist
6. Access + Contact
7. Responsive implementation
8. Accessibility + performance
9. Art-direction review
10. Final content population

## Content Population Rule
Do not publish every artwork merely because it exists. Use the selected primary corpus and strongest current images. Keep deeper Archive material controlled internally.

## Antigravity Master Prompt
Build a premium contemporary artist archive website for Vishnu Lal using the supplied Brand Bible, Visual Identity System and UX Blueprint as governing source of truth. The site is not ecommerce and must not resemble a generic artist portfolio. The central concept is an evolving archive of charcoal drawings; the experience should feel discovered, material, quiet, editorial and intellectually serious.

Use artwork as the primary visual language. Prioritize extreme restraint, large-scale artwork, generous negative space, warm paper and archive-black neutrals, editorial serif + neutral sans, minimal navigation, subtle reveal motion, accurate artwork representation, and scarcity through curation rather than fake urgency.

Build Home, Archive, Fragment, Practice, Artist, Access and Contact. Use reusable components and structured artwork data. Do not hard-code every artwork page.

Do not add gold luxury styling, marble textures, occult decorative graphics, faux museum seals, countdown timers, aggressive sales banners, excessive parallax, generic masonry portfolio grids, or ecommerce checkout.

Prioritize desktop but remain responsive and accessible. Preserve artwork proportions. Use modern responsive image loading. Respect reduced motion.

Do not invent biography, provenance, dates, dimensions, influences or artwork interpretations. If content is missing, use a clearly marked development placeholder.

Final feeling: **a contemporary archive with the silence of a museum, the intimacy of a studio, and the material presence of a sheet of charcoal paper.**

## Definition of Done
1. Opening screen establishes Vishnu Lal as an artist rather than a commercial website.
2. Major works can be encountered without a conventional gallery grid.
3. Archive concept is understandable without over-explanation.
4. Practice and biography create credibility.
5. Serious collectors have a clear private enquiry path.
6. Designers/architects can request professional information.
7. Artwork pages are generated from structured data.
8. Site is responsive and accessible.
9. Interface recedes enough for drawings to dominate.
10. Nothing feels like decoration added merely to make the site look expensive.
