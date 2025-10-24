# Dependency Audit ApiUsage — 2025-09-26

Repository: egaming-api-frontend
Working directory: /Users/josleke/Downloads/ThamaniInvest/Sabi/lab/egaming-api-frontend

Summary
- Package managers detected: npm (package.json, package-lock.json)
- Total dependencies: 264 (prod: 172, dev: 91, optional: 47)
- Vulnerabilities: 2 (moderate: 2, high: 0, critical: 0)
- Safe updates available (patch/minor within current major): Yes (see Recommendations)

Vulnerability Details
1) vite (devDependency)
- Severity: moderate (multiple advisories)
- Advisories:
  - GHSA-vg6x-rcgg-rjx6 — Websites were able to send any requests to the development server and read the response
    - Affected: >=6.0.0 <=6.0.8
    - Fixed in: 6.0.9+
    - Ref: https://github.com/advisories/GHSA-vg6x-rcgg-rjx6
  - GHSA-x574-m823-4x7w — Vite bypasses server.fs.deny when using ?raw??
    - Affected: >=6.0.0 <6.0.12
    - Fixed in: 6.0.12+
    - Ref: https://github.com/advisories/GHSA-x574-m823-4x7w
  - GHSA-4r4m-qw57-chr8 — server.fs.deny bypass for inline/raw with ?import
    - Affected: >=6.0.0 <6.0.13
    - Fixed in: 6.0.13+
    - Ref: https://github.com/advisories/GHSA-4r4m-qw57-chr8
  - GHSA-356w-63v5-8wf4 — server.fs.deny bypass with invalid request-target
    - Affected: >=6.0.0 <6.0.15
    - Fixed in: 6.0.15+
    - Ref: https://github.com/advisories/GHSA-356w-63v5-8wf4
  - GHSA-859w-5945-r5v3 — server.fs.deny bypassed with '/.' for files under project root
    - Affected: >=6.0.0 <=6.1.5
    - Fixed in: 6.1.6+
    - Ref: https://github.com/advisories/GHSA-859w-5945-r5v3
  - GHSA-xcj6-pq6g-qj4x — server.fs.deny bypass with .svg or relative paths
    - Affected: >=6.0.0 <6.0.14
    - Fixed in: 6.0.14+
    - Ref: https://github.com/advisories/GHSA-xcj6-pq6g-qj4x
  - GHSA-g4jq-h2w9-997c — middleware may serve files starting with the same name as public directory
    - Severity: low
    - Affected: >=6.0.0 <=6.3.5
    - Fixed in: 6.3.6
    - Ref: https://github.com/advisories/GHSA-g4jq-h2w9-997c
- Installed: 6.0.4
- Fix available: 6.3.6 (non-major)

2) esbuild (devDependency)
- Severity: moderate
- Advisory: GHSA-67mh-4wv8-2f99 — esbuild enables any website to send any requests to the development server and read the response
  - Affected: <=0.24.2
  - Fixed in: 0.25.10 (per npm audit; marked as semver-major)
  - Ref: https://github.com/advisories/GHSA-67mh-4wv8-2f99
- Installed: 0.24.0
- Fix available: 0.25.10 (semver-major per npm audit)
- Note: If a 0.24.x patched release exists on npm that addresses this CVE, prefer that for a safer update. Current npm metadata suggests 0.25.10 as the first patched version.

Available Updates (from `npm outdated`)
- Patch/Minor within the current major (recommended):
  - vite: 6.0.4 → 6.3.6 (addresses listed advisories)

- Major updates (batched/skip for now; may include breaking changes):
  - vite: 6.x → 7.1.7 — Vite 7 includes breaking changes around Node/Ecosystem support and plugin hooks; review Vite 7 migration guide.
  - esbuild: 0.24.0 → 0.25.10 — Marked semver-major; may include breaking changes (esbuild treats 0.x as unstable; APIs can break).
  - react: 18.3.1 → 19.1.1 — React 19 introduces new features and potential breaking changes; requires updated @types/react 19, React DOM 19.
  - react-dom: 18.3.1 → 19.1.1 — Follows React.
  - react-router-dom: 6.30.1 → 7.9.2 — v7 introduces breaking route/data APIs.
  - tailwindcss: 3.4.16 → 4.1.13 — v4 is a major redesign (config/content, engine, plugins).
  - tailwind-merge: 2.5.4 → 3.3.1 — Potential breaking types/merge behavior.
  - @types/react: 18.2.0 → 19.1.13 — Aligns with React 19; breaking types for React 18 code.
  - @types/react-dom: 18.2.0 → 19.1.9 — Follows React DOM 19.
  - @vitejs/plugin-react: 4.3.4 → 5.0.3 — Designed for Vite 5+/7; check compatibility notes.
  - globals: 15.12.0 → 16.4.0 — Potential types/ES version changes.
  - lucide-react: 0.453.0 → 0.544.0 — 0.x may include breaking changes per semver.

