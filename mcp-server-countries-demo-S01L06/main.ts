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
  new ResourceTemplate('greeting://general'),
  {
    title: 'Greeting Resource', // Display name for UI
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

// Register a simple resource with a parameter
server.registerResource(
  'greeting-resource-with-parameter',
  new ResourceTemplate('greeting://{name}'),
  {
    title: 'Greeting Resource with Parameter',
    description: 'Dynamic greeting generator',
  },
  async (uri, { name }) => ({
    contents: [
      {
        uri: uri.href,
        text: `Hello, ${name}!`,
      },
    ],
  })
);

// Register a simple All Country resource
server.registerResource(
  'all-countries',
  new ResourceTemplate('all-countries://all'),
  {
    title: 'All Countries Resource',
    description: 'Dynamic list of all countries',
  },
  async (uri) => {
    // Get all countries
    try {
      const response = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,capital,region,population,area,flags,languages,currencies'
      );
      const data = await response.json();
      return {
        contents: [
          {
            uri: 'countries://all',
            text: JSON.stringify(data, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error) {
      // Fall through to empty contents
    }
    return { contents: [] };
  }
);

// Dynamic resource for a specific country with parameter
server.registerResource(
  'country-resource',
  new ResourceTemplate('countries://{countryName}', { list: undefined }),
  {
    title: 'Country Resource',
    description: 'Dynamic country information',
  },
  async (uri, { countryName }) => {
    // Fetch country data based on the countryName parameter
    try {
      const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
      const data = await response.json();
      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(data, null, 2),
          },
        ],
      };
    } catch (error) {
      // Fall through to empty contents
    }
    return { contents: [] };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
