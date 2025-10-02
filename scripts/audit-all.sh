#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

echo "Repo-wide dependency audit started at $(date -Iseconds)"
echo

# Helpers
has_cmd() { command -v "$1" >/dev/null 2>&1; }

# NPM/Yarn/PNPM (JS/TS)
echo "Scanning JavaScript/TypeScript projects..."
while IFS= read -r pkg; do
  dir="$(dirname "$pkg")"
  # Skip node_modules and hidden dirs
  [[ "$dir" == *node_modules* ]] && continue
  echo "==> JS project: $dir"
  pushd "$dir" >/dev/null

  # Identify package manager
  if [[ -f pnpm-lock.yaml ]] && has_cmd pnpm; then
    echo "   Using pnpm"
    pnpm audit --json || true
    pnpm outdated --json || true
  elif [[ -f yarn.lock ]] && has_cmd yarn; then
    echo "   Using yarn"
    yarn npm audit --json || true
    yarn outdated --json || true
  elif [[ -f package-lock.json ]] && has_cmd npm; then
    echo "   Using npm"
    npm audit --json || true
    npm outdated --json || true
  elif has_cmd npm; then
    echo "   No lockfile found; using npm"
    npm audit --json || true
    npm outdated --json || true
  else
    echo "   No JS package manager available"
  fi

  popd >/dev/null
done < <(find . -name package.json -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/build/*")

# Python
echo
echo "Scanning Python projects..."
if has_cmd pip-audit; then
  while IFS= read -r req; do
    dir="$(dirname "$req")"
    echo "==> Python project: $dir"
    pushd "$dir" >/dev/null
    if [[ -f requirements.txt ]]; then
      pip-audit -r requirements.txt -f json || true
    fi
    if [[ -f pyproject.toml ]]; then
      pip-audit -f json || true
    fi
    if [[ -f Pipfile.lock ]] && has_cmd pipenv; then
      pipenv check --json || true
    fi
    popd >/dev/null
  done < <(find . \( -name requirements.txt -o -name pyproject.toml -o -name Pipfile.lock \) -not -path "*/.venv/*" -not -path "*/venv/*")
else
  echo "pip-audit not installed; skip Python audit"
fi

# Go
echo
echo "Scanning Go projects..."
if has_cmd go; then
  while IFS= read -r gomod; do
    dir="$(dirname "$gomod")"
    echo "==> Go project: $dir"
    pushd "$dir" >/dev/null
    go list -m all >/dev/null 2>&1 || go mod download
    go vuln ./... || true
    go list -u -m -json all || true
    popd >/dev/null
  done < <(find . -name go.mod -not -path "*/vendor/*")
else
  echo "Go not installed; skip Go audit"
fi

# Rust
echo
echo "Scanning Rust projects..."
if has_cmd cargo; then
  while IFS= read -r cargo_toml; do
    dir="$(dirname "$cargo_toml")"
    echo "==> Rust project: $dir"
    pushd "$dir" >/dev/null
    if has_cmd cargo-audit; then
      cargo audit --json || true
    else
      echo "cargo-audit not installed; skip"
    fi
    if has_cmd cargo-outdated; then
      cargo outdated -R || true
    fi
    popd >/dev/null
  done < <(find . -name Cargo.toml -not -path "*/target/*")
else
  echo "Rust not installed; skip Rust audit"
fi

# Java/Gradle/Maven
echo
echo "Scanning Java projects..."
while IFS= read -r gradle; do
  dir="$(dirname "$gradle")"
  echo "==> Gradle project: $dir"
  echo "   Consider running OWASP Dependency-Check or Gradle Versions Plugin in CI for this module."
done < <(find . \( -name build.gradle -o -name build.gradle.kts \) -not -path "*/.gradle/*")

while IFS= read -r pom; do
  dir="$(dirname "$pom")"
  echo "==> Maven project: $dir"
  echo "   Consider running OWASP Dependency-Check or versions-maven-plugin in CI for this module."
done < <(find . -name pom.xml -not -path "*/target/*")

# PHP Composer
echo
echo "Scanning PHP Composer projects..."
if has_cmd composer; then
  while IFS= read -r composer_json; do
    dir="$(dirname "$composer_json")"
    echo "==> Composer project: $dir"
    pushd "$dir" >/dev/null
    composer show -lo || true
    if has_cmd symfony && symfony local:check:security >/dev/null 2>&1; then
      symfony security:check --format=json || true
    fi
    popd >/dev/null
  done < <(find . -name composer.json -not -path "*/vendor/*")
else
  echo "Composer not installed; skip PHP audit"
fi

echo
echo "Audit finished."
