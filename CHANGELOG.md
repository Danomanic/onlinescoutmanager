# Changelog

## 1.0.0

Complete rewrite of `osm-node` as `osm-api`.

### Breaking Changes

- Package renamed from `osm-node` to `osm-api`
- Entirely new API — class-based `OSMClient` replaces global state pattern
- TypeScript-first with full type definitions
- Requires Node.js 18+ (native `fetch`)
- Zero runtime dependencies (removed `axios`)

### Added

- `OSMClient` class with instance-based auth and config
- Resource namespaces: `members`, `attendance`, `programme`, `sections`, `badges`, `dashboard`, `customData`, `email`
- Custom error classes: `OSMError`, `OSMAuthError`
- ESM + CJS dual output
- Full test suite with vitest (33 tests)
- TypeScript strict mode