# MCP Server Countries Demo

MCP Server Countries is a lightweight MCP Server that allows you to manage a list of countries. It is built with TypeScript and designed for learning, prototyping Model Context Protocol (MCP) tools.

_Note: This project is used in course [Playwright z AI + MCP](https://jaktestowac.pl/course/playwright-z-ai/)._

---

## 📁 Project Structure

Each directory in this repository (e.g., `mcp-server-countries-demo-S01L02`, `mcp-server-countries-demo-S01L04`, `mcp-server-countries-demo-S01L06`) is a standalone project that corresponds to a specific lesson in the course. You can explore and run each lesson's code independently.

---

## 📦 Features

- List all countries
- Get details of a specific country
- Add a new country
- Update country information
- Delete a country

Server is designed to be simple and easy to extend for learning purposes.
Is using free and open source [https://restcountries.com](https://restcountries.com) API to fetch country data.

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:

2. Open a terminal and run:

```bash
npm i
```

### Running the Server

1. Test with MCP Inspector:

```bash
npx -y @modelcontextprotocol/inspector npx -y tsx main.ts
```

or run directly:

```bash
npm run test
```

2. Use with VS Code

1. Open the `mcp.json`file in `.vscode` folder
1. Click the start server button (above line `"mcp-server-countries"`)
1. Open Chat mode and select agent
1. Type into the chat and ask `What countries do you have?` or `Use tool to get information about country Poland and its population`

---

## Links and Resources

- [TypeScript](https://www.typescriptlang.org) - TypeScript documentation
- [modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/sdk) - Model Context Protocol SDK

---

## 📞 Contact & Support

Feel free to reach out to us:

- 🌐 **Website**: [jaktestowac.pl](https://jaktestowac.pl)
- 💼 **LinkedIn**: [jaktestowac.pl](https://www.linkedin.com/company/jaktestowac/)
- 💬 **Discord**: [Polish Playwright Community](https://discord.gg/mUAqQ7FUaZ)
- 📧 **Support**: Check our website for contact details

---

## Learning Resources

We have gathered a collection of resources to help you learn and master Playwright, both in Polish and English. Whether you're a beginner or an advanced user, these resources will help you enhance your skills and knowledge.

### **🇵🇱 Polish Resources**

- [Free Playwright Resources](https://jaktestowac.pl/darmowy-playwright/) - Comprehensive Polish learning materials
- [Playwright Basics](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cD2TCB__K7NP5XARaCzZYn7) - YouTube series (Polish)
- [Playwright Elements](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cAcpd-XN4pKeo-l4YK35FDA) - Advanced concepts (Polish)
- [Playwright MCP](https://www.youtube.com/playlist?list=PLfKhn9AcZ-cCqD34AG5YRejujaBqCBgl4) - MCP course (Polish)
- [Discord Community](https://discord.gg/mUAqQ7FUaZ) - First Polish Playwright community!
- [Playwright Info](https://playwright.info/) - first and only Polish Playwright blog

### **🇬🇧 English Resources**

- [VS Code Extensions](https://marketplace.visualstudio.com/publishers/jaktestowac-pl) - Our free Playwright plugins
- [Playwright Documentation](https://playwright.dev/docs/intro) - Official documentation
- [Playwright GitHub](https://github.com/microsoft/playwright) - Source code and issues

_PS. For more resources and updates, follow us on our [website](https://jaktestowac.pl) and [GitHub](https://github.com/jaktestowac)._

---

**Happy testing and automating tests!** 🚀

**jaktestowac.pl Team** 💚❤️

_PS. For more resources and updates, follow us on our [website](https://jaktestowac.pl) and [GitHub](https://github.com/jaktestowac)._

---

_Built with 💚❤️ for the Playwright and testing automation community_
