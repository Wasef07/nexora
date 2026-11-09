import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Block } from "@blocknote/core";
import type { TLEditorSnapshot } from "tldraw";
import { prisma } from "@/lib/prisma";
import {
  getEntitlements,
  workspaceOwnerId,
  workspaceOwnerSelect,
} from "@/lib/billing";
import { SharedWorkspaceViewer } from "./SharedWorkspaceViewer";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SharedWorkspacePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const workspace = await prisma.workspace.findUnique({
    where: { shareToken: token },
    select: {
      name: true,
      ...workspaceOwnerSelect,
      doc: { select: { content: true } },
      canvas: { select: { content: true } },
    },
  });

  if (!workspace) notFound();
  const { publicSharing } = await getEntitlements(workspaceOwnerId(workspace));
  if (!publicSharing) notFound();

  return (
    <SharedWorkspaceViewer
      workspaceName={workspace.name}
      docContent={(workspace.doc?.content as Block[] | null) ?? null}
      canvasSnapshot={workspace.canvas?.content as TLEditorSnapshot | null}
    />
  );
}
