import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { OrganizationSwitcher, Show, SignInButton, SignUpButton, useAuth, UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/dist/client/components/navigation';


const SiteHeader = () => {
    const pathname = usePathname();
    const {isSignedIn} = useAuth(); 
    const isLandingPage = pathname === '/';
  return (
    <header className="fixed inset-x-0 top-0 z-20 flex h-18 items-center justify-between border-b border-white/6 bg-background/70 px-6 backdrop-blur-md md:px-10">
    <Link
      href={isSignedIn && !isLandingPage ? "/dashboard" : "/"}
      className="flex items-center"
    >
    <Image
        src="/brand/nexora-logo-navbar-dark.png"
        alt="Nexora"
        width={200}
        height={30}
        className="h-6 w-auto object-contain"
        priority
    />
    </Link>

    {isLandingPage && (
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
            <Link href="#product" className="transition-colors hover:text-foreground">
                Product
            </Link>
            <Link href="#how-it-works" className="transition-colors hover:text-foreground">
                How It Works
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
                Pricing
            </Link>
        </nav>
    )}
    <div className="flex items-center gap-4">
        <Show when="signed-out">
            <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                    Sign In
                </Button>
            </SignInButton>

            <SignUpButton mode="modal">
                <Button size="sm">Get Started</Button>
            </SignUpButton>
        </Show>
        
        <Show when="signed-in">
            <OrganizationSwitcher 
                afterCreateOrganizationUrl="/dashboard"
                afterSelectOrganizationUrl="/dashboard" 
            />
            {isLandingPage && (
                <Button asChild size="sm">
                    <Link href="/dashboard">Dashboard</Link>
                </Button>
            )}
        </Show>

        <UserButton/>
    </div>
  </header>
  )
}

export default SiteHeader
