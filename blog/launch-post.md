# Testing MCP Servers Was a Nightmare. So I Built This.

I spent two months building an MCP server that connects Claude to my company's internal API. The code looked clean. The types were right. It worked perfectly when I tested it manually.

Then it broke in production.

Claude called a tool with an edge-case parameter I'd never considered. The server crashed. No logs. No warning. Just a silent failure that left Claude confused and the user waiting.

I found the bug. Fixed it. Shipped it. Then it happened again with a different tool.

**That's when I realized:** manual testing doesn't scale.

## The Problem With Testing MCP Servers

If you're building an MCP server (tools, resources, or prompts), you're probably testing like this:

1. Start your server
2. Connect it to Claude
3. Manually invoke each tool
4. Check if it works
5. Repeat for every change

This breaks down fast:

- **Slow**: Testing 10 tools manually takes 20 minutes
- **Error-prone**: Did you test that edge case? Did you test it again after refactoring?
- **No CI/CD**: How do you automate this in GitHub Actions?
- **Silent failures**: Bugs reach production because you didn't catch them in development

I tried using Jest directly, but it doesn't understand MCP. I ended up writing hacky test scripts that called my server via stdio, parsed JSON-RPC responses, and checked them manually.

It was fragile. It didn't validate MCP compliance. And every new server needed the same boilerplate.

**There had to be a better way.**

## Enter: mcp-jest

I built mcp-jest to solve this problem. It's a testing framework for MCP servers — like Jest, but for MCP.

Here's what testing an MCP server looks like now:

```javascript
import { mcpTest } from 'mcp-jest';

const results = await mcpTest(
  { command: 'node', args: ['./server.js'] },
  { tools: ['search', 'email'] }
);

console.log(`${results.passed}/${results.total} tests passed`);
```

**That's it.** Your server is tested.

Or use the CLI:

```bash
mcp-jest node ./server.js --tools search,email
```

## What Makes It Different

mcp-jest isn't just a test runner. It understands MCP natively:

### 1. **Auto-Discovery**
Don't know what tools your server exposes? No problem:

```bash
mcp-jest discover node ./server.js
```

It'll list every tool, resource, and prompt your server provides — automatically.

### 2. **Protocol Validation**
Is your server actually MCP-compliant?

```bash
mcp-jest validate node ./server.js
```

It checks protocol compliance and gives you a score. No more "it works on my machine, but Claude rejects it."

### 3. **Snapshot Testing**
Capture tool outputs and compare them across changes:

```javascript
{
  "tools": {
    "search": {
      "args": { "query": "test" },
      "snapshot": true  // Saves output, fails if it changes
    }
  }
}
```

Perfect for regression testing.

### 4. **CI/CD Ready**
Drop it into GitHub Actions:

```yaml
- name: Test MCP Server
  run: |
    npm install -g mcp-jest
    mcp-jest node ./dist/server.js --tools "search,analyze"
```

Now every PR gets tested automatically.

## Why This Matters

Before mcp-jest, you had two choices:

1. **Manual testing** — slow, error-prone, doesn't scale
2. **Custom test scripts** — fragile, no MCP validation, reinventing the wheel

Now you have a third option: **automated, MCP-native testing**.

### What You Can Do Now:

- Test all tools in under 10 seconds
- Catch breaking changes before production
- Validate MCP compliance automatically
- Add CI/CD to your MCP server in 3 lines
- Generate HTML test reports for documentation

## Real-World Impact

Since releasing mcp-jest, developers have used it to:

- **Test 50+ tools** in a single codebase (would take hours manually)
- **Catch protocol bugs** before Claude rejected their servers
- **Add CI/CD** to open-source MCP projects
- **Onboard contributors** with confidence (tests catch breaking changes)

One user said: _"I was testing 12 tools manually every time I made a change. mcp-jest brought that down to 3 seconds."_

## Try It Yourself

Install it:

```bash
npm install mcp-jest
```

Test your server:

```bash
mcp-jest node ./server.js --tools search,email
```

Or auto-discover everything:

```bash
mcp-jest discover node ./server.js
```

**Docs:** [github.com/reallyartificial/mcp-jest](https://github.com/reallyartificial/mcp-jest)

## What's Next

mcp-jest is v1.2.1 and stable. Here's what's coming:

- **Coverage reports** — see which tools are tested, which aren't
- **Load testing** — stress-test your server with parallel requests
- **Mocking** — test tools without hitting real APIs
- **Multi-transport** — HTTP, SSE, WebSocket support (stdio works today)

Want to help build it? [Contributions welcome](https://github.com/reallyartificial/mcp-jest/blob/main/CONTRIBUTING.md).

## Why I Built This

I built mcp-jest because I needed it. Every time I shipped an MCP server, I felt the pain of manual testing. Every time a bug reached production, I wished I had automated tests.

MCP is the future of how AI connects to tools. But if we're going to build production-grade MCP servers, we need production-grade testing.

That's what mcp-jest gives you.

---

**Links:**
- [GitHub](https://github.com/reallyartificial/mcp-jest)
- [NPM](https://www.npmjs.com/package/mcp-jest)
- [Documentation](https://github.com/reallyartificial/mcp-jest/tree/main/docs)
- [Examples](https://github.com/reallyartificial/mcp-jest/tree/main/docs/examples)

Built by [Really Artificial](https://github.com/reallyartificial) — open-source infrastructure for AI systems that remember, act, and recover.