Installed Versions (key packages)
- react: ^18.2.0 (node_modules shows 18.3.1)
- react-dom: ^18.2.0 (node_modules shows 18.3.1)
- react-router-dom: ^6.8.1 (node_modules shows 6.30.1)
- vite: 6.0.4
- @vitejs/plugin-react: 4.3.4
- esbuild: 0.24.0
- tailwindcss: 3.4.16
- lucide-react: ^0.453.0

Recommendations
- Immediate patch/minor updates (low risk):
  1) Upgrade vite to 6.3.6 to remediate all listed advisories in 6.x line.
     - package.json devDependencies: "vite": "^6.3.6" (or exact "6.3.6" to stay pinned)
     - Reinstall and verify build (vite dev/build).
- Vulnerability on esbuild:
  - Preferred: If a patched 0.24.x exists addressing GHSA-67mh-4wv8-2f99, bump within 0.24.x.
  - Otherwise: Plan a controlled upgrade to 0.25.10 (marked semver-major). This may require minor build script adjustments.
- Defer/Batch majors for a future migration branch:
  - React 19 + @types/react 19 + react-dom 19 (ensure all libs are compatible).
  - React Router 7 adjustments (check route loaders/actions and v7 APIs).
  - Tailwind 4 migration (config and plugin updates).
  - Vite 7 migration (check plugin compatibility, Node version).
  - tailwind-merge 3 behavior review.

Notes on Breaking Changes (high level)
- React 19: New actions, server components improvements, type changes. Ensure all UI libraries and @types are aligned; potential impact on legacy patterns.
- Vite 7: Plugin API changes, Node/runtime requirements; some vite config options deprecated/changed.
- Tailwind 4: New config format and engine; utilities and plugin ecosystem updates required.
- React Router 7: Route object shape and data APIs changes; review loader/action usage.
- esbuild 0.25: May have breaking CLI/API switches; review build tooling.

Commands Used
- npm audit --json (summarized above)
- npm outdated --json (summarized above)

Next Steps
- Option A (safe): Apply patch/minor updates now, run build, and re-run audit.
  - vite → 6.3.6
  - Attempt esbuild patch within 0.24.x if a patched version exists; else plan major bump separately.
- Option B (migration): Create a feature branch to batch majors (React 19, Vite 7, Tailwind 4, RRD 7, esbuild 0.25+) with dedicated testing.

Request for Approval
- Would you like me to proceed with the safe updates now (upgrade vite to 6.3.6 and investigate/apply a safe esbuild patch if available), then run the build and re-run the audit? I will not apply major upgrades without your confirmation.


Repository-wide scope
- Package managers searched: npm, pnpm, yarn, Python (requirements/pyproject), Go (go.mod), Rust (Cargo.toml), Java (Gradle/Maven), PHP (Composer).
- Detected projects: Only this npm project was found in the repository.
- A reusable script to perform repo-wide audits has been added: scripts/audit-all.sh.

Esbuild risk context and decision
- The GHSA-67mh-4wv8-2f99 advisory concerns esbuild’s own development server. This project uses Vite’s development server, not esbuild’s, so practical exploitability is low.
- npm currently indicates the first patched version as 0.25.10. There does not appear to be a patched 0.24.x at the time of this report.
- Recommendation for this repo: proceed with the safe Vite update now and defer esbuild’s semver-major bump to a batched majors migration, unless there is a policy requiring immediate remediation regardless of practical exposure.
- Proposed decision: Option A (apply Vite 6.3.6 now; hold esbuild at 0.24.0 and revisit in a majors batch).