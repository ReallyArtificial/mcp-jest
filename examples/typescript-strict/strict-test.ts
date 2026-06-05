/**
 * TypeScript strict-mode example for mcp-jest.
 *
 * Strict mode enables a suite of type-safety checks that catch common bugs:
 *   strictNullChecks  — variables can't be null/undefined unless declared so
 *   noImplicitAny     — all variables must have explicit or inferred types
 *   strictFunctionTypes — parameter types are checked contravariantly
 *   ... and more (see https://www.typescriptlang.org/tsconfig#strict)
 *
 * Run: tsc --noEmit   (validates types without emitting JS)
 * Run: node --loader ts-node/esm strict-test.ts  (execute with ts-node)
 */

import {
  mcpTest,
  formatResults,
  type MCPServerConfig,
  type MCPTestConfig,
  type TestResults,
} from 'mcp-jest';

// ── Server configuration ────────────────────────────────────────────────────
//
// Strict gotcha #1: explicit types prevent `any` from slipping in through
// object literals. Annotate MCPServerConfig directly instead of relying on
// inference from an untyped literal.

const server: MCPServerConfig = {
  command: 'node',
  args: ['./my-mcp-server.js'],
  // env is optional — strict mode keeps it safely omitted (no `env: undefined`)
};

// ── Test configuration ──────────────────────────────────────────────────────
//
// Strict gotcha #2: expectation callbacks must declare parameter types.
// Without strict mode `result` would silently be `any`; with strict mode you
// must narrow it or assert the type.

const config: MCPTestConfig = {
  tools: {
    search: {
      args: { query: 'mcp-jest strict mode' },
      // result is `unknown` here — narrow before accessing properties
      expect: (result: unknown): boolean => {
        if (result === null || typeof result !== 'object') return false;
        const r = result as Record<string, unknown>;
        return Array.isArray(r['content']) && (r['content'] as unknown[]).length > 0;
      },
    },
    echo: {
      args: { message: 'hello strict' },
      // String-based expectations work fine in strict mode too
      expect: 'success === true',
    },
  },
  resources: {
    'config.json': { expect: 'exists' },
  },
  timeout: 15_000,
};

// ── Main ────────────────────────────────────────────────────────────────────
//
// Strict gotcha #3: the return type of mcpTest is Promise<TestResults>.
// Annotating it explicitly makes the linter warn if you accidentally ignore
// the returned value.

async function runStrictExample(): Promise<void> {
  console.log('🔒 Running mcp-jest in TypeScript strict mode…\n');

  // Strict gotcha #4: error handling — `error` in catch is `unknown`, not `Error`.
  // Cast it explicitly before accessing `.message`.
  let results: TestResults;
  try {
    results = await mcpTest(server, config);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('❌ Test runner threw an error:', message);
    process.exit(1);
  }

  console.log(formatResults(results));

  if (results.failed > 0) {
    process.exit(1);
  }
}

runStrictExample();
