"use client";

import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Editor } from "tldraw";
import {
  ENTITY_TABLE_TYPE,
  ENTITY_TABLE_HEADER_HEIGHT,
  ENTITY_TABLE_ROW_HEIGHT,
  getEntityTableHeight,
  type EntityTableRow,
  type EntityTableShape,
} from "./EntityTableShape";

type EntityTableEditRequest = (rowId: string | null) => void;
const editRequests = new WeakMap<Editor, Map<string, EntityTableEditRequest>>();

export function registerEntityTableEditRequest(
  editor: Editor,
  shapeId: EntityTableShape["id"],
  requestEdit: EntityTableEditRequest,
) {
  let shapeRequests = editRequests.get(editor);
  if (!shapeRequests) {
    shapeRequests = new Map();
    editRequests.set(editor, shapeRequests);
  }
  shapeRequests.set(shapeId, requestEdit);

  return () => {
    shapeRequests?.delete(shapeId);
    if (shapeRequests?.size === 0) editRequests.delete(editor);
  };
}

export function requestEntityTableEdit(
  editor: Editor,
  shape: EntityTableShape,
) {
  const point = editor.getPointInShapeSpace(
    shape,
    editor.inputs.getCurrentPagePoint(),
  );
  const rowIndex = Math.floor(
    (point.y - ENTITY_TABLE_HEADER_HEIGHT) / ENTITY_TABLE_ROW_HEIGHT,
  );
  const row = point.y >= ENTITY_TABLE_HEADER_HEIGHT
    ? shape.props.rows[rowIndex]
    : undefined;

  editRequests.get(editor)?.get(shape.id)?.(row?.id ?? null);
}

