import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: 'mcp-server-countries',
  version: '1.0.0',
});

server.registerPrompt(
  'get-all-countries-prompt',
  {
    title: 'Get all countries details',
    description: 'Get all countries details from the REST API',
    argsSchema: {},
  },
  () => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Use tool to get all countries details from the REST API`,
        },
      },
    ],
  })
);

server.registerPrompt(
  'get-a-country-prompt',
  {
    title: 'Get a specific country details',
    description: 'Get a specific country details from the REST API',
    argsSchema: { countryName: z.string() },
  },
  ({ countryName }) => ({
    messages: [
      {
        role: 'user',
        content: {
          type: 'text',
          text: `Use tool to get a specific country details "${countryName}" from the REST API`,
        },
      },
    ],
  })
);

server.registerTool(
  'get-all-countries',
  {
    title: 'Get all countries',
    description: 'Tool to get all countries from the REST API',
    inputSchema: {},
  },
  async () => {
    const response = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,flags,languages,currencies'
    );
    const data = await response.json();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(data),
        },
      ],
    };
  }
);

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

// Register a simple resource without parameters

server.registerResource(
  'greeting-resource',
  new ResourceTemplate('greeting://general', { list: undefined }),
  {
    title: 'Greeting Resource',
    description: 'Static greeting resource',
  },
  async () => ({
    contents: [
      {
        uri: 'greeting://general',
        text: 'Hello, World!',
      },
    ],
  })
);

server.registerResource(
  'country-resource',
  new ResourceTemplate('countries://{countryName}'),
  {
    title: 'Country Resource',
    description: 'Resource to get details of a specific country',
  },
  async (uri, { countryName }) => {
    const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
    const data = await response.json();
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(data, null, 2),
          mimeType: 'application/json',
        },
      ],
    };
  }
);

// Register a simple All Country resource
// ...and the entire list of countries is placed into one giant JSON blob in contents[].text.
// This creates two problems for clients like Copilot:
// 🧠 LLM input window is limited — it may truncate or ignore part of the JSON if too large (100+ might be too much for LLM context).
// 🕵️‍♂️ LLM cannot query individual countries unless they are split into separate URIs.
server.registerResource(
  'all-countries-resource',
  new ResourceTemplate('countries://all', {
    list: async () => ({
      resources: [
        {
          uri: 'countries://all',
          name: 'All Countries',
          description: 'A dynamic list of all countries',
          mimeType: 'application/json',
        },
      ],
    }),
  }),
  {
    title: 'All Countries Resource',
    description: 'Dynamic list of all countries',
  },
  async (uri) => {
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,flags,languages,currencies'
      );
      const data = await response.json();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(data, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error) {
      return { contents: [] };
    }
  }
);

server.registerResource(
  'all-european-countries-resource',
  new ResourceTemplate('countries://europe', {
    list: async () => ({
      resources: [
        {
          uri: 'countries://europe',
          name: 'All European Countries',
          description: 'Filtered list of countries from Europe',
          mimeType: 'application/json',
        },
      ],
    }),
  }),
  {
    title: 'European Countries Resource',
    description: 'Returns a filtered JSON list of European countries only (safe for LLM context)',
  },
  async () => {
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,region');
      const data = await response.json();

      const europeOnly = data
        .filter((c: any) => c.region === 'Europe')
        .map((c: any) => c.name?.common)
        .filter(Boolean) // remove null/undefined
        .sort();

      return {
        contents: [
          {
            uri: 'countries://europe',
            text: JSON.stringify(europeOnly, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error) {
      return { contents: [] };
    }
  }
);

// Dynamic resource for a specific country with parameter
server.registerResource(
  'country-resource',
  new ResourceTemplate('countries://{countryName}'),
  {
    title: 'Country Resource',
    description: 'Country info based on dynamic name',
  },
  async (uri, { countryName }) => {
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
      const data = await response.json();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(data, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error) {
      return { contents: [] };
    }
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
