# SunTimesToday v2 Build Plan



## Goal

Create a working sunrise/sunset + golden hour tool with programmatic SEO city pages.



## Phase 1: Core Tool

1. Add local cities list at data/cities.json.

2. Add sun calculation utility at lib/sun.ts using suncalc.

3. Build homepage:

   - City selector

   - Today's sun times

   - Internal links to example cities

4. Build city route /sunrise-sunset/[slug]:

   - Static params from cities.json

   - Sun times computation

   - SEO metadata + JSON-LD

   - Internal linking

   - 2–3 paragraphs of useful content



## Phase 2: Scaling SEO Pages

1. Expand cities.json to 500+ cities.

2. Add more linking between related cities.

3. Add sitemap.xml generation.



## Phase 3: Enhancements (optional)

- Add blog content for supporting SEO.

- Add Supabase backend for dynamic cities.

- Add user geo-detection on homepage.

