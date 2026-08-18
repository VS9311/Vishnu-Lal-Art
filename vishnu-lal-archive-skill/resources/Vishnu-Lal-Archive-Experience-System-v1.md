# Vishnu Lal — Archive Experience System V1.0

## Purpose

This document defines how the Vishnu Lal website should behave as an archive experience without becoming complicated, obscure, or difficult to navigate.

It is an implementation-facing reference for Antigravity and future engineering work.

> **Simple surface. Deep underneath.**

The visitor should never need to understand the archive structure before using the website. The experience should feel distinctive through sequencing, pacing, relationships, and restraint — not through complicated controls.

---

## 01 — Experience North Star

The site should feel like **entering a body of work and gradually discovering its records**.

It should not feel like:
- a conventional portfolio
- an ecommerce catalogue
- an academic database
- an interface that requires instructions
- an archaeological game
- an occult-themed website

The archive metaphor is expressed through **behavior**, not decoration.

---

## 02 — Core Public Navigation

Keep the top-level navigation minimal:

**ARCHIVE**  
**PRACTICE**  
**ARTIST**  
**ACCESS**

The Vishnu Lal name/wordmark returns to Home.

Do not add primary navigation items such as Series, Timeline, Voice, Catalogue, Constellations, Research, or Records. These may exist deeper later.

A visitor should always know where they are, how to go back, how to see more work, how to learn about Vishnu, and how to make contact.

---

## 03 — Three Depths

### LEVEL 1 — ENCOUNTER
**Home**

Purpose: make the visitor feel the work before explaining it.

May contain:
- selected artworks
- canonical IDs where useful
- minimal Series references
- short verified archival interruptions
- later, a short verified fragment of Vishnu's voice
- invitation into the Archive

No detailed catalogue information.

### LEVEL 2 — EXPLORE
**Archive**

Purpose: let the visitor discover the public corpus simply.

V1 should allow:
- viewing public works
- distinguishing bodies/series where useful
- opening an individual work
- moving between works

No complicated filter system in V1.

### LEVEL 3 — STUDY
**Individual Artwork Record**

Example: `/archive/VL-B-001`

Purpose: allow serious study of one work.

May contain:
- artwork
- canonical ID
- verified public metadata
- formal observation
- approved curatorial observation
- related records later
- artist voice later, only when genuinely relevant

The existing sticky desktop Study View remains the governing interaction model:

**Artwork visible + record readable.**

---

## 04 — Homepage Role

The homepage is the entrance, not the Archive.

Its job is to answer:

> **Why should I keep looking?**

Recommended sequence:

1. **Entry** — one flagship encounter.
2. **Record** — minimal ID / Series information.
3. **Silence** — controlled negative space.
4. **Selected Work** — another work at a different scale.
5. **Archival Interruption** — extremely limited verified archive material.
6. **Selected Encounters** — a small curated group of works.
7. **Artist Voice — future** — short verified excerpt from the recorded conversation.
8. **Exit** — **ENTER THE ARCHIVE**

Do not automatically display every public artwork.

The homepage is edited. The Archive is broader.

---

## 05 — Archive Page V1

The Archive should be easier to understand than the Homepage.

The Homepage may be atmospheric. The Archive should be clear.

Suggested opening:

**THE ARCHIVE**

A short factual line establishing that this is a selected public corpus from Vishnu Lal's evolving body of work.

Then immediately show the works.

Do not make the visitor read a manifesto first.

### Default presentation

Use a restrained visual catalogue.

Avoid ecommerce aesthetics, but prioritize clarity.

Possible structure:
- generous two-column editorial arrangement on large screens
- controlled one-/two-column rhythm based on artwork proportions
- clear canonical ID
- Series label where verified
- no price
- no long descriptions
- click/tap opens Study View

The Archive may be more systematic than the Homepage. That is intentional.

---

## 06 — Excavation Without Gimmicks

"Excavation" is a design principle, not a visual theme.

Create discovery through:
- delayed information
- sequencing
- relationships between works
- chronology
- recurring forms
- artist voice
- movement between records
- controlled scarcity

Do not create excavation through:
- dirt textures
- torn paper
- fake archaeological maps
- dust/brush animations
- "unlock artifact" mechanics
- fake historical labels
- theatrical ancient fonts
- unnecessary sound effects

The interface remains contemporary.

---

## 07 — Relationships Between Works

Related works can become a distinctive Archive feature, but relationships must be **curated**, not fabricated.

Possible relationship types:
- same Series
- recurring formal structure
- repeated motif
- similar compositional strategy
- chronological development
- documented conceptual connection
- artist-confirmed relationship

At the end of a Study View:

**RELATED RECORDS**

Show 2–4 works.

Do not explain every relationship unless the explanation adds real value.

---

## 08 — Constellations — Future

"Constellations" is an internal working term for curated relationships across the Archive.

It is **not** a primary navigation item in V1.

Future example:

`VL-A-027 ↔ VL-B-006`

with a restrained note such as:

> A recurring structural form across two periods of the archive.

Do not implement until required Series I records are verified and curated.

---

## 09 — Series

Series are bodies of work, not product categories.

The Archive may eventually support Series I, Series II, and future bodies of work.

Do not treat Series navigation like retail filtering.

### V1

Series II may remain the primary public corpus.

