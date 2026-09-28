# Coastline Sips website

Static site for Coastline Sips, a mobile mocktail bar. Deployed on Cloudflare Workers (static assets), connected to this GitHub repo.

## How deploys work
- Pushing to `main` auto-deploys via Cloudflare Workers Builds. Never use direct upload.
- After a push, verify: `curl -sI https://coastlinesip.com | head -3` (expect HTTP/2 200).

## Files
- index.html, packages.html, menu.html, faq.html, inquire.html: pages (shared header/footer copied in each; keep them in sync)
- styles.css: all styling and color tokens (:root)
- site.js: mobile menu, inquiry form (builds a mailto), copy-email button. `INQUIRY_EMAIL` is defined at the top.
- mocktail.js: Three.js r128 3D coupe on the home page (loaded from cdnjs)

## Rules
- The inquiry email appears in site.js AND in mailto links in every page. When changing it, replace every occurrence.
- Keep the site dependency-free: no frameworks, no build step.
- Package details and prices come from the owner. Don't invent prices.
- Commit with clear messages, then push to main.
