import Link from "next/link";
import Image from "next/image";
import { landingContent } from "@/app/_data/landing";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PricingTable } from "@clerk/nextjs";

const PRICING_TAB =
  "rounded-full px-5 py-1.5 data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground";

function ArrowRight() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M5 12h14m-6-6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FeatureIcon({ name }: { name: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        aria-hidden="true"
        {...common}
      >
        {name === "canvas" ? (
          <>
            <rect x="3.5" y="4" width="7" height="7" rx="1.5" />
            <rect x="13.5" y="13" width="7" height="7" rx="1.5" />
            <path d="M10.5 7.5h3a2 2 0 0 1 2 2v3.5" />
          </>
        ) : name === "docs" ? (
          <>
            <path d="M7 3.5h7l4 4V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
            <path d="M14 3.5v4h4M9 12h6M9 16h6" />
          </>
        ) : (
          <>
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M3 9h18M9 9v11M15 9v11" />
          </>
        )}
      </svg>
    </div>
  );
}

function BrowserFrame({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-white/10 bg-[#101012] shadow-[0_24px_80px_-35px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex h-10 items-center gap-1.5 border-b border-white/[0.07] px-4">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <div className="ml-3 h-4 flex-1 rounded-md bg-white/[0.025]" />
      </div>
      {children}
    </div>
  );
}

function CanvasMockup() {
  return (
    <BrowserFrame>
      <div className="relative bg-[radial-gradient(circle,rgba(255,255,255,0.075)_1px,transparent_1px)] bg-[size:22px_22px] p-3 sm:p-5">
        <div className="mb-1 flex items-center justify-between gap-3 px-2 pt-1">
          <span className="text-xs font-medium text-white/70">
            Authentication flow
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/[0.08] px-2.5 py-1 text-[10px] text-primary sm:text-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Agent-generated
          </span>
        </div>

        <svg
          viewBox="0 0 600 340"
          role="img"
          aria-label="Flowchart: Request leads to an authentication decision. Yes loads the workspace; no redirects to sign in."
          className="block h-auto w-full"
        >
          <defs>
            <marker
              id="nexora-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
              markerUnits="userSpaceOnUse"
            >
              <path d="M0 0 L7 4 L0 8 Z" fill="#777780" />
            </marker>
          </defs>

          {/* Connectors are drawn first so they remain behind the nodes. */}
          <g
            fill="none"
            stroke="#777780"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M300 81 V119" markerEnd="url(#nexora-arrow)" />
            <path d="M300 191 V220 L170 252" markerEnd="url(#nexora-arrow)" />
            <path d="M300 220 L430 252" markerEnd="url(#nexora-arrow)" />
          </g>

          {/* Request */}
          <rect
            x="218"
            y="35"
            width="164"
            height="46"
            rx="23"
            fill="#302117"
            stroke="#C7803D"
            strokeWidth="1.7"
          />
          <text
            x="300"
            y="63"
            fill="#F8F4EF"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
          >
            Request
          </text>

          {/* Decision */}
          <path
            d="M300 119 L362 155 L300 191 L238 155 Z"
            fill="#151517"
            stroke="#45454C"
            strokeWidth="1.5"
          />
          <text
            x="300"
            y="160"
            fill="#F5F5F5"
            fontSize="14"
            fontWeight="600"
            textAnchor="middle"
          >
            Authed?
          </text>

          {/* Branch labels */}
          <rect x="209" y="211" width="40" height="19" rx="9" fill="#101012" />
          <text
            x="229"
            y="224"
            fill="#A7A7B0"
            fontSize="12"
            textAnchor="middle"
          >
            yes
          </text>

          <rect x="351" y="211" width="34" height="19" rx="9" fill="#101012" />
          <text
            x="368"
            y="224"
            fill="#A7A7B0"
            fontSize="12"
            textAnchor="middle"
          >
            no
          </text>

          {/* Destination nodes */}
          <rect
            x="63"
            y="252"
            width="214"
            height="54"
            rx="10"
            fill="#141416"
            stroke="#36363D"
            strokeWidth="1.4"
          />
          <text
            x="170"
            y="284"
            fill="#EEEEF0"
            fontSize="13"
            fontWeight="500"
            textAnchor="middle"
          >
            Load workspace
          </text>

          <rect
            x="323"
            y="252"
            width="214"
            height="54"
            rx="10"
            fill="#141416"
            stroke="#36363D"
            strokeWidth="1.4"
          />
          <text
            x="430"
            y="284"
            fill="#EEEEF0"
            fontSize="12.5"
            fontWeight="500"
            textAnchor="middle"
          >
            Redirect to sign in
          </text>
        </svg>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-2 pt-3 text-[10px] text-white/35">
          <span>Workspace canvas</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />4 connected
            nodes
          </span>
        </div>
      </div>
    </BrowserFrame>
  );
}

function DocsMockup() {
  return (
    <BrowserFrame>
      <div className="grid min-h-[300px] grid-cols-[34px_1fr] sm:min-h-[340px] sm:grid-cols-[48px_1fr]">
        <div className="border-r border-white/[0.06] bg-white/[0.015]" />
        <div className="p-5 sm:p-8">
          <div className="mb-6 h-1.5 w-16 rounded-full bg-primary/80" />
          <p className="mb-2 text-lg font-semibold tracking-tight text-white sm:text-xl">
            Product brief
          </p>
          <p className="mb-7 text-xs text-white/45">A plan, shaped together</p>

          <h4 className="mb-3 text-sm font-semibold text-white/90">Overview</h4>
          <div className="space-y-2">
            <div className="h-1.5 w-full rounded-full bg-white/[0.09]" />
            <div className="h-1.5 w-[88%] rounded-full bg-white/[0.08]" />
            <div className="h-1.5 w-[72%] rounded-full bg-white/[0.08]" />
          </div>

          <div className="mt-6 rounded-xl border border-primary/20 border-l-2 border-l-primary bg-primary/[0.07] p-4">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
              ✦ Agent summary
            </p>
            <p className="text-sm leading-6 text-white/75">
              The agent turns your ideas into a clear, actionable spec.
            </p>
          </div>

          <div className="mt-6 space-y-2">
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
            <div className="h-1.5 w-[78%] rounded-full bg-white/[0.06]" />
          </div>
        </div>
      </div>
    </BrowserFrame>
  );
}

function TeamBoardMockup() {
  const columns = [
    {
      title: "To do",
      cards: ["User research", "Draft brief"],
      count: "02",
    },
    {
      title: "In progress",
      cards: ["Design review"],
      count: "01",
    },
    {
      title: "Done",
      cards: ["Kickoff"],
      count: "01",
    },
  ];

  return (
    <BrowserFrame>
      <div className="min-h-[300px] p-4 sm:min-h-[340px] sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-white/90">
              Product launch
            </p>
            <p className="mt-1 text-[11px] text-white/40">Shared team board</p>
          </div>
          <span className="rounded-full border border-primary/20 bg-primary/[0.08] px-2.5 py-1 text-[10px] text-primary">
            Live
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {columns.map((column) => (
            <div key={column.title} className="min-w-0">
              <div className="mb-3 flex items-center justify-between gap-1">
                <span className="truncate text-[10px] font-medium text-white/60 sm:text-xs">
                  {column.title}
                </span>
                <span className="text-[10px] text-white/30">
                  {column.count}
                </span>
              </div>
              <div className="space-y-2">
                {column.cards.map((card, index) => (
                  <div
                    key={card}
                    className="rounded-lg border border-white/[0.09] bg-[#171719] p-2.5 sm:p-3"
                  >
                    <div
                      className={`mb-3 h-1 w-7 rounded-full ${
                        index === 0 && column.title === "In progress"
                          ? "bg-primary"
                          : "bg-white/20"
                      }`}
                    />
                    <p className="break-words text-[10px] leading-4 text-white/75 sm:text-xs">
                      {card}
                    </p>
                    <div className="mt-3 flex items-center gap-1">
                      <span className="h-4 w-4 rounded-full border border-white/10 bg-white/10" />
                      <span className="h-1 w-7 rounded-full bg-white/10" />
                    </div>
                  </div>
                ))}
                {column.cards.length === 1 && (
                  <div className="h-12 rounded-lg border border-dashed border-white/[0.08]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrowserFrame>
  );
}

function FeaturePreview({ id }: { id: string }) {
  if (id === "canvas") return <CanvasMockup />;
  if (id === "docs") return <DocsMockup />;
  return <TeamBoardMockup />;
}

export default function HomePage() {
  const { hero, audience, features, howItWorks, pricing, closing, footer } =
    landingContent;

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/* Hero */}
      <section className="topo-bg relative px-5 pb-20 pt-28 sm:px-8 sm:pb-28 sm:pt-36 lg:pb-32">
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-3 py-1.5 font-mono text-[11px] tracking-wide text-primary">
            <span className="text-[10px]">◆</span>
            {hero.eyebrow}
          </div>

          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
            {hero.headline}{" "}
            <span className="text-primary">{hero.highlightedName}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110 sm:w-auto"
            >
              {hero.primaryAction}
              <ArrowRight />
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex min-h-12 w-full items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-foreground transition hover:border-white/20 hover:bg-white/[0.06] sm:w-auto"
            >
              {hero.secondaryAction}
            </a>
          </div>

          <div className="survey-frame mx-auto mt-14 max-w-5xl sm:mt-20">
            <div className="scroll-tilt overflow-hidden rounded-2xl border border-white/10 bg-[#101012] shadow-[0_35px_100px_-45px_rgba(0,0,0,0.95)]">
              <video
                className="block aspect-video w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster="/videos/hero-poster.jpg"
                aria-label={hero.videoAlt}
              >
                <source src="/videos/hero.webm" type="video/webm" />
                <source src="/videos/hero.mp4" type="video/mp4" />
                {hero.videoFallback}
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Audience strip */}
      <section className="border-y border-white/[0.07] bg-white/[0.015] px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 md:flex-row md:justify-between">
          <p className="text-center text-xs text-muted-foreground md:text-left">
            {audience.label}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-7">
            {audience.groups.map((group) => (
              <span
                key={group}
                className="text-xs font-medium text-white/65 sm:text-sm"
              >
                {group}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-5 py-20 sm:px-8 sm:py-28 lg:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-16 max-w-3xl text-center sm:mb-24">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              One connected workspace
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {features.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              Move from the first idea to a shared plan, with an agent that
              works alongside your team.
            </p>
          </div>

          <div className="space-y-24 sm:space-y-32">
            {features.surfaces.map((surface, index) => (
              <article
                key={surface.id}
                className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
              >
                <div
                  className={
                    index % 2 === 1
                      ? "order-1 min-w-0 lg:order-2"
                      : "order-1 min-w-0"
                  }
                >
                  <FeatureIcon name={surface.icon} />
                  <h3 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {surface.name}
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
                    {surface.description}
                  </p>

                  <ul className="mt-7 space-y-4">
                    {surface.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex items-start gap-3 text-sm leading-6 text-white/85 sm:text-base"
                      >
                        <span className="mt-2 h-2 w-2 shrink-0 rotate-45 bg-primary" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div
                  className={
                    index % 2 === 1
                      ? "survey-frame order-2 min-w-0 lg:order-1"
                      : "survey-frame order-2 min-w-0"
                  }
                >
                  <FeaturePreview id={surface.id} />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-y border-white/[0.07] bg-white/[0.015] px-5 py-20 sm:px-8 sm:py-28 lg:py-32"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-20">
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              {howItWorks.eyebrow}
            </p>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl">
              {howItWorks.title}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              {howItWorks.description}
            </p>
          </div>

          <ol className="grid gap-5 md:grid-cols-3">
            {howItWorks.steps.map((step) => (
              <li
                key={step.number}
                className="relative rounded-2xl border border-white/[0.08] bg-background/70 p-6 sm:p-8"
              >
                <span className="font-mono text-xs tracking-[0.18em] text-primary">
                  {step.number}
                </span>
                <h3 className="mt-6 text-xl font-semibold tracking-tight sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto w-full max-w-6xl rounded-2xl border-2 border-white/15 bg-white/[0.03] px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            {pricing.eyebrow}
          </p>

          <h2 className="mb-6 text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            {pricing.title}
          </h2>

          <Tabs
            defaultValue="user"
            className="mx-auto w-full items-center gap-10"
          >
            <TabsList className="h-auto rounded-full border border-white/10 bg-white/3 p-1">
              <TabsTrigger value="user" className={PRICING_TAB}>
                Personal
              </TabsTrigger>
              <TabsTrigger value="organization" className={PRICING_TAB}>
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="user" className="w-full">
              <PricingTable for="user" />
            </TabsContent>

            <TabsContent
              value="organization"
              className="w-full [&_.grid]:!grid-cols-3"
            >
              <PricingTable for="organization" />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="topo-bg relative border-y border-white/[0.07] px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative mx-auto flex max-w-5xl flex-col items-center text-center">
          <Image
            src="/brand/mascot-dark.png"
            alt={closing.mascotAlt}
            width={128}
            height={128}
            className="mb-6 h-24 w-24 object-contain sm:h-28 sm:w-28"
          />
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            {closing.eyebrow}
          </p>
          <h2 className="text-balance text-3xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {closing.title}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
            {closing.description}
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-110"
          >
            {closing.action}
            <ArrowRight />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/[0.07] px-5 py-6 text-center text-xs text-muted-foreground sm:px-8">
        {footer}
      </footer>
    </main>
  );
}
