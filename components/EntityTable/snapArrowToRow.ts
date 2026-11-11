import {
  type Editor,
  type TLArrowBinding,
  type TLArrowShape,
  type TLShapeId,
} from "tldraw";
import {
  ENTITY_TABLE_TYPE,
  rowAnchorY,
  type EntityTableShape,
} from "./EntityTableShape";

export const ENTITY_TABLE_ROW_ID_META_KEY = "entityTableRowId";

const RELATIONSHIP_ARROW_META_KEY = "nexoraEntityTableRelationship";

function isEntityTable(shape: ReturnType<Editor["getShape"]>): shape is EntityTableShape {
  return shape?.type === ENTITY_TABLE_TYPE;
}

function getArrowBindings(editor: Editor, arrow: TLArrowShape) {
  const bindings = editor.getBindingsFromShape(arrow, "arrow");
  return {
    start: bindings.find((binding) => binding.props.terminal === "start"),
    end: bindings.find((binding) => binding.props.terminal === "end"),
  };
}

function getBoundRowIndex(binding: TLArrowBinding, table: EntityTableShape) {
  const rowId = binding.meta[ENTITY_TABLE_ROW_ID_META_KEY];
  if (typeof rowId === "string") {
    const index = table.props.rows.findIndex((row) => row.id === rowId);
    return index === -1 ? undefined : index;
  }

  if (table.props.rows.length === 0) return undefined;

  return table.props.rows.reduce(
    (closestIndex, _row, index) =>
      Math.abs(rowAnchorY(index, table.props.rows.length) - binding.props.normalizedAnchor.y) <
      Math.abs(
        rowAnchorY(closestIndex, table.props.rows.length) -
          binding.props.normalizedAnchor.y,
      )
        ? index
        : closestIndex,
    0,
  );
}

function updateBindingAnchor(
  editor: Editor,
  binding: TLArrowBinding,
  table: EntityTableShape,
  rowIndex: number,
  x: number,
) {
  const normalizedAnchor = {
    x,
    y: rowAnchorY(rowIndex, table.props.rows.length),
  };
  const rowId = table.props.rows[rowIndex].id;

  if (
    binding.props.normalizedAnchor.x === normalizedAnchor.x &&
    binding.props.normalizedAnchor.y === normalizedAnchor.y &&
    binding.props.isPrecise &&
    binding.props.snap === "edge-point" &&
    binding.meta[ENTITY_TABLE_ROW_ID_META_KEY] === rowId
  ) {
    return;
  }

  editor.updateBinding({
    id: binding.id,
    type: "arrow",
    props: {
      normalizedAnchor,
      isPrecise: true,
      snap: "edge-point",
    },
    meta: {
      ...binding.meta,
      [ENTITY_TABLE_ROW_ID_META_KEY]: rowId,
    },
  });
}

function setRelationshipArrowStyle(editor: Editor, arrow: TLArrowShape) {
  if (arrow.meta[RELATIONSHIP_ARROW_META_KEY] === true) return;

  editor.updateShape({
    id: arrow.id,
    type: "arrow",
    props: {
      kind: "elbow",
      elbowMidPoint: 0.5,
      size: "s",
      color: "grey",
      arrowheadStart: "none",
      arrowheadEnd: "arrow",
    },
    meta: {
      ...arrow.meta,
      [RELATIONSHIP_ARROW_META_KEY]: true,
    },
  });
}

export function updateEntityTableRelationshipArrow(
  editor: Editor,
  arrowId: TLShapeId,
) {
  const arrow = editor.getShape<TLArrowShape>(arrowId);
  if (!arrow || arrow.type !== "arrow") return false;

  const { start, end } = getArrowBindings(editor, arrow);
  if (!start || !end) return false;

  const sourceTable = editor.getShape(start.toId);
  const targetTable = editor.getShape(end.toId);
  if (!isEntityTable(sourceTable) || !isEntityTable(targetTable)) return false;

  const sourceRowIndex = getBoundRowIndex(start, sourceTable);
  const targetRowIndex = getBoundRowIndex(end, targetTable);
  if (sourceRowIndex === undefined || targetRowIndex === undefined) {
    editor.deleteShape(arrow);
    return true;
  }

  const sourceBounds = editor.getShapePageBounds(sourceTable);
  const targetBounds = editor.getShapePageBounds(targetTable);
  if (!sourceBounds || !targetBounds) return false;

  const overlapsHorizontally =
    sourceBounds.x < targetBounds.x + targetBounds.w &&
    targetBounds.x < sourceBounds.x + sourceBounds.w;

  let sourceX: number;
  let targetX: number;
  if (overlapsHorizontally) {
    sourceX = 1;
    targetX = 1;
  } else if (targetBounds.center.x > sourceBounds.center.x) {
    sourceX = 1;
    targetX = 0;
  } else {
    sourceX = 0;
    targetX = 1;
  }

  updateBindingAnchor(editor, start, sourceTable, sourceRowIndex, sourceX);
  updateBindingAnchor(editor, end, targetTable, targetRowIndex, targetX);
  setRelationshipArrowStyle(editor, arrow);
  return true;
}

export function snapArrowBindingToRow(
  editor: Editor,
  binding: TLArrowBinding,
) {
  const arrow = editor.getShape<TLArrowShape>(binding.fromId);
  if (!arrow || arrow.type !== "arrow") return;

  updateEntityTableRelationshipArrow(editor, arrow.id);
}
