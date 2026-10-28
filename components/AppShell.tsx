"use client"
import { usePathname } from 'next/dist/client/components/navigation'
import React from 'react'
import SiteHeader from './SiteHeader';

const AppShell = ({children}: {children: React.ReactNode}) => {
    const pathname = usePathname();
    const isFullScreenRoute = pathname?.startsWith("/workspace/") || pathname?.startsWith("/shared/");
    if (isFullScreenRoute) {
        return <>{children}</>
    }

    return (
        <div>
            <SiteHeader />
            <div className="flex flex-1 flex-col pt-18">{children}</div>
        </div>
  )
}

export default AppShell
