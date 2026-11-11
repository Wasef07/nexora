"use server";

import * as Y from "yjs";
import { canAccessWorkspace } from "@/lib/workspace-access";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";

export async function saveDocContent(
  workspaceId: string,
  yjsState: string,
  content: Prisma.InputJsonValue
) {
  if (!(await canAccessWorkspace(workspaceId))) {
    throw new Error("Workspace not found");
  }

  const incoming = Buffer.from(yjsState, "base64");

  if (!incoming.length) {
    throw new Error("Invalid empty Yjs state");
  }

  try {
    Y.decodeUpdate(new Uint8Array(incoming));
  } catch {
    throw new Error("Invalid incoming Yjs update");
  }

  await prisma.$transaction(async (tx) => {
    const [row] = await tx.$queryRaw<
      { yjsState: Uint8Array | null }[]
    >`
      SELECT "yjsState"
      FROM "Doc"
      WHERE "workspaceId" = ${workspaceId}
      FOR UPDATE
    `;

    let merged = incoming;

    if (row?.yjsState?.length) {
      const existing = new Uint8Array(row.yjsState);
      let existingIsValid = true;
      try {
        Y.decodeUpdate(existing);
      } catch (error) {
        console.error(
          `Stored Yjs state for workspace ${workspaceId} is invalid; replacing it with the incoming state.`,
          error,
        );
        existingIsValid = false;
      }

      if (existingIsValid) {
        merged = Buffer.from(
          Y.mergeUpdates([existing, new Uint8Array(incoming)]),
        );
      }
    }

    await tx.doc.update({
      where: { workspaceId },
      data: {
        yjsState: Uint8Array.from(merged),
        content,
      },
    });
  });
}