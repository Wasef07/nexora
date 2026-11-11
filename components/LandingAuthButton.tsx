"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type LandingAuthButtonProps = {
  label: string;
  className: string;
};

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

export function LandingAuthButton({ label, className }: LandingAuthButtonProps) {
  return (
    <>
      <Show when="signed-in">
        <Button asChild className={className}>
          <Link href="/dashboard">
            {label}
            <ArrowRight />
          </Link>
        </Button>
      </Show>
      <Show when="signed-out">
        <SignInButton
          mode="modal"
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
        >
          <Button className={className}>
            {label}
            <ArrowRight />
          </Button>
        </SignInButton>
      </Show>
    </>
  );
}
