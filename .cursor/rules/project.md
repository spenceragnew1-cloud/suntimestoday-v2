---
description: Rules for SunTimesToday programmatic SEO app.

globs: ["**/*"]

---

You are building a programmatic SEO web app for SunTimesToday.com.



TECH STACK

- Next.js App Router + TypeScript + Tailwind.

- Prefer Server Components. Use Client Components only when necessary.

- City pages must be statically generated using generateStaticParams.

- No "any" types. Strong typing everywhere.

- Keep code simple, readable, and predictable.



CORE PRODUCT REQUIREMENTS

- Compute sunrise, sunset, golden hour (start/end), civil, nautical, and astronomical twilight, solar noon, and day length.

- Pages must always render even if data is missing (graceful fallback).



ROUTES

- "/" homepage:

  - City selector

  - Today's sun times

  - Internal links to popular cities



- "/sunrise-sunset/[slug]" city page:

  - Uses generateStaticParams

  - Server-rendered

  - Sun times for today

  - Internal links to related cities

  - 2–3 SEO paragraphs

  - JSON-LD FAQs

  - Metadata (title, description, canonical, OpenGraph, Twitter)



SEO REQUIREMENTS

- Every city page must include:

  - Title tag and 150–160 character meta description

  - Canonical URL

  - OpenGraph + Twitter tags

  - FAQPage JSON-LD (4–6 questions)

  - Helpful content paragraphs

  - Internal links to nearby cities



DATA STRATEGY

- Start with a local file: data/cities.json (name, region, country, lat, lng, slug)

- Later can migrate to Supabase if needed, but not now.



QUALITY BAR

- App must compile with npm run dev.

- Avoid external API reliance unless approved.

- Static generation must succeed.

