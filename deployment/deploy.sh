#!/usr/bin/env bash
set -Eeuo pipefail
umask 022

# Installed by an administrator; the deployment key cannot run arbitrary commands.
if [[ ! "${SSH_ORIGINAL_COMMAND:-}" =~ ^deploy\ ([0-9a-f]{40})$ ]]; then
  echo 'Only "deploy <main commit SHA>" is permitted.' >&2
  exit 1
fi
revision="${BASH_REMATCH[1]}"

readonly destination='/usr/local/nginx/html/ansen_preview'
readonly state='/var/lib/ansen-preview'
readonly repository="$state/repository.git"
readonly source='https://github.com/ZhiboX/ansen_preview.git'

# Also serialize direct SSH invocations outside GitHub Actions.
exec 9>"$state/deploy.lock"
flock -x 9

if [[ ! -d "$repository" ]]; then
  git init --bare "$repository"
fi
git --git-dir="$repository" fetch --no-tags "$source" refs/heads/main
if ! git --git-dir="$repository" merge-base --is-ancestor "$revision" FETCH_HEAD; then
  echo 'The requested commit is not in main.' >&2
  exit 1
fi

stage="$(mktemp -d "$state/release.XXXXXXXX")"
trap 'rm -rf -- "$stage"' EXIT
git --git-dir="$repository" archive "$revision" -- \
  '*.html' assets images fonts favicon.png robots.txt sitemap.xml \
  | tar -x -C "$stage"
test -s "$stage/index.html"

# Excluded paths are protected from deletion, including the existing .git directory.
rsync --archive --delete --safe-links --chmod=D755,F644 \
  --include='/*.html' \
  --include='/assets/***' \
  --include='/images/***' \
  --include='/fonts/***' \
  --include='/favicon.png' \
  --include='/robots.txt' \
  --include='/sitemap.xml' \
  --exclude='*' \
  "$stage/" "$destination/"

# Check the local origin, not a potentially cached CDN response.
curl --fail --silent --show-error --max-time 15 --noproxy '*' \
  -H 'Host: anseninnov.com' http://127.0.0.1/ -o "$stage/served.html"
if ! cmp --silent "$stage/index.html" "$stage/served.html"; then
  echo 'The served homepage does not match the deployed commit.' >&2
  exit 1
fi
printf 'Deployed %s to %s; origin homepage verified.\n' "$revision" "$destination"
