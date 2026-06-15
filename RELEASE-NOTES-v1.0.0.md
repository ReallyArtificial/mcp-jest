# MCP-Jest v1.0.0 - Initial Release

**First stable release of MCP-Jest** — a testing framework for Model Context Protocol (MCP) servers.

## What's Included

### Core Features
- **MCP Server Testing Framework**: Like Jest, but specifically designed for MCP servers
- **Test Discovery**: Automatic detection of `.mcp-test.js` files
- **Built-in Reporters**: Colorized test output with pass/fail indicators
- **Schema Validator**: Validates MCP server responses against protocol specifications
- **Test Filtering**: `--filter` and `--skip` flags for selective test execution

### Infrastructure
- **Docker Support**: Production-ready multi-stage Dockerfile with non-root user and healthcheck
- **CI/CD**: GitHub Actions workflow testing on Node.js 20.x, 21.x, 22.x across Ubuntu, Windows, macOS
- **LLM Discoverability**: `llms.txt` and `llms-full.txt` for AI-assisted development

### Streamable HTTP
- Support for HTTP-based MCP servers with streaming responses
- Built on MCP SDK 1.12.1

## Installation

```bash
npm install -g mcp-jest
```

## Usage

```bash
# Run all MCP tests
mcp-jest

# Run with filtering
mcp-jest --filter "specific test pattern"
mcp-jest --skip "tests to exclude"
```

## Docker

```bash
docker pull reallyartificial/mcp-jest:latest
docker run --rm -v $(pwd):/workspace mcp-jest
```

---

**Full Changelog**: Initial release
**Contributors**: @josharsh, @fridayjoshi
