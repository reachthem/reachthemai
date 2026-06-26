---
name: new-page-md
description: Create full marketing pages from a source markdown business-plan and roman numeral sections. Generates pages that match the site's layout, include AI Integration sections, and add navigation links under "Coming Soon".
---

# Skill: new-page-md

## Overview

Use this skill to convert a provided business-plan markdown (or similar doc) and one or more roman numerals (I, II, III, etc.) into ready-to-add Next.js marketing pages. Pages follow the existing site structure and design (hero, features, AI Integration, pricing block, FAQ, CTA) and add navigation links under the `Coming Soon` menu.

## When to use
- You provide a source markdown file and one or more roman numerals referring to sections in that file.
- You want full page content and components added to the repo matching the `review-generation` page structure.

## Input
- Source document (URL or workspace file path).
- List of roman numerals to convert (e.g., `II`, `III`).
- Optional: preferred page slugs (defaults derived from section title).

## Output
- New `app/<slug>/page.tsx` for each section.
- Component folder `components/<slug>/` with: `HeroSection.tsx`, `OverviewSection.tsx`, `FeaturesSection.tsx`, `AISection.tsx`, `HowItWorksSection.tsx`, `FAQSection.tsx`, `CTASection.tsx` (as needed).
- Updated `components/shared/Navbar.tsx` to add the pages under the `Coming Soon` dropdown.
- Pricing block with platform and fully-managed prices (`$49` and `$499`) included via `ServiceSelectionSection`.

## Process (step-by-step)
1. Extract the requested roman numeral sections from the provided markdown. Use the section title as the page title.
2. Draft page copy using the section text as the authoritative source, converting formal document language into persuasive, scannable web copy (AIDA/PAS), keeping tone professional and approachable.
3. Create `components/<slug>/` components mirroring `components/review-generation/` layout and naming patterns: Hero, Overview, Features, AIIntegration, HowItWorks, FAQ, CTA.
4. Add a page at `app/<slug>/page.tsx` that imports and renders the components in this order: Hero, Overview, Features, AIIntegration, HowItWorks, ServiceSelectionSection (with prices), FAQ, CTA.
5. Add the new page slug to the `Coming Soon` nav item in `components/shared/Navbar.tsx` as a child link.
6. Run quick grep to ensure imports resolve; minimal formatting only.

## Decision points / branching
- If the section text lacks explicit "Key Features", extract and summarize 4–6 features based on nearby paragraphs.
- If an `AI Integration` subsection exists in the source, use it verbatim (lightly edited). If not, synthesize a clear AI features block from other references in the document.
- If a slug conflicts with an existing route, append `-service` to the slug and warn the user.

## Quality criteria / checks
- Page uses existing site components and style conventions (gradient hero, CTA styles, `ServiceSelectionSection` usage).
- AI Integration section is prominent and placed immediately after Features.
- Pricing block uses `$49` for platform and `$499` for fully-managed in `ServiceSelectionSection` props.
- Navigation updated under `Coming Soon` with correct slugs.
- No unrelated files are modified.

## Output format
- Create files in the workspace under `skills/new-page-md/` when drafting the skill (this file).
- When executed, produce diffs/patches that add components and pages as described.

## Example prompts
- "Use this file (URL) and create pages for roman numerals II and III." 
- "Generate a page for section V using slug `gbp-optimization` and include extra FAQ items: [..]."

## Notes & extensions
- Can include JSON-LD FAQ injection if requested.
- Can optionally add Testimonials and Stats sections to exactly match `/review-generation` if user asks.

## Next actions
- Ask user to confirm the slugs or accept defaults before creating files.
