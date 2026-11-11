"use client";

import {
  ChevronDown,
  ChevronUp,
  KeyRound,
  Link2,
  Plus,
  Table2,
  Trash2,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { useValue, type Editor } from "tldraw";
import {
  ENTITY_TABLE_HEADER_HEIGHT,
  ENTITY_TABLE_ROW_HEIGHT,
  ENTITY_TABLE_TYPE,
  getTableHeight,
  newRow,
  type EntityRow,
  type EntityTableShape,
} from "./EntityTableShape";

type InlineKeyEvent = KeyboardEvent<HTMLInputElement>;
type InlinePointerEvent = PointerEvent<HTMLInputElement>;

export function EntityTableComponent({
  shape,
  editor,
}: {
  shape: EntityTableShape;
  editor: Editor;
}) {
  const isSelected = useValue(
    "entity table selected",
    () => editor.getSelectedShapeIds().includes(shape.id),
    [editor, shape.id],
  );
  const [editingTableName, setEditingTableName] = useState(false);
  const [tableNameDraft, setTableNameDraft] = useState(shape.props.tableName);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editingRowDraft, setEditingRowDraft] = useState<EntityRow | null>(
    null,
  );
  const [newRowId, setNewRowId] = useState<string | null>(null);
  const tableNameInputRef = useRef<HTMLInputElement>(null);
  const columnNameInputRef = useRef<HTMLInputElement>(null);
  const columnTypeInputRef = useRef<HTMLInputElement>(null);
  const skipTableNameBlurRef = useRef(false);
  const skipRowBlurRef = useRef(false);

  const selectShape = () => editor.select(shape.id);

  const updateRows = useCallback((rows: EntityRow[]) => {
    editor.updateShape({
      id: shape.id,
      type: ENTITY_TABLE_TYPE,
      props: { rows, h: getTableHeight(rows.length) },
    });
  }, [editor, shape.id]);

  const finishRowEdit = useCallback(() => {
    if (!editingRowDraft) return;

    const previousRow = shape.props.rows.find(
      (row) => row.id === editingRowDraft.id,
    );
    const name = editingRowDraft.name.trim();

    if (!name && newRowId === editingRowDraft.id) {
      updateRows(
        shape.props.rows.filter((row) => row.id !== editingRowDraft.id),
      );
    } else {
      updateRows(
        shape.props.rows.map((row) =>
          row.id === editingRowDraft.id
            ? {
                ...editingRowDraft,
                name: name || previousRow?.name || "",
                dataType: editingRowDraft.dataType.trim() || "string",
              }
            : row,
        ),
      );
    }
    setEditingRowId(null);
    setEditingRowDraft(null);
    setNewRowId(null);
  }, [editingRowDraft, newRowId, shape.props.rows, updateRows]);

  const cancelRowEdit = () => {
    skipRowBlurRef.current = true;
    window.setTimeout(() => {
      skipRowBlurRef.current = false;
    }, 0);
    if (newRowId) {
      updateRows(shape.props.rows.filter((row) => row.id !== newRowId));
    }
    setEditingRowId(null);
    setEditingRowDraft(null);
    setNewRowId(null);
  };

  const beginRowEdit = (row: EntityRow) => {
    selectShape();
    setEditingRowDraft({ ...row });
    setEditingRowId(row.id);
    setNewRowId(null);
  };

  const handleInlineKeyDown = (
    event: InlineKeyEvent,
    onEnter: () => void,
    onEscape: () => void,
  ) => {
    event.stopPropagation();
    if (event.key === "Enter") {
      event.preventDefault();
      onEnter();
    } else if (event.key === "Escape") {
      event.preventDefault();
      onEscape();
    }
  };

  const stopInlineKeyEvent = (event: InlineKeyEvent) => {
    event.stopPropagation();
  };

  const stopInlinePointerEvent = (event: InlinePointerEvent) => {
    event.stopPropagation();
  };

  const saveTableName = useCallback(() => {
    const tableName = tableNameDraft.trim();
    if (tableName) {
      editor.updateShape({
        id: shape.id,
        type: ENTITY_TABLE_TYPE,
        props: { tableName },
      });
    } else {
      setTableNameDraft(shape.props.tableName);
    }
    setEditingTableName(false);
  }, [editor, shape.id, shape.props.tableName, tableNameDraft]);

  const cancelTableName = () => {
    skipTableNameBlurRef.current = true;
    window.setTimeout(() => {
      skipTableNameBlurRef.current = false;
    }, 0);
    setTableNameDraft(shape.props.tableName);
    setEditingTableName(false);
  };

  const handleTableNameBlur = () => {
    if (skipTableNameBlurRef.current) {
      skipTableNameBlurRef.current = false;
      return;
    }
    saveTableName();
  };

  const handleRowInputBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (
      event.relatedTarget === columnNameInputRef.current ||
      event.relatedTarget === columnTypeInputRef.current
    ) {
      return;
    }
    if (skipRowBlurRef.current) {
      skipRowBlurRef.current = false;
      return;
    }
    finishRowEdit();
  };

  const addColumn = () => {
    const row = newRow();
    selectShape();
    updateRows([...shape.props.rows, row]);
    setEditingRowDraft(row);
    setEditingRowId(row.id);
    setNewRowId(row.id);
  };

  const updateRowFlag = (field: "isPK" | "isFK") => {
    if (!editingRowDraft) return;
    const updatedRow = {
      ...editingRowDraft,
      [field]: !editingRowDraft[field],
    };
    const rows = shape.props.rows.map((row) =>
      row.id === updatedRow.id ? updatedRow : row,
    );
    updateRows(rows);
    setEditingRowDraft(updatedRow);
  };

  const moveRow = (offset: -1 | 1) => {
    if (!editingRowId) return;
    const currentIndex = shape.props.rows.findIndex(
      (row) => row.id === editingRowId,
    );
    const nextIndex = currentIndex + offset;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= shape.props.rows.length) {
      return;
    }

    const rows = [...shape.props.rows];
    [rows[currentIndex], rows[nextIndex]] = [rows[nextIndex], rows[currentIndex]];
    updateRows(rows);
  };

  const deleteRow = () => {
    if (!editingRowId) return;
    updateRows(shape.props.rows.filter((row) => row.id !== editingRowId));
    setEditingRowId(null);
    setEditingRowDraft(null);
    setNewRowId(null);
  };

  useEffect(() => {
    if (editingTableName) {
      tableNameInputRef.current?.focus();
      tableNameInputRef.current?.setSelectionRange(
        tableNameInputRef.current.value.length,
        tableNameInputRef.current.value.length,
      );
    }
  }, [editingTableName]);

  useEffect(() => {
    if (editingRowId) {
      columnNameInputRef.current?.focus();
      if (newRowId === editingRowId) {
        columnNameInputRef.current?.select();
      } else {
        columnNameInputRef.current?.setSelectionRange(
          columnNameInputRef.current.value.length,
          columnNameInputRef.current.value.length,
        );
      }
    }
  }, [editingRowId, newRowId]);

  useEffect(() => {
    if (!editingRowId && !editingTableName) return;

    return editor.store.listen(
      () => {
        if (editor.getSelectedShapeIds().includes(shape.id)) return;
        if (editingRowId) finishRowEdit();
        if (editingTableName) saveTableName();
      },
      { scope: "session" },
    );
  }, [
    editor,
    editingRowId,
    editingTableName,
    finishRowEdit,
    saveTableName,
    shape.id,
  ]);

  const editingRowIndex = shape.props.rows.findIndex(
    (row) => row.id === editingRowId,
  );

  return (
    <div
      className="entity-table group/entity-table pointer-events-auto relative overflow-visible text-foreground"
      style={{ width: shape.props.w, height: shape.props.h }}
    >
      <div
        className={`h-full w-full overflow-hidden rounded-xl border bg-card shadow-sm ${
          isSelected || editingTableName || editingRowId
            ? "border-primary"
            : "border-border"
        }`}
      >
        <div className="flex h-[38px] items-center gap-2 border-b border-border bg-secondary/60 px-3 text-sm font-semibold text-white">
          <Table2 aria-hidden="true" className="size-4 shrink-0 text-primary/80" />
          {editingTableName ? (
            <input
              ref={tableNameInputRef}
              aria-label="Table name"
              className="h-8 min-w-0 flex-1 border-0 border-b border-transparent bg-transparent px-0 text-sm font-semibold text-white outline-none focus-visible:border-primary focus-visible:ring-0"
              value={tableNameDraft}
              onChange={(event) => setTableNameDraft(event.currentTarget.value)}
              onPointerDown={stopInlinePointerEvent}
              onKeyDown={(event) =>
                handleInlineKeyDown(event, saveTableName, cancelTableName)
              }
              onKeyUp={stopInlineKeyEvent}
              onBlur={handleTableNameBlur}
            />
          ) : (
            <span
              className="min-w-0 flex-1 cursor-text truncate"
              onPointerDown={(event) => event.stopPropagation()}
              onDoubleClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                selectShape();
                setTableNameDraft(shape.props.tableName);
                setEditingTableName(true);
              }}
            >
              {shape.props.tableName}
            </span>
          )}
        </div>

        {shape.props.rows.map((row) => {
          const isEditing = editingRowId === row.id && editingRowDraft;

          return (
            <div
              key={row.id}
              className={`flex h-[34px] items-center gap-2 border-b border-border/60 px-3 text-[13px] transition-colors duration-150 last:border-b-0 hover:bg-accent/20 ${
                isEditing ? "border-l-2 border-l-primary bg-accent/30 pl-2" : ""
              }`}
              onPointerDown={(event) => event.stopPropagation()}
              onClick={() => {
                if (!isEditing) beginRowEdit(row);
              }}
            >
              {isEditing ? (
                <>
                  <input
                    ref={columnNameInputRef}
                    aria-label="Column name"
                    className="h-[33px] min-w-0 flex-1 border-0 border-b border-transparent bg-transparent px-0 text-[13px] text-white outline-none focus-visible:border-primary focus-visible:ring-0"
                    value={editingRowDraft.name}
                    onChange={(event) =>
                      setEditingRowDraft({
                        ...editingRowDraft,
                        name: event.currentTarget.value,
                      })
                    }
                    onPointerDown={stopInlinePointerEvent}
                    onKeyDown={(event) => {
                      if (event.key === "Tab" && !event.shiftKey) {
                        event.preventDefault();
                        event.stopPropagation();
                        columnTypeInputRef.current?.focus();
                        return;
                      }
                      handleInlineKeyDown(
                        event,
                        finishRowEdit,
                        cancelRowEdit,
                      );
                    }}
                    onKeyUp={stopInlineKeyEvent}
                    onBlur={handleRowInputBlur}
                  />
                  {editingRowDraft.isPK && <KeyBadge label="PK" />}
                  {editingRowDraft.isFK && <KeyBadge label="FK" />}
                  <input
                    ref={columnTypeInputRef}
                    aria-label="Data type"
                    list={`entity-table-types-${shape.id}`}
                    className="h-[33px] w-[76px] shrink-0 border-0 border-b border-transparent bg-transparent px-0 text-right font-mono text-xs text-white outline-none focus-visible:border-primary focus-visible:ring-0"
                    value={editingRowDraft.dataType}
                    onChange={(event) =>
                      setEditingRowDraft({
                        ...editingRowDraft,
                        dataType: event.currentTarget.value,
                      })
                    }
                    onPointerDown={stopInlinePointerEvent}
                    onKeyDown={(event) =>
                      handleInlineKeyDown(
                        event,
                        finishRowEdit,
                        cancelRowEdit,
                      )
                    }
                    onKeyUp={stopInlineKeyEvent}
                    onBlur={handleRowInputBlur}
                  />
                  <datalist id={`entity-table-types-${shape.id}`}>
                    {[
                      "uuid",
                      "string",
                      "text",
                      "int",
                      "bigint",
                      "float",
                      "boolean",
                      "json",
                      "timestamptz",
                      "date",
                      "enum",
                    ].map((type) => (
                      <option key={type} value={type} />
                    ))}
                  </datalist>
                </>
              ) : (
                <>
                  <span className="min-w-0 max-w-[55%] shrink truncate text-[13px] text-white">
                    {row.name}
                  </span>
                  {row.isPK && <KeyBadge label="PK" />}
                  {row.isFK && <KeyBadge label="FK" />}
                  <span className="ml-auto max-w-28 truncate font-mono text-xs text-muted-foreground">
                    {row.dataType}
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Add column"
        className={`absolute left-0 top-full z-10 inline-flex h-7 items-center gap-1 rounded px-1.5 text-xs text-muted-foreground opacity-0 transition-opacity duration-150 group-hover/entity-table:opacity-100 hover:text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
          isSelected || editingRowId ? "opacity-100" : ""
        }`}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          addColumn();
        }}
      >
        <Plus aria-hidden="true" className="size-3.5" />
        Add column
      </button>

      {editingRowDraft && editingRowIndex >= 0 && isSelected && (
        <div
          aria-label="Column actions"
          className="absolute z-20 flex -translate-y-1/2 items-center gap-2 rounded-lg border border-border bg-popover p-1 shadow-sm"
          style={{
            left: "calc(100% + 8px)",
            top:
              ENTITY_TABLE_HEADER_HEIGHT +
              editingRowIndex * ENTITY_TABLE_ROW_HEIGHT +
              ENTITY_TABLE_ROW_HEIGHT / 2,
          }}
          onPointerDown={(event) => {
            event.preventDefault();
            event.stopPropagation();
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <ToolbarButton
            label="Toggle primary key"
            active={editingRowDraft.isPK}
            activeStyle="highlight"
            onClick={() => updateRowFlag("isPK")}
          >
            <KeyRound aria-hidden="true" className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Toggle foreign key"
            active={editingRowDraft.isFK}
            activeStyle="primary"
            onClick={() => updateRowFlag("isFK")}
          >
            <Link2 aria-hidden="true" className="size-4" />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            label="Move column up"
            disabled={editingRowIndex === 0}
            onClick={() => moveRow(-1)}
          >
            <ChevronUp aria-hidden="true" className="size-4" />
          </ToolbarButton>
          <ToolbarButton
            label="Move column down"
            disabled={editingRowIndex === shape.props.rows.length - 1}
            onClick={() => moveRow(1)}
          >
            <ChevronDown aria-hidden="true" className="size-4" />
          </ToolbarButton>
          <ToolbarDivider />
          <ToolbarButton
            label="Delete column"
            destructive
            onClick={deleteRow}
          >
            <Trash2 aria-hidden="true" className="size-4" />
          </ToolbarButton>
        </div>
      )}
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  active,
  activeStyle,
  disabled = false,
  destructive = false,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  activeStyle?: "highlight" | "primary";
  disabled?: boolean;
  destructive?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      disabled={disabled}
      className={`inline-flex size-7 items-center justify-center rounded-md transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
        active && activeStyle === "highlight"
          ? "bg-highlight/15 text-highlight"
          : active && activeStyle === "primary"
            ? "bg-primary/15 text-primary"
            : destructive
              ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
              : "text-muted-foreground hover:bg-accent"
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span aria-hidden="true" className="h-5 w-px bg-border" />;
}

function KeyBadge({ label }: { label: "PK" | "FK" }) {
  return (
    <span className="shrink-0 rounded bg-highlight/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-highlight">
      {label}
    </span>
  );
}
