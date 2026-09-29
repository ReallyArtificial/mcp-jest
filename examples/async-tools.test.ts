import { mkdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mcpTest } from '../src/index.js';

const tempDir = join(process.cwd(), '.tmp-async-tools-example');
const serverPath = join(tempDir, 'async-tools-server.mjs');

const asyncServerSource = `
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const profileApi = {
  async fetchProfile(userId) {
    await new Promise((resolve) => setTimeout(resolve, 5));
    if (userId === 'missing') {
      throw new Error('profile not found');
    }
    return { id: userId, name: 'Ada Lovelace', plan: 'pro' };
  }
};

const server = new McpServer({ name: 'async-tools-example', version: '1.0.0' });

server.tool(
  'get-profile',
  { userId: z.string() },
  async ({ userId }) => {
    const profile = await profileApi.fetchProfile(userId);
    return {
      content: [{ type: 'text', text: JSON.stringify(profile) }]
    };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
`;

describe('async MCP tool handlers', () => {
  beforeAll(async () => {
    await mkdir(tempDir, { recursive: true });
    await writeFile(serverPath, asyncServerSource, 'utf8');
  });

  afterAll(async () => {
    await rm(tempDir, { force: true, recursive: true });
  });

  it('tests a tool handler that awaits a mocked async dependency', async () => {
    const results = await mcpTest(
      { command: 'node', args: [serverPath] },
      {
        tools: {
          'get-profile': {
            args: { userId: 'user-123' },
            expect: (result) => {
              const text = (result as { content: Array<{ text: string }> }).content[0].text;
              const profile = JSON.parse(text);
              return profile.id === 'user-123' && profile.name === 'Ada Lovelace' && profile.plan === 'pro';
            }
          }
        },
        timeout: 5000
      }
    );

    expect(results.failed).toBe(0);
    expect(results.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Tool 'get-profile' execution",
          status: 'pass'
        })
      ])
    );
  });

  it('can assert that an async tool error is expected', async () => {
    const results = await mcpTest(
      { command: 'node', args: [serverPath] },
      {
        tools: {
          'get-profile:missing-user': {
            args: { userId: 'missing' },
            shouldThrow: true
          }
        },
        timeout: 5000
      }
    );

    expect(results.failed).toBe(0);
    expect(results.results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "Tool 'get-profile:missing-user' execution",
          status: 'pass'
        })
      ])
    );
  });
});
