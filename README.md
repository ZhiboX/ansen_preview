# Ansen Innovation website

For https://anseninnov.com/ · 23 September 2026

Static HTML, CSS and JavaScript. No build step is needed.

## Deploy

1. Back up the current website on Vultr.
2. Upload the HTML pages, `assets/`, `images/`, `fonts/`, `favicon.png`, `robots.txt` and `sitemap.xml` to the website root. Keep `index.html` directly in that folder.
3. For Apache, merge `.htaccess` into the existing configuration. For Nginx, use `deployment/nginx.conf.example` as a reference. Configure HTTP and www redirects to `https://anseninnov.com/`.
4. Check the pages, mobile navigation, old URL redirects and 404 responses. Confirm that `robots.txt` and `sitemap.xml` are served correctly and that the server has no `noindex` response header.
5. Submit `https://anseninnov.com/sitemap.xml` in Google Search Console.

Keep this README and `deployment/` out of the public web root. The supplied server rules also restrict access to them.

## Contact form

Emmeet will connect the AWS email service. The frontend is included; sending remains disabled until the backend is ready. Before switching over the contact page, follow `deployment/CONTACT_HANDOFF.md` and test receipt at the company email address.

## SEO

Included: unique page titles and descriptions, canonical URLs, sharing metadata, structured data, `robots.txt`, HTML sitemap and an XML sitemap with 11 canonical URLs. Redirect rules cover merged pages.

All SEO URLs use `https://anseninnov.com/`. Server responses and search indexing must be checked after deployment.
