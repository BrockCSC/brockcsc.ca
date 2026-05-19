# Brock Computer Science Club

This is the repository for the new Brock University Computer Science Club web page.

- Next.js: 16.1.4
- React: 19.2.3
- Tailwind CSS: 4.0
- Firebase: 12.9.0
- Node.js >= v20
---------------------------------------------------------

Dev env: [http://localhost:3000](http://localhost:3000)
  
### Prerequisites

- [Node][node] >= v20
- [npm][npm] >= 10

[node]: https://nodejs.org/en/download/
[npm]: https://www.npmjs.com/get-npm

### Installation

First, run `npm install` from the terminal. This will install all the required packages into the `node_modules` folder in the root directory.

### Development

To run a development server, run:
```bash
npm run dev
```
This will spawn a Next.js server which can be accessed from `http://localhost:3000`. The file `app/page.tsx` acts as the root page, and routing is handled automatically inside the `app/` directory (Next.js App Router).

### Building the project

In order to build the site, run `npm run build`. This generates an optimized `.next` build folder in the root directory which contains the site ready for production.
