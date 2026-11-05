// Fields every workspace card needs, including what withLastActivity reads.
export const workspaceCardSelect = {
  id: true,
  name: true,
  description: true,
  status: true,
  updatedAt: true,
  creator: { select: { name: true, imageUrl: true } },
  doc: { select: { updatedAt: true } },
  canvas: { select: { updatedAt: true } },
} as const;

type Dated = { updatedAt: Date } | null;

// A workspace's own updatedAt only changes on rename or move, so real activity also counts
// edits to its doc and canvas.
export function withLastActivity<
  T extends { updatedAt: Date; doc: Dated; canvas: Dated },
>(workspace: T) {
  const times = [
    workspace.updatedAt,
    workspace.doc?.updatedAt,
    workspace.canvas?.updatedAt,
  ];

  return {
    ...workspace,
    lastActivity: new Date(
      Math.max(...times.map((t) => t?.getTime() ?? 0)),
    ),
  };
}