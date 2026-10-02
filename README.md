# Ansen Innovation website

For https://anseninnov.com/ · 23 September 2026

Static HTML, CSS and JavaScript. No build step is needed.

## Deploy

Pushes to `main` run `.github/workflows/deploy.yml`. The workflow also supports manual runs from `main`; runs from other branches are skipped. No build step or Nginx restart is needed.

### Deployment target

- Server: Vigena (`139.180.179.61`, SSH port `22`).
- Website root: `/usr/local/nginx/html/ansen_preview`.
- Nginx container: `nginx`, serving `/usr/share/nginx/html/ansen_preview` through the existing host bind mount.
- Origin host: `anseninnov.com`.

### Credentials and server setup

The repository secrets `VIGENA_DEPLOY_SSH_KEY` and `VIGENA_DEPLOY_KNOWN_HOSTS` are required. The first contains the dedicated Ed25519 private key; the second contains the server's verified SSH host-key entry. Never commit the private key or obtain the host key from an unverified scan during deployment.

The server has `deployment/deploy.sh` installed as `/usr/local/lib/ansen-preview/deploy.sh`, owned by root with mode `0755`. Its state directory `/var/lib/ansen-preview` is root-owned with mode `0700`. It requires Bash, Git, rsync, tar, curl, cmp and flock.

The deployment public key is appended to `/root/.ssh/authorized_keys` with `restrict,command="/usr/local/lib/ansen-preview/deploy.sh"`. Existing administrator keys remain unchanged. This key can only request `deploy <main commit SHA>`; it cannot open a shell, run arbitrary commands or forward ports. Changes to the server script must be installed separately using administrator access; the workflow deliberately cannot update this root-executed program.

### Deployment behavior

1. GitHub Actions serializes deployments; the server also holds an exclusive lock.
2. The server fetches `main` from `https://github.com/ZhiboX/ansen_preview.git` into a separate bare repository under `/var/lib/ansen-preview`, verifies that the requested workflow commit belongs to `main`, and exports that exact commit.
3. rsync updates root-level HTML pages, `assets/`, `images/`, `fonts/`, `favicon.png`, `robots.txt` and `sitemap.xml`. Removed files within this managed set are deleted. Directories use `0755`; files use `0644`.
4. Existing `.git`, `README.md`, `deployment/` and other unmanaged paths are protected from deletion and are not uploaded. Deployment never rewrites Nginx configuration or another site's files. Existing copies of private metadata are not removed by this workflow; keep them outside the public root or restrict access using server rules.
5. The server requests the local Nginx origin with `Host: anseninnov.com` and compares the response byte-for-byte with the deployed homepage. A failed request or mismatch fails the workflow. This does not verify public HTTPS, CDN caches or search indexing.

The workflow becomes active once its YAML is committed and pushed to GitHub's `main` branch. Back up the current site before the first deployment; the initial setup backup is under `/var/lib/ansen-preview/before-actions-*.tar.gz`, outside the public web root. Later deployments do not create additional backups automatically. Static files are synchronized in place, not switched atomically, and a failed verification does not automatically roll back the site.

After deployment, check mobile navigation, contact-form behavior, old URL redirects, 404 responses, `robots.txt` and `sitemap.xml`. Merge `deployment/nginx.conf.example` separately when changing server rules; the workflow does not apply that example automatically.

## Contact form

Emmeet will connect the AWS email service. The frontend is included; sending remains disabled until the backend is ready. Before switching over the contact page, follow `deployment/CONTACT_HANDOFF.md` and test receipt at the company email address.

## SEO

Included: unique page titles and descriptions, canonical URLs, sharing metadata, structured data, `robots.txt`, HTML sitemap and an XML sitemap with 11 canonical URLs. Redirect rules cover merged pages.

All SEO URLs use `https://anseninnov.com/`. Server responses and search indexing must be checked after deployment.
