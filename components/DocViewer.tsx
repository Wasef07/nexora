"use client";

import type { Block } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { nexoraDarkTheme } from "@/lib/blacknote-theme";

export function DocViewer({ content }: { content: Block[] | null }) {
  const editor = useCreateBlockNote({
    initialContent: content ?? undefined,
  });

  return <BlockNoteView editor={editor} theme={nexoraDarkTheme} editable={false} />;
}
