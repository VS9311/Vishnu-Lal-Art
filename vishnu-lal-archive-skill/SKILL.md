---
name: vishnu-lal-archive
description: Governing implementation skill for the Vishnu Lal Archive website. Use for website architecture, frontend implementation, visual design, UX, artwork presentation, content integration, and art-direction decisions.
---

# Vishnu Lal Archive

Build an archive experience, not a generic artist portfolio. The artwork is the primary visual language; the interface frames the work, establishes credibility, and creates a controlled path toward access.

## Source-of-truth hierarchy
1. `resources/04-website-spec.md` — implementation
2. `resources/02-visual-identity.md` — visual/art direction
3. `resources/03-ux-blueprint.md` — experience and UX
4. `resources/01-brand-bible.md` — brand positioning and language
5. `resources/05-content-rules.md` — factual and curatorial integrity

If sources conflict, flag the conflict; do not silently invent a reconciliation.

## Core design rules
The site should feel contemporary, quiet, material, editorial, precise, immersive, and scarce.

Avoid generic portfolio grids, gold luxury styling, marble textures, fake museum aesthetics, occult decorative graphics, faux-antique typography, excessive animation, aggressive sales language, artificial scarcity mechanisms, and ecommerce checkout in MVP.

## Artwork integrity
Never invent or silently infer titles, dimensions, dates, provenance, exhibition history, institutional relationships, quotations, biography, artist intentions, or philosophical/occult influences. If information is unavailable, use a development placeholder or ask.

Never distort, recolour, artificially age, or decorate artwork.

## Archive metaphor
The archaeological/recovery language is a curatorial metaphor, not a factual archaeological claim. Never present the drawings as literal archaeological objects or records from a lost civilization.

## Voice
Vishnu's personal voice must remain grounded in his actual testimony. The Archive voice is measured and documentary. Curatorial language may interpret, but must distinguish observation from interpretation.

Do not manufacture prestige through unsupported references to Borges, Kabbalah, Rosicrucianism, mythology, or other traditions.

## Scarcity
The public site presents a curated corpus, not the entire inventory. Use public/private/archived visibility states. Never create fake countdowns, urgency, or availability.

## Development discipline
Before changing code: inspect the project; identify the relevant resource; make a concise plan; make the smallest coherent change; verify it; visually inspect when possible. Reuse components and structured artwork data. Do not introduce dependencies without reason.

## Context/token discipline
Do not repeatedly read every resource. Read only what is relevant to the current task. Do not regenerate the whole application for a small change. Do not create competing implementations.

## Decision test
> Does this help the visitor look at the artwork, or does it merely make the website look more sophisticated?

If it is the latter, remove it.

## Final standard
**A contemporary archive with the silence of a museum, the intimacy of a studio, and the material presence of a sheet of charcoal paper.**