Do not expose the complete Series I archive merely because it exists. Series I should enter through deliberate selection later.

---

## 10 — Chronology — Future

Chronology should answer:

> **How did this practice become what it is now?**

It should not be a conventional CV timeline.

Potential material:
- childhood drawing
- education/background
- formative encounters
- mentorship
- experimentation across styles
- development of charcoal practice
- emergence of the current visual language
- current corpus

Build only from verified artist/archive material.

---

## 11 — Artist Voice / Recorded Conversation

The recorded conversation with Vishnu is a primary-source asset.

Use it selectively.

### Homepage
A very short excerpt or invitation. Never autoplay.

### Artist Page
A stronger **IN CONVERSATION** section:
- curated 2–5 minute excerpt
- short transcript
- link to full conversation

### Artwork Page
Only connect an excerpt when the source conversation genuinely supports that connection.

Never imply Vishnu discussed a specific work when he did not.

---

## 12 — Practice Page

Purpose:

> Explain how Vishnu works without explaining away the work.

Potential structure:
- material
- charcoal
- paper
- mark-making
- process
- observation
- experimentation
- development of current practice
- selected artist testimony

Do not make it a generic artist-statement page.

---

## 13 — Artist Page

Purpose:

> Let the visitor understand the person behind the Archive.

Potential structure:
- portrait/studio image
- concise biography
- artistic development
- formative mentor/context
- selected chronology
- recorded conversation
- current practice

Do not turn it into a CV dump or artificially intellectualize Vishnu's biography.

---

## 14 — Access

The Access page is where the public experience becomes a professional relationship.

Primary audiences:
- private collectors
- galleries / curators / institutions
- architects
- interior designers

Possible actions:
- **Request Catalogue**
- **Private Acquisition Enquiry**
- **Professional / Project Enquiry**
- **Viewing / Exhibition Enquiry**

Do not make high-value acquisition feel like ecommerce.

No Buy Now, cart, discount, countdown, or pressure tactics.

---

## 15 — Scarcity

The full Archive and the public website are not the same thing.

Possible states:

**PUBLIC** — visible on the public site.  
**PRIVATE** — documented but available only through private access.  
**ARCHIVED** — documented internally and not currently offered publicly.

Do not expose every work merely because the database contains it.

Scarcity comes from curation and controlled access, never fake urgency.

---

## 16 — Search & Filtering — Not V1

Do not add a large search/filter interface yet.

The current public corpus is too small to justify it.

When the public archive grows, future discovery may include:
- Series
- Year
- ID
- orientation
- selected formal relationships

Only introduce these when genuinely needed.

---

## 17 — Mobile Philosophy

Mobile preserves the conceptual hierarchy but does not copy desktop interactions literally.

### Homepage
- artwork dominant
- complete proportions
- simpler scale rhythm
- minimal navigation

### Archive
- clear vertical exploration
- easy tapping
- readable IDs

### Study View
Keep:

**Artwork → Record → Formal Observation → Curatorial Observation**

Do not force the desktop sticky two-column view onto mobile.

---

## 18 — Navigation Safety

Never advertise a destination that does not exist.

Unknown artwork ID:

**Archive Record Not Found**

Known but intentionally unpublished record:

**Record Pending**

These must remain distinct.

---

## 19 — Data / Presentation Separation

The Archive Experience must remain data-driven.

Canonical artwork records contain facts.

Homepage sequence contains curation.

Archive layout contains presentation.

Do not duplicate canonical artwork facts into components.

```text
CANONICAL ARTWORK DATA
        ↓
   ┌────┴─────┐
   ↓          ↓
HOMEPAGE    ARCHIVE
curation    exploration
               ↓
           STUDY VIEW
```

---

## 20 — V1 Scope

### Build now
- Homepage Encounter
- Archive page
- VL-B-001 Study View template
- selected public Series II records
- basic Series context
- simple corpus navigation
- responsive behavior
- accessibility
- performance

### Prepare next
- remaining Series II public records
- Artist page
- Practice page
- Access

### Later
- Artist Voice/video
- chronology
- related records
- selected Series I
- constellations
- search/filtering
- private collector layer
- provenance/exhibition history

---

## 21 — Complexity Rule

Before adding any feature, ask:

> **Does the visitor understand the Archive more easily because this exists?**

If no, do not add it.

A feature is not valuable merely because it is novel.

---

## 22 — Art Direction Rule

If choosing between **more immersive** and **more understandable**, choose understandable unless immersion remains equally intuitive.

If choosing between **more decorative** and **more restrained**, choose restrained.

If choosing between **show more information** and **create curiosity**, use the appropriate depth:

- Homepage → curiosity
- Archive → orientation
- Study View → information

---

## 23 — Definition of Success

A first-time visitor should be able to use the site immediately without explanation.

Within a few minutes they should understand:

1. Vishnu Lal is a serious contemporary artist.
2. The works belong to a coherent evolving corpus.
3. The Archive contains more depth than the Homepage.
4. Individual works can be studied seriously.
5. There is a real artist and practice behind the presentation.
6. Serious professional/collector access is available.

They should also feel that there is still more to discover.

---

# Final Principle

> **The Archive should be easy to enter, difficult to exhaust, and impossible to mistake for a generic portfolio.**

The interface stays simple.

The depth comes from the work.
