"use client";

import Image from "next/image";
import Link from "next/link";
import type { Block } from "@blocknote/core";
import type { TLEditorSnapshot } from "tldraw";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { DocViewer } from "@/components/DocEditorLoader";
import { CanvasViewer } from "./_components/CanvasViewer";

export function SharedWorkspaceViewer({
  workspaceName,
  docContent,
  canvasSnapshot,
}: {
  workspaceName: string;
  docContent: Block[] | null;
  canvasSnapshot: TLEditorSnapshot | null;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex h-14 shrink-0 items-center border-b border-white/6 px-5">
        <Link
          href="/"
          aria-label="Nexora home"
          className="mr-3 flex size-8 shrink-0 items-center justify-center rounded-md transition-opacity hover:opacity-80"
        >
          <Image
            src="/brand/mascot-dark.png"
            alt=""
            width={24}
            height={24}
            className="size-6"
          />
        </Link>
        <h1 className="truncate text-sm font-medium">{workspaceName}</h1>
        <span className="ml-auto rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted-foreground">
          View only
        </span>
      </header>
      <ResizablePanelGroup
        orientation="horizontal"
        className="min-h-0 min-w-0 flex-1 overflow-hidden"
      >
        <ResizablePanel
          defaultSize={50}
          minSize={20}
          className="min-h-0 min-w-0 overflow-auto"
        >
          <DocViewer content={docContent} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={50}
          minSize={20}
          className="min-h-0 min-w-0 overflow-hidden"
        >
          <CanvasViewer snapshot={canvasSnapshot} />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
