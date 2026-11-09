import type { Editor, TLArrowBinding } from "tldraw";
import {
  ENTITY_TABLE_HEADER_HEIGHT,
  ENTITY_TABLE_ROW_HEIGHT,
  ENTITY_TABLE_TYPE,
  rowAnchorY,
  type EntityTableShape,
} from "./EntityTableShape";

const ROW_ID_META_KEY = "entityTableRowId";

export function snapArrowBindingToRow(
  editor: Editor,
  binding: TLArrowBinding,
  table?: EntityTableShape,
) {
  const target =
    table ?? editor.getShape<EntityTableShape>(binding.toId);
  if (!target || target.type !== ENTITY_TABLE_TYPE) return;

  const rows = target.props.rows;
  const rowId =
    typeof binding.meta[ROW_ID_META_KEY] === "string"
      ? binding.meta[ROW_ID_META_KEY]
      : undefined;
  let rowIndex = rowId ? rows.findIndex((row) => row.id === rowId) : -1;

  if (rowIndex < 0 && rows.length > 0) {
    const localY =
      binding.props.normalizedAnchor.y * target.props.h;
    rowIndex = Math.max(
      0,
      Math.min(
        rows.length - 1,
        Math.round(
          (localY - ENTITY_TABLE_HEADER_HEIGHT - ENTITY_TABLE_ROW_HEIGHT / 2) /
            ENTITY_TABLE_ROW_HEIGHT,
        ),
      ),
    );
  }

  const row = rows[rowIndex];
  const normalizedY = row
    ? rowAnchorY(rowIndex, rows.length)
    : ENTITY_TABLE_HEADER_HEIGHT / 2 / target.props.h;

  editor.updateBinding({
    id: binding.id,
    type: "arrow",
    props: {
      normalizedAnchor: {
        x: binding.props.normalizedAnchor.x < 0.5 ? 0 : 1,
        y: normalizedY,
      },
      isPrecise: true,
    },
    meta: row ? { ...binding.meta, [ROW_ID_META_KEY]: row.id } : binding.meta,
  });
}
