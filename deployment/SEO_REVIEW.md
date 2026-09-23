# SEO handover

Domain: https://anseninnov.com/  
Package date: 23 September 2026

## Included

- Unique titles and descriptions, canonical URLs, Open Graph and Twitter metadata.
- Organization, WebSite, WebPage and BreadcrumbList data, plus relevant service and showcase data.
- Eleven canonical URLs in `sitemap.xml`, using the standard sitemaps.org XML namespace.
- `robots.txt` allowing crawling and pointing to the formal sitemap.
- HTML sitemap, local images and fonts, and responsive navigation.
- Redirect rules and static fallback pages for merged URLs; a 410 rule for the retired project URL; a 404 page.

The sitemap contains the homepage, Services, four service details, Showcase, AI for Care, About, Contact and the HTML sitemap. It excludes redirects and error pages. The homepage canonical is `/`; explicit `/index.html` requests redirect there when the server rules are applied.

See `url-mapping.csv` for the old-to-new URL mapping. AI for Care keeps `collaboration.html`; this preserves the URL, not the old Encrypted Database topic or its rankings.

## Release checks

Internal links, local assets, unique metadata, JSON-LD parsing and sitemap/canonical alignment are checked in the package. Internal annotations and development messages have been removed from public pages and scripts. Font and third-party licence notices are retained.

## Check on Vultr

1. All eleven sitemap URLs return the intended page with HTTP 200.
2. Canonical URLs use the production domain. No server/CDN response adds `noindex` to normal pages.
3. `sitemap.xml` returns XML and `robots.txt` returns plain text.
4. Merged URLs return 301, the retired project URL returns 410, and unknown URLs return 404. Do not serve the homepage for every missing path.
5. Redirect HTTP and www traffic to HTTPS without www.
6. Verify contact email delivery separately, then submit the sitemap in Search Console.

The supplied Apache and Nginx rules must be merged with the actual host configuration and checked before reloading. Server behaviour, page performance and search indexing cannot be confirmed from the ZIP alone.
