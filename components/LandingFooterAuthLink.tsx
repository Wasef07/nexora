"use client";

import { Show, SignInButton } from "@clerk/nextjs";
import Link from "next/link";

export function LandingFooterAuthLink({
  className,
}: {
  className: string;
}) {
  return (
    <>
      <Show when="signed-in">
        <Link className={className} href="/dashboard">
          Dashboard
        </Link>
      </Show>
      <Show when="signed-out">
        <SignInButton
          mode="modal"
          forceRedirectUrl="/dashboard"
          signUpForceRedirectUrl="/dashboard"
        >
          <button type="button" className={className}>
            Start building
          </button>
        </SignInButton>
      </Show>
    </>
  );
}
