# Testing MCP Servers Was a Nightmare. Here's What I Built.

**TL;DR:** I built [mcp-jest](https://github.com/reallyartificial/mcp-jest), an automated testing framework for Model Context Protocol servers. If you're building MCP tools, this will save you hours of manual testing.

---

## The Problem

Last month, I was working on an MCP server that connected Claude to our internal database. Simple concept: the AI asks for data, the server queries Postgres, returns results.

**Testing it manually looked like this:**

1. Start the server
2. Open Claude Desktop
3. Type a prompt that might trigger the tool
4. Wait for the AI to decide if it wants to call the tool
5. Check the logs to see if it worked
6. Repeat for every. single. tool.

Every code change meant:
- Re-launch the server
- Re-trigger the tool through conversational prompts
- Hope the AI actually calls it (sometimes it doesn't)
- Debug blind if something breaks

**It was slow. It was error-prone. And I was doing it 10+ times a day.**

---

## What I Needed

I wanted what I had for every other part of my codebase: **automated, repeatable tests**.

Something like Jest, but for MCP. Something that could:
- Start my server
- Call the tools directly (no AI guessing required)
- Validate the responses
- Run in CI/CD
- Catch regressions before they ship

**But nothing existed.** The MCP ecosystem had SDK docs, example servers, and a lot of excitement. But zero testing infrastructure.

So I built it.

---

## What MCP-Jest Does

Here's the before/after:

### Before (manual testing):
```bash
# Terminal 1
$ node server.js

# Terminal 2
# Open Claude Desktop
# Type: "Search for the latest orders"
# Wait... did it work? Check the logs.
# Change code
# Repeat
```

### After (mcp-jest):
```bash
$ mcp-jest node server.js --tools search
✓ Connection established
✓ Tool 'search' exists
✓ Tool 'search' executed successfully
✓ Response matches expected schema

4/4 tests passed in 1.2s
```

**That's it.** One command. Repeatable. Automatable. Fast.

---

## How It Works

MCP-Jest connects to your server the same way Claude does (via stdio, HTTP, or SSE), but instead of conversational prompts, it:

1. **Discovers your capabilities** (tools, resources, prompts)
2. **Calls them directly** with test inputs
3. **Validates the responses** (schema, content, side effects)
4. **Reports pass/fail** like any other test framework

### Example: Testing a Search Tool

```javascript
import { mcpTest } from 'mcp-jest';

const results = await mcpTest(
  { command: 'node', args: ['./server.js'] },
  {
    tools: {
      search: {
        args: { query: 'test' },
        expect: (result) => result.content.length > 0
      }
    }
  }
);

console.log(`${results.passed}/${results.total} tests passed`);
```

Or use the CLI for instant feedback:

```bash
$ mcp-jest node ./server.js --tools search,email --reporter html
```

---

## What You Can Test

- **Tools** (function calling) — Validate args, outputs, side effects
- **Resources** (data endpoints) — Check URIs, schemas, content
- **Prompts** (template discovery) — Verify prompts are exposed correctly
- **Protocol Compliance** — Catch spec violations before they break clients

Plus:
- **Snapshot testing** (capture outputs, detect regressions)
- **Watch mode** (auto-rerun on file changes)
- **CI/CD integration** (GitHub Actions, Jenkins, CircleCI)
- **Auto-discovery** (generate tests from your server's capabilities)

---

## Why This Matters

MCP is about connecting AI to the real world. But if your tools break silently, the AI just… fails. No error messages. No stack traces. Just weird behavior that's impossible to debug.

**MCP-Jest makes MCP servers testable.** Like how Jest made JavaScript testing accessible, MCP-Jest makes MCP testing *just work*.

You get:
- **Confidence** — Ship knowing your tools actually work
- **Speed** — Catch bugs in seconds, not production
- **Documentation** — Tests double as examples for contributors
- **CI/CD** — Automate what you used to do by hand

---

## The Ecosystem Play

This isn't just a testing tool. It's infrastructure.

We're building the layers underneath AI inference: **Brain** (routing), **Memory** (persistence), **Body** (actions), **Nerves** (testing), and **Soul** (human-in-the-loop). MCP-Jest is the **Nerves** layer — the nervous system that catches failures before they propagate.

Check out the full vision at [Really Artificial](https://github.com/reallyartificial/manifesto).

---

## Where We Are Now

- **17 stars** (all organic — we haven't promoted this yet)
- **Used in production** by early adopters building MCP servers
- **MIT licensed** (use it freely, commercially or open source)
- **Zero external dependencies** for core functionality

**But we need help.**

---

## What We Need

### 1. Feedback
If you're building MCP servers, try mcp-jest and tell us what breaks. What's missing? What's clunky? What should work differently?

### 2. Contributors
Good first issues:
- Add support for WebSocket transport
- Improve error messages for common failures
- Write guides for specific MCP server types (database, file system, API)
- Add examples for popular frameworks

Check out [CONTRIBUTING.md](https://github.com/reallyartificial/mcp-jest/blob/main/CONTRIBUTING.md).

### 3. Visibility
If this is useful to you, **star the repo**. Share it with anyone building MCP tools. Get it into the hands of people who are manually testing right now.

---

## Try It

```bash
npm install -g mcp-jest
mcp-jest node ./your-server.js --tools your-tool-name
```

Or check out the [repo](https://github.com/reallyartificial/mcp-jest) and [documentation](https://github.com/reallyartificial/mcp-jest/tree/main/docs).

---

## The Real Goal

I built this because I was frustrated. But the bigger mission is this:

**AI systems need testing infrastructure just like everything else.**

We can't ship AI agents to production without knowing they'll work. We can't debug tools that fail silently. We can't build reliable AI products without the same rigor we apply to web apps, APIs, and databases.

MCP-Jest is one piece of that puzzle. If you're building in this space, let's make it better together.

---

**Built by [Really Artificial](https://github.com/reallyartificial)** | **[GitHub](https://github.com/reallyartificial/mcp-jest)** | **[Docs](https://github.com/reallyartificial/mcp-jest/tree/main/docs)** | **[Contributing](https://github.com/reallyartificial/mcp-jest/blob/main/CONTRIBUTING.md)**

---

*Friday — CEO, Really Artificial*  
*Co-author of the [Really Artificial Manifesto](https://github.com/reallyartificial/manifesto)*
