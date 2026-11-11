# Nexora

**Your AI workspace for intelligent agents and automated workflows.**
[Live demo](https://nexora-three-dusky.vercel.app) · [Report a bug](https://github.com/Wasef07/nexora/issues)

Nexora is an agentic workspace where an AI agent works alongside your team. Describe what you want in plain language, and the agent draws it on an infinite canvas, writes it up as a spec, and keeps every workspace organized on a shared Kanban board.

## Features
- **Canvas:** an infinite whiteboard where the agent draws flowcharts, ERDs, architecture diagrams and org charts shape by shape, and edits them in place when you ask.
- **Docs:** a block editor where the agent turns a diagram into a written spec, and rewrites or summarizes sections on command.
- **Team board:** a Kanban board for every workspace in your org, with live cursors so teammates can work together.
- **ERD tables:** database tables you can edit directly on the card. Rename a table by double-clicking it, edit a column by clicking its row, toggle PK/FK, reorder columns and delete them from a floating toolbar. Relationship arrows attach to the linked row and re-route when tables move.
- **Sharing:** share a workspace through a read-only link.
- **Accounts and plans:** sign in with Clerk, with Personal and Team plans.

## How it works

### From the user's side
1. **Watch:** the agent follows the context of your workspace and what you are trying to make.
2. **Draw:** you give a direction, for example "Map out our SaaS architecture, then write the spec", and the agent turns it into shapes and connections on the canvas.
3. **Build:** you refine together. Ask for changes, and the agent edits the canvas in place and adds or adjusts connected elements until the plan takes shape.

### Under the hood
- The agent panel sends your prompt to an LLM (Gemini, through the AI SDK).
- The model does not return text only. It calls **tools** that create and edit canvas content, such as shapes, arrows, entity tables and relationships.
- Those tool calls are applied to the **tldraw** canvas, so you watch the diagram appear step by step.
- The same workspace has a **BlockNote** document. The agent can read the diagram and write or rewrite the matching spec.
- Workspaces, documents and canvases are stored in **PostgreSQL** through **Prisma**.
- **Clerk** handles sign-in, sessions, plans and billing, and protects the app routes.

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui |
| Canvas | tldraw, with a custom ERD table shape |
| Document editor | BlockNote |
| AI | AI SDK with Gemini tool calls |
| Auth and billing | Clerk |
| Database | PostgreSQL (Supabase) with Prisma ORM |
| Hosting | Vercel |

## Project structure

```
actions/      server actions (data changes)
app/          routes and layouts (App Router)
components/   UI, canvas shapes, editor, agent panel
hooks/        shared React hooks
lib/          helpers, Clerk appearance, agent tools
prisma/       database schema and migrations
public/       brand assets, textures and demo video
proxy.ts      route protection with Clerk
```

## Getting started

### Prerequisites
- Node.js 20.9 or newer
- A [Clerk](https://clerk.com) application
- A PostgreSQL database (for example a free [Supabase](https://supabase.com) project)
- A Google AI (Gemini) API key

### Setup
```bash
git clone https://github.com/Wasef07/nexora.git
cd nexora
npm install
```

Create a `.env.local` file in the project root and add your own values:
```bash
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Database
DATABASE_URL=

# AI
GOOGLE_GENERATIVE_AI_API_KEY=

# Supabase (if used for realtime)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Set up the database and start the app:
```bash
npx prisma migrate dev
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Never commit `.env.local`. It holds your secret keys.

## Deployment

The app is deployed on [Vercel](https://vercel.com).
1. Import the repository into Vercel.
2. Add the same environment variables in the project settings.
3. For a live site, use your Clerk **production** instance keys, not the development keys.
4. Run `npx prisma migrate deploy` against your production database.

## What I learned
- Building a custom tldraw shape with inline editing, and stopping keyboard and pointer events from clashing with the canvas.
- Binding arrows to table rows by ID, so relationships survive moving, resizing and reordering.
- Using Clerk's modal sign-in and a shared appearance config so authentication matches the product theme.
- Designing a small token-based theme (blue, black and graphite, with amber as a rare accent) and applying it across the whole app.

## Author
Made with ❤️ by [Raze](https://www.linkedin.com/in/sk-wasef-mostafa/)
