
"use server";

import { canAccessWorkspace } from "@/lib/workspace-access";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

export async function saveDocContent(
  workspaceId: string,
  content: Prisma.InputJsonValue
) {
  if (!(await canAccessWorkspace(workspaceId))) {
    throw new Error("Workspace not found");
  }

  await prisma.doc.update({
    where: { workspaceId },
    data: { content },
  });

  revalidatePath(`/workspace/${workspaceId}`);
}
