# Contributing to osm-api

Thanks for your interest in contributing! Here's how to get started.

## Reporting Issues

- Use [GitHub Issues](https://github.com/Danomanic/osm-node/issues) to report bugs or request features.
- Check existing issues before creating a new one.
- For bugs, include steps to reproduce, expected vs actual behavior, and your Node.js version.

## Development Setup

```bash
git clone https://github.com/Danomanic/osm-node.git
cd osm-node
npm install
```

### Commands

| Command | Description |
| --- | --- |
| `npm test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run build` | Build ESM + CJS output |
| `npm run check` | Run Biome linter/formatter |

## Submitting Changes

1. Fork the repo and create a branch from `main`.
2. Write tests for any new functionality.
3. Ensure all tests pass (`npm test`) and code is clean (`npm run check`).
4. Submit a pull request with a clear description of the change.

## Code Style

This project uses [Biome](https://biomejs.dev/) for linting and formatting. Run `npm run check` to verify your code. The CI pipeline enforces this on all pull requests.

## API Reference

The OSM API endpoints are documented (unofficially) at:
https://opensource.newcastlescouts.org.uk/

When adding new endpoints, follow the existing pattern in `src/resources/` — create typed request/response interfaces in `types.ts` and add corresponding tests.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](LICENSE).
