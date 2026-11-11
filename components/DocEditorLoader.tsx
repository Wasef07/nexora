"use client";

import dynamic from "next/dynamic";

export const DocEditor = dynamic(() => import("@/components/DocEditor").then((m) => m.DocEditor), {
  ssr: false,
});

export const DocViewer = dynamic(
  () => import("@/components/DocViewer").then((m) => m.DocViewer),
  { ssr: false },
);