export function EntityTableComponent({
  shape,
  editor,
}: {
  shape: EntityTableShape;
  editor: Editor;
}) {
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [rowDialogOpen, setRowDialogOpen] = useState(false);
  const [tableName, setTableName] = useState(shape.props.tableName);
  const [rows, setRows] = useState(shape.props.rows);
  const [editingRow, setEditingRow] = useState<EntityTableRow | null>(null);

  useEffect(
    () =>
      registerEntityTableEditRequest(editor, shape.id, (rowId) => {
        if (rowId) {
          const row = shape.props.rows.find((item) => item.id === rowId);
          if (row) {
            setEditingRow({ ...row });
            setRowDialogOpen(true);
            return;
          }
        }

        setTableName(shape.props.tableName);
        setRows(shape.props.rows.map((row) => ({ ...row })));
        setTableDialogOpen(true);
      }),
    [editor, shape.id, shape.props.rows, shape.props.tableName],
  );

  const updateRows = (nextRows: EntityTableRow[]) => {
    editor.updateShape({
      id: shape.id,
      type: ENTITY_TABLE_TYPE,
      props: { rows: nextRows },
    });
  };

  const saveTable = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedName = tableName.trim();
    if (!normalizedName) return;

    editor.updateShape({
      id: shape.id,
      type: ENTITY_TABLE_TYPE,
      props: {
        tableName: normalizedName,
        rows,
        h: getEntityTableHeight(rows.length),
      },
    });
    setTableDialogOpen(false);
  };

  const updateDraftRow = (
    rowId: string,
    update: Partial<EntityTableRow>,
  ) => {
    setRows((current) =>
      current.map((row) => (row.id === rowId ? { ...row, ...update } : row)),
    );
  };

  const saveRow = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingRow?.name.trim() || !editingRow.dataType.trim()) return;

    updateRows(
      shape.props.rows.map((row) =>
        row.id === editingRow.id
          ? {
              ...editingRow,
              name: editingRow.name.trim(),
              dataType: editingRow.dataType.trim(),
            }
          : row,
      ),
    );
    setRowDialogOpen(false);
  };

  const deleteRow = () => {
    if (!editingRow) return;
    updateRows(shape.props.rows.filter((row) => row.id !== editingRow.id));
    setRowDialogOpen(false);
  };

  const updateEditingRow = (
    field: "name" | "dataType",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.currentTarget.value;
    setEditingRow((row) => (row ? { ...row, [field]: value } : row));
  };

  return (
    <>
      <div
        className="pointer-events-auto h-full w-full overflow-hidden rounded-lg border border-slate-700 bg-slate-950 text-slate-100 shadow-xl"
        style={{ width: shape.props.w, height: shape.props.h }}
      >
        <div className="flex h-[38px] items-center border-b border-slate-700 bg-slate-900 px-3 font-mono text-sm font-semibold text-slate-100">
          <span className="truncate">{shape.props.tableName}</span>
        </div>
        {shape.props.rows.map((row) => (
          <div
            key={row.id}
            className="flex h-[34px] items-center gap-2 border-b border-slate-800 px-3 last:border-b-0 hover:bg-slate-900/80"
          >
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-slate-200">
              {row.name}
            </span>
            <span className="truncate font-mono text-xs text-slate-500">
              {row.dataType}
            </span>
            {row.isPK && <KeyBadge label="PK" />}
            {row.isFK && <KeyBadge label="FK" />}
          </div>
        ))}
      </div>

      <Dialog open={tableDialogOpen} onOpenChange={setTableDialogOpen}>
        <DialogContent
          className="z-[10001]"
          overlayClassName="z-[10000]"
          onPointerDownCapture={(event) => event.stopPropagation()}
        >
          <form onSubmit={saveTable} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit table</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor={`table-name-${shape.id}`}>Table name</Label>
              <Input
                id={`table-name-${shape.id}`}
                value={tableName}
                onChange={(event) => setTableName(event.currentTarget.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Columns</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setRows((current) => [
                      ...current,
                      {
                        id: crypto.randomUUID(),
                        name: "",
                        dataType: "",
                        isPK: false,
                        isFK: false,
                      },
                    ])
                  }
                >
                  Add Column
                </Button>
              </div>
              <div className="max-h-56 space-y-2 overflow-y-auto">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="space-y-2 rounded-md border p-2"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        aria-label="Column name"
                        placeholder="Column name"
                        value={row.name}
                        onChange={(event) =>
                          updateDraftRow(row.id, {
                            name: event.currentTarget.value,
                          })
                        }
                        required
                      />
                      <Input
                        aria-label="Data type"
                        placeholder="Data type"
                        value={row.dataType}
                        onChange={(event) =>
                          updateDraftRow(row.id, {
                            dataType: event.currentTarget.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            aria-label="Primary key"
                            checked={row.isPK}
                            onChange={(event) =>
                              updateDraftRow(row.id, {
                                isPK: event.currentTarget.checked,
                              })
                            }
                          />
                          PK
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            aria-label="Foreign key"
                            checked={row.isFK}
                            onChange={(event) =>
                              updateDraftRow(row.id, {
                                isFK: event.currentTarget.checked,
                              })
                            }
                          />
                          FK
                        </label>
                      </div>
                      <Button
                        type="button"
                        size="xs"
                        variant="ghost"
                        onClick={() =>
                          setRows((current) =>
                            current.filter((item) => item.id !== row.id),
                          )
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save table</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={rowDialogOpen} onOpenChange={setRowDialogOpen}>
        <DialogContent
          className="z-[10001]"
          overlayClassName="z-[10000]"
          onPointerDownCapture={(event) => event.stopPropagation()}
        >
          <form onSubmit={saveRow} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Edit column</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor={`column-name-${shape.id}`}>Column name</Label>
              <Input
                id={`column-name-${shape.id}`}
                value={editingRow?.name ?? ""}
                onChange={(event) => updateEditingRow("name", event)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`column-type-${shape.id}`}>Data type</Label>
              <Input
                id={`column-type-${shape.id}`}
                value={editingRow?.dataType ?? ""}
                onChange={(event) => updateEditingRow("dataType", event)}
                required
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editingRow?.isPK ?? false}
                  onChange={(event) => {
                    const isPK = event.currentTarget.checked;
                    setEditingRow((row) => (row ? { ...row, isPK } : row));
                  }}
                />
                Primary key
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editingRow?.isFK ?? false}
                  onChange={(event) => {
                    const isFK = event.currentTarget.checked;
                    setEditingRow((row) => (row ? { ...row, isFK } : row));
                  }}
                />
                Foreign key
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="destructive" onClick={deleteRow}>
                Delete row
              </Button>
              <Button type="submit">Save column</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

function KeyBadge({ label }: { label: "PK" | "FK" }) {
  return (
    <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-amber-300">
      {label}
    </span>
  );
}
