import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { LandingFooterAuthLink } from "@/components/LandingFooterAuthLink";

const linkClassName =
  "rounded-sm text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const columnTitleClassName = "mb-3 text-xs font-medium text-foreground";

export async function LandingFooter() {
  return (
    <footer className="border-t border-primary/45 bg-background px-5 sm:px-8">
      <div className="mx-auto max-w-6xl py-9">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/mascot-dark.png"
                alt=""
                width={64}
                height={64}
                sizes="32px"
                className="size-8 object-contain"
              />
              <Image
                src="/brand/nexora-logo-navbar-dark.png"
                alt="NEXORA"
                width={200}
                height={30}
                className="h-5 w-auto object-contain"
              />
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your AI workspace for intelligent agents and automated workflows.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 md:grid-cols-3"
          >
            <div>
              <h2 className={columnTitleClassName}>Product</h2>
              <ul className="space-y-2">
                <li>
                  <Link className={linkClassName} href="/#product-canvas">
                    Canvas
                  </Link>
                </li>
                <li>
                  <Link className={linkClassName} href="/#product-docs">
                    Docs
                  </Link>
                </li>
                <li>
                  <Link className={linkClassName} href="/#product-team-board">
                    Team board
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className={columnTitleClassName}>Get started</h2>
              <ul className="space-y-2">
                <li>
                  <LandingFooterAuthLink className={linkClassName} />
                </li>
              </ul>
            </div>

            <div>
              <h2 className={columnTitleClassName}>Connect</h2>
              <ul className="space-y-2">
                <li>
                  <a
                    className={linkClassName}
                    href="https://github.com/Wasef07"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    className={linkClassName}
                    href="https://www.linkedin.com/in/sk-wasef-mostafa/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Nexora. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with
            <Heart
              aria-hidden="true"
              className="size-[13px] fill-current text-destructive"
            />
            by
            <a
              className="rounded-sm font-medium text-foreground underline decoration-foreground/40 underline-offset-4 transition-colors duration-150 hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              href="https://www.linkedin.com/in/sk-wasef-mostafa/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Raze
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
