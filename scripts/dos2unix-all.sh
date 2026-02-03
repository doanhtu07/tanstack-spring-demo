#!/usr/bin/env bash

set -euo pipefail

# Make sure we're at repo root
cd "$(git rev-parse --show-toplevel)"

# Convert all tracked, non-ignored files to LF
git ls-files -z | while IFS= read -r -d '' file; do
  dos2unix "$file"
done