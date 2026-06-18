# Release Notes: mcp-jest v1.2.1

**Release Date:** 2026-06-15

## 🎉 First Public Release

This is the initial public release of **mcp-jest** — a testing framework for Model Context Protocol (MCP) servers. Test your AI agent tools with Jest-like syntax and integrate with CI/CD pipelines.

## ✨ Core Features

### Testing Framework
- **Automated MCP server testing** — Test tools, resources, and prompts programmatically
- **Jest-like syntax** — Familiar API for developers already using Jest
- **Snapshot testing** — Validate MCP server responses and detect regressions
- **Test filtering** — Use `--filter` and `--skip` flags to run specific tests
- **Type-safe API** — Full TypeScript support with exported interfaces

### CLI Tool
- **Global installation** — `npm install -g mcp-jest` or `npx mcp-jest`
- **JSON configuration** — Define test suites in `mcp-jest.config.json`
- **Colorful output** — Clear, formatted test results
- **Configurable timeouts** — Customize server startup and test timeouts

### CI/CD Integration
- **Multi-platform CI** — Tested on Ubuntu, Windows, macOS
- **Node.js version matrix** — Supports Node.js 18.x, 20.x, 22.x
- **GitHub Actions ready** — Drop-in CI workflow examples
- **Automated test reports** — Integrate with your existing CI pipeline

### Developer Experience
- **Comprehensive documentation** — README, API reference, examples, architecture guides
- **Issue templates** — Bug reports, feature requests with structured formats
- **Contribution guidelines** — CODE_OF_CONDUCT.md, CONTRIBUTING.md, SECURITY.md
- **Real-world examples** — Demo servers and test scenarios included

## 🐳 Production Features (Added in v1.2.1)

### Docker Support (June 14, 2026)
- Multi-stage Dockerfile (builder + production)
- Non-root user (`mcpjest:1001`) for security
- Healthcheck for CLI availability
- `docker-compose.yml` with resource limits
- Supports both CLI and library use cases

### Enhanced CI Coverage (June 14, 2026)
- Node.js 22.x added to test matrix
- Cross-platform testing (Ubuntu/Windows/macOS × Node 18/20/22)
- Ensures compatibility across all supported Node versions

## 📦 Installation

```bash
# As a dependency
npm install mcp-jest

# Globally for CLI
npm install -g mcp-jest

# Or use npx (no installation)
npx mcp-jest --config test-config.json
```

## 🚀 Quick Start

```javascript
import { mcpTest } from 'mcp-jest';

const results = await mcpTest(
  { command: 'node', args: ['./server.js'] },
  { tools: ['search', 'email'] }
);

console.log(`${results.passed}/${results.total} tests passed`);
```

## 🐛 Bug Fixes

- Fixed HTTP streamable transport support (August 15, 2025)
- Improved test filtering edge cases (July 15, 2025)
- Enhanced error handling for server startup failures

## 📚 Documentation

- Full README with problem/solution overview
- API reference with TypeScript interfaces
- Examples covering basic and advanced use cases
- Architecture documentation explaining how it works
- Snapshot testing guides

## 🔗 Links

- **GitHub:** https://github.com/reallyartificial/mcp-jest
- **npm:** https://www.npmjs.com/package/mcp-jest (pending publish)
- **Documentation:** See README.md
- **Issues:** https://github.com/reallyartificial/mcp-jest/issues

## 🙏 Acknowledgments

Built by the Really Artificial team to solve the pain of manually testing MCP servers. Special thanks to the MCP community for early feedback.

---

**What's Next?**
- Community feedback and iteration
- Additional testing assertions
- Performance optimizations
- VS Code extension for MCP testing
- Integration with popular MCP server frameworks

Report bugs or request features at: https://github.com/reallyartificial/mcp-jest/issues
