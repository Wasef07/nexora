"use client";

import { useWorkspaceEditors } from "@/components/WorkspaceEditorsContext";
import { colorForUser } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import React, { useMemo, useRef } from "react";
import {
  atom,
  createUserId,
  DefaultToolbar,
  DefaultToolbarContent,
  type TLEditorSnapshot,
  UserRecordType,
  type TLComponents,
  createTLCurrentUser,
  computed,
  getUserPreferences,
  type Editor,
  Tldraw,
} from "tldraw";
import { useSyncDemo } from "@tldraw/sync";
import { Prisma } from "@/lib/generated/prisma/client";
import { saveCanvasContent } from "@/actions/canvas";
import "tldraw/tldraw.css";

const SAVE_DEBOUNCE_MS = 1000;

const components: TLComponents = {
  StylePanel: null,
  PageMenu: null,
  MainMenu: null,
  Toolbar: () => (
    <DefaultToolbar orientation="vertical">
      {/* TODO: Add table button (ERD step) */}
      <DefaultToolbarContent />
    </DefaultToolbar>
  ),
};

const CanvasEditor = ({
  workspaceId,
  initialSnapshot,
}: {
  workspaceId: string;
  initialSnapshot: TLEditorSnapshot | null;
}) => {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setCanvasEditor } = useWorkspaceEditors();
  const { user } = useUser();

  const userId = user?.id;
  const userName = user?.fullName ?? user?.username ?? "Anonymous";
  const userImageUrl = user?.imageUrl ?? "";

  const users = useMemo(() => {
    if (!userId) return undefined;

    return {
      currentUser: atom(
        "currentUser",
        UserRecordType.create({
          id: createUserId(userId),
          name: userName,
          color: colorForUser(userId),
          imageUrl: userImageUrl,
        }),
      ),
    };
  }, [userId, userName, userImageUrl]);

  const currentUser = useMemo(() => {
    if (!userId) return undefined;
    return createTLCurrentUser({
      userPreferences: computed("clerkUserPreferences", () => ({
        ...getUserPreferences(),
        id: userId,
        name: userName,
        color: colorForUser(userId),
      })),
    });
  }, [userId, userName]);

  const store = useSyncDemo({ roomId: `outpost-${workspaceId}`, users });

  const handleMount = (editor: Editor) => {
    setCanvasEditor(editor);
    // Seed from Postgres only when the room is empty, so a joining user doesn't overwrite
    // what others have already drawn.
    if (initialSnapshot && editor.getCurrentPageShapeIds().size === 0) {
      editor.loadSnapshot(initialSnapshot);
    }

    editor.store.listen(
      () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          // getSnapshot() carries non-plain internals (schema is a class instance, not JSON) that
          // occasionally fail to cross the Server Action boundary as "opaque temporary reference"
          // errors — round-tripping through JSON strips those and leaves genuinely plain data.
          const plainSnapshot = JSON.parse(
            JSON.stringify(editor.getSnapshot()),
          ) as Prisma.InputJsonValue;
          saveCanvasContent(workspaceId, plainSnapshot);
        }, SAVE_DEBOUNCE_MS);
      },
      { source: "user", scope: "document" },
    );

    // Arrows drawn onto an ERD table snap to the nearest row (see snapArrowToRow.ts).
    // editor.store.listen(
    //   (entry) => {
    //     for (const record of Object.values(entry.changes.added)) {
    //       if (record.typeName === "binding" && record.type === "arrow") {
    //         snapArrowBindingToRow(editor, record);
    //       }
    //     }
    //   },
    //   { source: "user", scope: "all" },
    // );

    // Clear it on unmount (e.g. switching to the Document view) so nothing keeps a disposed editor.
    return () => setCanvasEditor(null);
  };

  return (
    <div className="isolate h-full [&_.tlui-main-toolbar--vertical]:top-4!">
      <Tldraw
        store={store}
        user={currentUser}
        onMount={handleMount}
        components={components}
        colorScheme="dark"
        // shapeUtils={shapeUtils}
        // licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
      />
    </div>
  );
};

export default CanvasEditor;
