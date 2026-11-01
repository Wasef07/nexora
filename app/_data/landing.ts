export const landingContent = {
  hero: {
    eyebrow: "Early access",
    headline: "Build what's next with",
    highlightedName: "Nexora",
    subtitle:
      "A thoughtful workspace for building intelligent agents and turning ambitious ideas into useful, everyday workflows.",
    primaryAction: "Start building free",
    secondaryAction: "See how it works",
    videoAlt: "Preview of the Nexora workspace",
    videoFallback: "Your browser does not support embedded videos.",
  },
  audience: {
    label: "Made for people building what comes next",
    groups: [
      "Product teams",
      "Founders",
      "Solo builders",
      "Agencies",
      "Consultants",
    ],
  },
  features: {
    title: "One agent, one workspace, your whole team",
    surfaces: [
      {
        id: "canvas",
        name: "Canvas",
        icon: "canvas",
        description:
          "An infinite whiteboard where the agent draws flowcharts, ERDs, architecture diagrams, and org charts shape by shape, and edits them in place when you ask.",
        bullets: [
          "Generate diagrams one shape at a time",
          "Ask for edits right where you are working",
          "Explore ideas on an infinite whiteboard",
        ],
        mockup: {
          title: "Workspace map",
          nodes: ["Brief", "Agent", "Launch"],
          agentLabel: "Agent is connecting ideas",
        },
      },
      {
        id: "docs",
        name: "Docs",
        icon: "docs",
        description:
          "A block editor where the agent turns a diagram into a written spec and rewrites or summarizes sections on command.",
        bullets: [
          "Turn diagrams into clear written specs",
          "Rewrite any section in your own voice",
          "Summarize long docs with a prompt",
        ],
        mockup: {
          title: "Product brief",
          subtitle: "A plan, shaped together",
          sectionTitle: "Overview",
          callout: "The agent turns your ideas into a clear, actionable spec.",
        },
      },
      {
        id: "team-board",
        name: "Team Board",
        icon: "board",
        description:
          "A Kanban board for every workspace in your org, with live cursors so teammates can jump in together.",
        bullets: [
          "See every workspace board in one place",
          "Move work through a shared Kanban flow",
          "Jump in together with live cursors",
        ],
        mockup: {
          title: "Product launch",
          columns: [
            { title: "To do", cards: ["User research", "Draft brief"] },
            { title: "In progress", cards: ["Design review"] },
            { title: "Done", cards: ["Kickoff"] },
          ],
        },
      },
    ],
  },
  howItWorks: {
    eyebrow: "How it works",
    title: "From first thought to connected plan",
    description:
      "Your agent pays attention, maps the idea, and builds it with you one connected step at a time.",
    steps: [
      {
        number: "01",
        title: "Watch",
        description:
          "The agent follows the context of your workspace and what you are trying to make, so each next step fits the bigger picture.",
      },
      {
        number: "02",
        title: "Draw",
        description:
          "It turns your direction into clear shapes and connections, placing the first waypoints along the route from idea to outcome.",
      },
      {
        number: "03",
        title: "Build",
        description:
          "You refine the route together. The agent adds and adjusts connected elements iteratively until the whole plan takes shape.",
      },
    ],
  },
  pricing: {
    eyebrow: "Pricing",
    title: "A plan for your next big idea",
    placeholder: "Pricing details are coming soon.",
  },
  closing: {
    eyebrow: "Your next idea starts here",
    title: "Build the route as you go.",
    description:
      "Bring your team, your ideas, and your agent into one shared workspace.",
    action: "Start building free",
    mascotAlt: "Nexora mascot",
  },
  footer: "Made with 🤍 by Raze",
} as const;
