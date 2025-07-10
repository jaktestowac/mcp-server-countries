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
const regionDataSet = [
  { region: 'Europe', avgTemperature: 10 },
  { region: 'Americas', avgTemperature: 15 },
  { region: 'Asia', avgTemperature: 20 },
  { region: 'Africa', avgTemperature: 25 },
  { region: 'Oceania', avgTemperature: 30 },
  { region: 'Antarctica', avgTemperature: -5 },
  { region: 'Polar', avgTemperature: -10 },
  { region: "R'lyeh", avgTemperature: -2 },
];

server.registerResource(
  'regions-resource',
  new ResourceTemplate('regions://all', {
    list: undefined,
  }),
  {
    title: 'All Regions (Static)',
    description: 'Static resource with regions',
  },
  async (uri) => {
    // This is a static resource, so we return the predefined data
    const data = regionDataSet;
    return {
      contents: [
        {
          uri: 'regions://all',
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  }
);

const transport = new StdioServerTransport();
server.connect(transport);
