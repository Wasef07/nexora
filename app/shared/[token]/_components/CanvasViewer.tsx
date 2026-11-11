"use client";

import { useMemo } from "react";
import {
  Tldraw,
  atom,
  createTLStore,
  defaultBindingUtils,
  defaultShapeUtils,
  type TLEditorSnapshot,
} from "tldraw";
import { entityTableShapeUtils } from "@/components/EntityTable";
import "tldraw/tldraw.css";

export function CanvasViewer({
  snapshot,
}: {
  snapshot: TLEditorSnapshot | null;
}) {
  const store = useMemo(
    () =>
      createTLStore({
        snapshot: snapshot ?? undefined,
        shapeUtils: [...defaultShapeUtils, ...entityTableShapeUtils],
        bindingUtils: defaultBindingUtils,
        collaboration: {
          mode: atom("shared-mode", "readonly"),
          status: atom("shared-status", "offline"),
        },
      }),
    [snapshot],
  );

  return (
    <div className="shared-canvas-viewer h-full min-h-0 min-w-0 overflow-hidden [&_.tlui-offline-indicator]:hidden [&_.tlui-page-menu__create-button]:hidden">
      <Tldraw
        store={store}
        onMount={(editor) => {
          editor.zoomToFit();
        }}
        shapeUtils={entityTableShapeUtils}
        colorScheme="dark"
        licenseKey={process.env.NEXT_PUBLIC_TLDRAW_LICENSE_KEY}
      />
    </div>
  );
}
