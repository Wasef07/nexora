"use server";
import { FREE_WORKSPACE_LIMIT, LimitError } from "@/lib/plan-limits";

import { checkUser } from "./check-user";
import { scopeWhere } from "@/lib/workspace-scope";
import { getEntitlements, workspaceOwnerSelect } from "@/lib/billing";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { canAccessWorkspace } from "@/lib/workspace-access";
import { WorkspaceStatus } from "@/lib/generated/prisma/enums";

function revalidateWorkspaceLists() {
  revalidatePath("/dashboard");
  revalidatePath("/workspaces");
}

export async function createWorkspace(
  name: string,
  description?: string
): Promise<{ workspace: { id: string } } | { limit: LimitError }> {
  const user = await checkUser();
  if (!user) throw new Error("Not signed in");

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Workspace name is required");

  // Belongs to whichever org is active; no active org means a personal workspace.
  const { orgId } = await auth();
  const scope = scopeWhere(orgId, user.id);

  const { unlimitedWorkspaces } = await getEntitlements(orgId ?? user.clerkId);
  if (!unlimitedWorkspaces && (await prisma.workspace.count({ where: scope })) >= FREE_WORKSPACE_LIMIT) {
    return { limit: "workspaces" };
  }

  // New workspaces land at the top of the Planning column.
  const top = await prisma.workspace.findFirst({
    where: { status: "PLANNING", ...scope },
    orderBy: { position: "asc" },
    select: { position: true },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: trimmedName,
      description: description?.trim() || null,
      creatorId: user.id,
      clerkOrgId: orgId ?? null,
      position: top ? top.position - 1 : 0,
      doc: { create: {} },
      canvas: { create: {} },
    },
  });

  revalidateWorkspaceLists();
  return { workspace: { id: workspace.id } };
}

export async function updateWorkspace(workspaceId: string, name: string, description?: string) {
  if (!(await canAccessWorkspace(workspaceId))) throw new Error("Workspace not found");

  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Workspace name is required");

  const workspace = await prisma.workspace.update({
    where: { id: workspaceId },
    data: {
      name: trimmedName,
      ...(description !== undefined && { description: description.trim() || null }),
    },
  });

  revalidateWorkspaceLists();
  revalidatePath(`/workspace/${workspaceId}`);
  return workspace;
}

export async function deleteWorkspace(workspaceId: string) {
  const { userId, orgId, orgRole } = await auth();
  if (!userId || !(await canAccessWorkspace(workspaceId))) throw new Error("Workspace not found");

  const workspace = await prisma.workspace.findUniqueOrThrow({
    where: { id: workspaceId },
    select: workspaceOwnerSelect,
  });
  const isCreator = workspace.creator.clerkId === userId;
  // orgRole describes the active org only, so it counts only for a workspace in that org.
  const isOrgAdmin = orgRole === "org:admin" && workspace.clerkOrgId === orgId;
  if (!isCreator && !isOrgAdmin) {
    throw new Error("Only the creator or an org admin can delete this workspace");
  }

  // Doc and canvas cascade-delete with the workspace; its agent prompts stay, so usage can't reset.
  await prisma.workspace.delete({ where: { id: workspaceId } });
  revalidateWorkspaceLists();
}

export async function moveWorkspace(workspaceId: string, status: WorkspaceStatus, position: number) {
  if (!Object.values(WorkspaceStatus).includes(status) || !Number.isFinite(position)) {
    throw new Error("Invalid move");
  }
  if (!(await canAccessWorkspace(workspaceId))) throw new Error("Workspace not found");

  await prisma.workspace.update({
    where: { id: workspaceId },
    data: { status, position },
  });
}