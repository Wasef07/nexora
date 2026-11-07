"use client";
import { useWorkspaceEditors } from "@/components/WorkspaceEditorsContext";
import type { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import React, { useEffect } from "react";
import { outpostDarkTheme } from "@/lib/blacknote-theme";
import type { Prisma } from "@/lib/generated/prisma/client";
import { saveDocContent } from "@/actions/doc";


const SAVE_DEBOUNCE_MS = 1000;

type DocEditorProps = {
  workspaceId: string;
  initialContent: Block[] | null;
  initialState: string | null;
};

export const DocEditor = ({ workspaceId, initialContent }: DocEditorProps) => {
  const editor = useCreateBlockNote({
    initialContent: initialContent?.length ? initialContent : undefined,
  });

  const { setDocEditor } = useWorkspaceEditors();
  useEffect(() => {
    setDocEditor(editor);
    return () => setDocEditor(null);
  }, [editor, setDocEditor]);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const save = () => {
      timeout = undefined;
      const content = JSON.parse(JSON.stringify(editor.document)) as Prisma.InputJsonValue;
      saveDocContent(workspaceId, content);
    };

    const unsubscribe = editor.onChange(() => {
      clearTimeout(timeout);
      timeout = setTimeout(save, SAVE_DEBOUNCE_MS);
    });

    return () => {
      unsubscribe();
      if (timeout) {
        clearTimeout(timeout);
        save();
      }
    };
  }, [editor, workspaceId]);

  return (
    <div className="h-full overflow-y-auto pt-6">
      <BlockNoteView editor={editor} theme={outpostDarkTheme} />
    </div>
  );
};
