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
import {
  AddEntityTableButton,
  ENTITY_TABLE_TYPE,
  entityTableShapeUtils,
  snapArrowBindingToRow,
  updateEntityTableRelationshipArrow,
} from "@/components/EntityTable";
import "tldraw/tldraw.css";

const SAVE_DEBOUNCE_MS = 1000;

const components: TLComponents = {
  StylePanel: null,
  PageMenu: null,
  MainMenu: null,
  Toolbar: () => (
    <DefaultToolbar orientation="vertical">
      <AddEntityTableButton />
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

  const store = useSyncDemo({
    roomId: `nexora-${workspaceId}`,
    users,
    shapeUtils: entityTableShapeUtils,
  });

  const handleMount = (editor: Editor) => {
    setCanvasEditor(editor);
    if (initialSnapshot && editor.getCurrentPageShapeIds().size === 0) {
      editor.loadSnapshot(initialSnapshot);
    }

    editor.store.listen(
      () => {
        if (saveTimeout.current) clearTimeout(saveTimeout.current);
        saveTimeout.current = setTimeout(() => {
          const plainSnapshot = JSON.parse(
            JSON.stringify(editor.getSnapshot()),
          ) as Prisma.InputJsonValue;
          saveCanvasContent(workspaceId, plainSnapshot);
        }, SAVE_DEBOUNCE_MS);
      },
      { source: "user", scope: "document" },
    );

    const unlisten = editor.store.listen(
      (entry) => {
        for (const record of Object.values(entry.changes.added)) {
          if (record.typeName === "binding" && record.type === "arrow") {
            snapArrowBindingToRow(editor, record);
          }
        }

        for (const [, next] of Object.values(entry.changes.updated)) {
          if (next.typeName === "binding" && next.type === "arrow") {
            snapArrowBindingToRow(editor, next);
          }
        }

        for (const [previous, next] of Object.values(entry.changes.updated)) {
          if (
            previous.typeName !== "shape" ||
            next.typeName !== "shape" ||
            next.type !== ENTITY_TABLE_TYPE
          ) {
            continue;
          }

          for (const binding of editor.getBindingsToShape(next.id, "arrow")) {
            snapArrowBindingToRow(editor, binding);
          }
        }
      },
      { source: "all", scope: "all" },
    );

    for (const shape of editor.getCurrentPageShapes()) {
      if (shape.type === "arrow") {
        updateEntityTableRelationshipArrow(editor, shape.id);
      }
    }

    return () => {
      unlisten();
      setCanvasEditor(null);
    };
  };

  return (
    <div className="isolate h-full [&_.tlui-main-toolbar--vertical]:top-4!">
      <Tldraw
        store={store}
        user={currentUser}
        onMount={handleMount}
        components={components}
        colorScheme="dark"
        shapeUtils={entityTableShapeUtils}
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
      />
    </div>
  );
};

export default CanvasEditor;
