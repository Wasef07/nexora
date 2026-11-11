"use client";

import { Table2 } from "lucide-react";
import { TldrawUiButton, useEditor } from "tldraw";
import {
  DEFAULT_ENTITY_TABLE_ROWS,
  ENTITY_TABLE_TYPE,
  TABLE_WIDTH,
  getTableHeight,
} from "./EntityTableShape";

export function AddEntityTableButton() {
  const editor = useEditor();

  const addTable = () => {
    const center = editor.getViewportPageBounds().center;
    const height = getTableHeight(DEFAULT_ENTITY_TABLE_ROWS.length);
    editor.createShape({
      type: ENTITY_TABLE_TYPE,
      x: center.x - TABLE_WIDTH / 2,
      y: center.y - height / 2,
      props: {
        w: TABLE_WIDTH,
        h: height,
        tableName: "new_table",
        rows: DEFAULT_ENTITY_TABLE_ROWS.map((row) => ({ ...row })),
      },
    });
  };

  return (
    <TldrawUiButton type="tool" title="Add table" onClick={addTable}>
      <Table2 />
    </TldrawUiButton>
  );
}
