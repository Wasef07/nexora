import { T, type TLShape } from "tldraw";

export const ENTITY_TABLE_TYPE = "entity-table";

export type EntityTableRow = {
  id: string;
  name: string;
  dataType: string;
  isPK: boolean;
  isFK: boolean;
};

export interface EntityTableShapeProps {
  w: number;
  h: number;
  tableName: string;
  rows: EntityTableRow[];
}

declare module "tldraw" {
  interface TLGlobalShapePropsMap {
    [ENTITY_TABLE_TYPE]: EntityTableShapeProps;
  }
}

export type EntityTableShape = TLShape<typeof ENTITY_TABLE_TYPE>;

export const entityTableRowProps = T.object({
  id: T.string,
  name: T.string,
  dataType: T.string,
  isPK: T.boolean,
  isFK: T.boolean,
});

export const entityTableProps = {
  w: T.number,
  h: T.number,
  tableName: T.string,
  rows: T.arrayOf(entityTableRowProps),
};

export const ENTITY_TABLE_HEADER_HEIGHT = 38;
export const ENTITY_TABLE_ROW_HEIGHT = 34;
export const ENTITY_TABLE_MIN_WIDTH = 220;
export const ENTITY_TABLE_WIDTH = 300;

export const DEFAULT_ENTITY_TABLE_ROWS: EntityTableRow[] = [
  { id: "id", name: "id", dataType: "uuid", isPK: true, isFK: false },
  {
    id: "created_at",
    name: "created_at",
    dataType: "timestamptz",
    isPK: false,
    isFK: false,
  },
];

export function getEntityTableHeight(rowCount: number) {
  return ENTITY_TABLE_HEADER_HEIGHT + rowCount * ENTITY_TABLE_ROW_HEIGHT;
}
