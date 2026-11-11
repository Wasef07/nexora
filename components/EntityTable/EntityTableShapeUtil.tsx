"use client";

import {
  BaseBoxShapeUtil,
  HTMLContainer,
  Rectangle2d,
  Vec,
  type TLHandle,
  type TLHandleDragInfo,
} from "tldraw";
import {
  EntityTableComponent,
} from "./EntityTableComponent";
import {
  DEFAULT_ENTITY_TABLE_ROWS,
  ENTITY_TABLE_MIN_WIDTH,
  ENTITY_TABLE_TYPE,
  TABLE_WIDTH,
  entityTableProps,
  getTableHeight,
  type EntityTableShape,
} from "./EntityTableShape";

export class EntityTableShapeUtil extends BaseBoxShapeUtil<EntityTableShape> {
  static override type = ENTITY_TABLE_TYPE;
  static override props = entityTableProps;

  getDefaultProps(): EntityTableShape["props"] {
    return {
      w: TABLE_WIDTH,
      h: getTableHeight(DEFAULT_ENTITY_TABLE_ROWS.length),
      tableName: "new_table",
      rows: DEFAULT_ENTITY_TABLE_ROWS.map((row) => ({ ...row })),
    };
  }

  override getGeometry(shape: EntityTableShape) {
    return new Rectangle2d({
      width: shape.props.w,
      height: getTableHeight(shape.props.rows.length),
      isFilled: true,
    });
  }

  override getIndicatorPath(shape: EntityTableShape) {
    const path = new Path2D();
    path.rect(
      0,
      0,
      shape.props.w,
      getTableHeight(shape.props.rows.length),
    );
    return path;
  }

  override onBeforeCreate(shape: EntityTableShape) {
    return {
      ...shape,
      props: {
        ...shape.props,
        h: getTableHeight(shape.props.rows.length),
      },
    };
  }

  override onBeforeUpdate(_previous: EntityTableShape, next: EntityTableShape) {
    const h = getTableHeight(next.props.rows.length);
    if (next.props.h === h) return;
    return { ...next, props: { ...next.props, h } };
  }

  override canBind() {
    return true;
  }

  override hideResizeHandles() {
    return true;
  }

  override getHandles(shape: EntityTableShape): TLHandle[] {
    return [
      {
        id: "left",
        label: "Resize table width",
        type: "vertex",
        index: "a1" as TLHandle["index"],
        x: 0,
        y: shape.props.h / 2,
      },
      {
        id: "right",
        label: "Resize table width",
        type: "vertex",
        index: "a2" as TLHandle["index"],
        x: shape.props.w,
        y: shape.props.h / 2,
      },
    ];
  }

  override onHandleDrag(
    shape: EntityTableShape,
    { handle }: TLHandleDragInfo<EntityTableShape>,
  ) {
    if (handle.id === "left") {
      const delta = Math.max(
        ENTITY_TABLE_MIN_WIDTH - shape.props.w,
        Math.min(handle.x, shape.props.w - ENTITY_TABLE_MIN_WIDTH),
      );
      const offset = Vec.Rot(new Vec(delta, 0), shape.rotation);
      return {
        ...shape,
        x: shape.x + offset.x,
        y: shape.y + offset.y,
        props: {
          ...shape.props,
          w: shape.props.w - delta,
          h: getTableHeight(shape.props.rows.length),
        },
      };
    }

    return {
      ...shape,
      props: {
        ...shape.props,
        w: Math.max(ENTITY_TABLE_MIN_WIDTH, handle.x),
        h: getTableHeight(shape.props.rows.length),
      },
    };
  }

  override component(shape: EntityTableShape) {
    return (
      <HTMLContainer>
        <EntityTableComponent shape={shape} editor={this.editor} />
      </HTMLContainer>
    );
  }
}

export const entityTableShapeUtils = [EntityTableShapeUtil];
