import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/workspace(.*)",
  "/workspaces(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const {userId} = await auth();
  if(!userId && isProtectedRoute(req)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
});


export const config = {
  matcher: [
    
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    
    '/__clerk/:path*',
   
    '/(api|trpc)(.*)',
  ],
};