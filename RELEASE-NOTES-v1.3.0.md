# Release Notes: mcp-jest v1.3.0

**Release Date:** 2026-06-15

## New Features

### Docker Support
- Added production-ready Docker support with multi-stage builds (#51)
- Non-root container user for improved security
- Healthcheck endpoint support
- Docker Compose configuration for easy deployment
- Bundle optimized for minimal image size

## Improvements

### CI/CD
- Expanded test matrix to include Node.js 22.x
- Tests now run across Node 20.x and 22.x on ubuntu, windows, and macos platforms

## Changes Since v1.2.1

- `7fad65f` - ci: add Node.js 22.x to test matrix
- `e1fd52e` - Merge pull request #51 from ReallyArtificial/feat/docker-support
- `6d3d6cb` - Add production-ready Docker support

---

This release focuses on production-readiness with containerization support and extended platform/runtime coverage in CI.
