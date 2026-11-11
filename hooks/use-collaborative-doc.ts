"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import { SupabaseYjsProvider } from "@/lib/supabase-yjs-provider";
import { fromBase64 } from "@/lib/base64";

export function useCollaborativeDoc(workspaceId: string, initialState: string | null) {
  const [collab, setCollab] = useState<{ doc: Y.Doc; provider: SupabaseYjsProvider } | null>(null);
 
  const [savedState] = useState(initialState);

  useEffect(() => {
    let doc = new Y.Doc();
    if (savedState) {
      try {
        Y.applyUpdate(doc, fromBase64(savedState));
      } catch (error) {
        console.error(
          "Could not load the saved collaborative document state; restoring from document content.",
          error,
        );
        doc.destroy();
        doc = new Y.Doc();
      }
    }
    const provider = new SupabaseYjsProvider(doc, workspaceId, () => setCollab({ doc, provider }));

    return () => {
      provider.destroy();
      doc.destroy();
    };
  }, [workspaceId, savedState]);

  return collab;
}