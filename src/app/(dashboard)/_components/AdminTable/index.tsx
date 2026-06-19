"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Popconfirm, Table } from "antd";
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { LuGripVertical, LuTrash2 } from "react-icons/lu";
import NoDataComponent from "@/app/(dashboard)/_components/noData";
import UptadeButton from "@/app/(dashboard)/_components/uptadeButton";
import { updateOrderAction } from "@/actions/order/updateOrder.action";
import { isOrderableModel } from "@/lib/order/orderableModels";
import { useMessageStore } from "@/hooks/useMessageStore";

export interface BaseTableItem {
  id: number | string;
  orderNumber?: number | null;
  [key: string]: unknown;
}

export interface AdminTableColumn<T extends BaseTableItem> {
  title: string;
  dataIndex?: keyof T | string;
  key?: string;
  width?: number;
  render?: (value: unknown, record: T, page: string) => React.ReactNode;
}

interface AdminTableProps<T extends BaseTableItem> {
  refetch?: () => void;
  dataItems: T[];
  isLoading: boolean;
  isError: boolean;
  columns: AdminTableColumn<T>[];
  page: string;
  locale: string;
  model?: string;
  invalidateQueryKey: string;
  sortable?: boolean;
  onDelete?: (id: string) => Promise<void> | void;
  updateLink: (id: string) => string;
}

interface RowContextValue {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: ReturnType<typeof useSortable>["listeners"];
  attributes?: ReturnType<typeof useSortable>["attributes"];
}

const RowContext = React.createContext<RowContextValue>({});

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

function SortableRow(props: RowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props["data-row-key"] });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 10 } : {}),
  };

  return (
    <RowContext.Provider value={{ setActivatorNodeRef, listeners, attributes }}>
      <tr {...props} ref={setNodeRef} style={style} />
    </RowContext.Provider>
  );
}

function DragHandle() {
  const { listeners, attributes, setActivatorNodeRef } =
    React.useContext(RowContext);

  return (
    <button
      type="button"
      ref={setActivatorNodeRef}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-blue-600 p-1"
      aria-label="Sürüşdür"
    >
      <LuGripVertical className="w-4 h-4" />
    </button>
  );
}

function AdminTable<T extends BaseTableItem>({
  refetch,
  dataItems,
  isLoading,
  isError,
  page,
  model,
  locale,
  columns,
  invalidateQueryKey,
  sortable = false,
  onDelete,
  updateLink,
}: AdminTableProps<T>) {
  const queryClient = useQueryClient();
  const { success, error } = useMessageStore();
  const [dataSource, setDataSource] = useState<T[]>(dataItems);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const canSort = sortable && isOrderableModel(model ?? "");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const { execute, isExecuting } = useAction(updateOrderAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        success(data.message ?? "Sıra yeniləndi");
        queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });
        refetch?.();
        return;
      }

      error(data?.error ?? "Sıra yenilənmədi");
      setDataSource(dataItems);
    },
    onError: () => {
      error("Sıra yenilənərkən xəta baş verdi");
      setDataSource(dataItems);
    },
  });

  useEffect(() => {
    setDataSource(dataItems);
  }, [dataItems]);

  const handleDelete = useCallback(
    async (id: string) => {
      if (!onDelete) return;

      setDeletingId(id);
      try {
        await onDelete(id);
        await queryClient.invalidateQueries({ queryKey: [invalidateQueryKey] });
        refetch?.();
      } catch {
        error("Silinərkən xəta baş verdi");
      } finally {
        setDeletingId(null);
      }
    },
    [error, invalidateQueryKey, onDelete, queryClient, refetch],
  );

  const tableColumns = useMemo(() => {
    const mapped = columns.map((col) => ({
      title: col.title,
      key: col.key ?? String(col.dataIndex),
      dataIndex: col.dataIndex as string,
      width: col.width,
      render: (value: unknown, record: T) =>
        col.render
          ? col.render(value, record, page)
          : (value as React.ReactNode),
    }));

    if (canSort) {
      mapped.unshift({
        title: "",
        key: "sort",
        dataIndex: "sort",
        width: 48,
        render: () => <DragHandle />,
      });
    }

    mapped.push({
      title: "Actions",
      key: "actions",
      dataIndex: "actions",
      width: onDelete ? 200 : 140,
      render: (_: unknown, record: T) => (
        <div className="flex items-center  gap-2">
          <UptadeButton link={updateLink(String(record.id))} />
          {onDelete && (
            <Popconfirm
              title="Are you sure you want to delete this item?"
              okButtonProps={{
                danger: true,
                loading: deletingId === record.id,
              }}
              cancelButtonProps={{ disabled: deletingId === record.id }}
              onConfirm={() => handleDelete(record.id as string)}
            >
              <button
                type="button"
                disabled={deletingId === record.id}
                className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Sil"
              >
                <LuTrash2 className="h-4 w-4" />
                Delete
              </button>
            </Popconfirm>
          )}
        </div>
      ),
    });

    return mapped;
  }, [canSort, columns, page, onDelete, deletingId, handleDelete]);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const oldIndex = dataSource.findIndex(
      (item) => String(item.id) === String(active.id),
    );
    const newIndex = dataSource.findIndex(
      (item) => String(item.id) === String(over.id),
    );

    if (oldIndex < 0 || newIndex < 0) return;

    const nextItems = arrayMove(dataSource, oldIndex, newIndex);
    setDataSource(nextItems);

    execute({
      model: model ?? "",
      items: nextItems.map((item, index) => ({
        id: item.id,
        orderNumber: index + 1,
      })),
    });
  };

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-red-600 font-semibold text-lg mb-2">
          Xəta baş verdi
        </div>
        <p className="text-red-500 text-sm">Veri yüklənərkən problem yarandı</p>
      </div>
    );
  }

  if (!isLoading && !dataSource.length) {
    return <NoDataComponent link={`${page}/create?locale=${locale}`} />;
  }

  const table = (
    <Table<T>
      rowKey={(record) => String(record.id)}
      columns={tableColumns}
      dataSource={dataSource}
      loading={isLoading || isExecuting || deletingId !== null}
      pagination={false}
      scroll={{ x: true }}
      components={
        canSort
          ? {
              body: {
                row: SortableRow,
              },
            }
          : undefined
      }
    />
  );

  if (!canSort) {
    return <div className="admin-table">{table}</div>;
  }

  return (
    <div className="admin-table">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={dataSource.map((item) => String(item.id))}
          strategy={verticalListSortingStrategy}
        >
          {table}
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default AdminTable;
