# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Confirmed by the user: pnpm + Turborepo monorepo. `frontend/` is Next.js (App Router, TypeScript, Tailwind), built first on mock data behind a repository layer. `backend/` is Node.js with Express, built after the frontend. Deploy target for the frontend is Vercel; the backend host is undecided.

## Users

Two audiences, equally weighted (confirmed):
- Niche fragrance enthusiasts who follow indie houses, read notes and compare scents. They want depth: notes pyramids, concentrations, craft.
- Gift buyers and newcomers who are unsure what to pick. They rely on guidance: the scent quiz, scent families, clear sizing.

A store admin (the brand's own staff) uses the CRM to watch revenue, fulfil orders and add scents.

## Product Purpose

Scentique is a niche indie perfume and cologne house with an online storefront and an admin CRM. It sells a small catalogue of scents across four families (Woody, Floral, Citrus, Oud), in several sizes and concentrations. Success for a visitor is finding a scent they trust enough to buy, whether by browsing or through the find-your-scent quiz. Success for an admin is running orders and stock without friction. The project is also a portfolio piece, so it must read as a professional DTC brand site.

## Positioning

Small-batch scents made with rare ingredients (confirmed by the user as the point of difference). The site should make the craft and sourcing legible through the scent notes, ingredient stories and a small, considered catalogue, rather than through claims alone.

## Operating Context

- Customers browse, filter by scent family, gender and price, read a notes pyramid (top, heart, base), pick a size and concentration, and check out.
- The scent quiz asks 3 to 4 questions and returns 2 to 3 recommendations.
- Admin manages orders through a status pipeline (pending, paid, packed, shipped, delivered), watches revenue and low stock, and adds scents with variants and notes.
- Prices are in USD; shipping is assumed worldwide (placeholder assumption, revisit with real logistics).

## Capabilities and Constraints

- Frontend runs entirely on mock data first; swapping to the Express API must touch one file only.
- Money is integer cents. Product images are placeholders until the user supplies photography.
- The logo is a placeholder wordmark; the user will provide the real logo.
- Brand name "Scentique" is held in a single config constant.
- Undecided: payment provider details, email provider, backend hosting, real shipping regions and rates.

## Brand Commitments

- Name: Scentique.
- The user's reference image and palette are binding: a dark, warm, luxurious storefront in the spirit of that reference, with its own identity (not a copy). Aesthetic touchstones named by the user: Skylar and D.S. & Durga, warm and editorial, lots of negative space, product-photography-led.
- A custom wavy animated background (Vercel/Aceternity style) is a requested signature effect.
- No generic AI-purple gradients; no Inter, Roboto or Arial as the display face.

## Evidence on Hand

- Reference image of a dark luxury fragrance storefront (visual reference only).
- No real photography, logo, founder story, customer testimonials or sales figures exist yet. All copy, scent names, notes, prices and testimonials in the build are synthetic placeholders and must be labelled as such wherever a visitor could mistake them for real. Do not invent real customers, press or sourcing claims.
- Placeholder image briefs are recorded in `docs/image-briefs.md` so real images can be generated or shot to match.

## Product Principles

1. Show craft through specifics: notes, ingredients and sizes, not adjectives.
2. Guide without hand-holding: the quiz and scent families help newcomers while enthusiasts can go straight to filters and notes.
3. Let the product lead: imagery and negative space over decoration.
4. One system, two moods: storefront and admin share tokens and components, with a calm, denser admin.
5. Nothing is faked as real: placeholder content is labelled and easy to replace.

## Accessibility & Inclusion

Target WCAG AA: 4.5:1 text contrast on the dark theme, visible keyboard focus, 44px touch targets, `prefers-reduced-motion` respected (the animated background becomes static), colour never the only signal.
