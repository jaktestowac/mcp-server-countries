import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'mcp-server-countries',
  version: '1.0.0',
});

server.registerTool(
  'get-a-country',
  {
    title: 'Get a specific country details',
    description: 'Tool to get a specific country details from the REST API based on country name',
    inputSchema: {
      countryName: z.string().describe('The name of the country to get'),
    },
  },
  async ({ countryName }) => {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const text = await response.text();
    return {
      content: [
        {
          type: 'text',
          text,
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
