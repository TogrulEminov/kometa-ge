import { Button, Popconfirm, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FormStatus, FormType } from "@/generated/prisma/enums";
import type { FormSubmissionModel } from "@/services/interface/type";
import { LuEye, LuTrash2 } from "react-icons/lu";

type Payload = Record<string, string | undefined>;

function getPreview(payload: unknown) {
  const data = (payload ?? {}) as Payload;
  return (
    data.email ||
    data.name ||
    data.telephone ||
    data.phone ||
    "—"
  );
}

type ColumnProps = {
  onView: (record: FormSubmissionModel) => void;
  onMarkRead: (id: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
  typeLabels: Record<FormType, string>;
  statusColors: Record<FormStatus, string>;
};

export function Columns({
  onView,
  onMarkRead,
  onArchive,
  onDelete,
  typeLabels,
  statusColors,
}: ColumnProps): ColumnsType<FormSubmissionModel> {
  return [
    {
      title: "Type",
      dataIndex: "type",
      width: 140,
      render: (type: FormType) => (
        <Tag color="purple">{typeLabels[type]}</Tag>
      ),
    },
    {
      title: "Contact",
      key: "contact",
      render: (_, record) => (
        <span className="font-medium">{getPreview(record.payload)}</span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 100,
      render: (status: FormStatus) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Locale",
      dataIndex: "locale",
      width: 70,
      render: (locale) => locale ?? "—",
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      width: 160,
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <div
          className="flex items-center gap-1"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            type="text"
            size="small"
            icon={<LuEye />}
            onClick={() => onView(record)}
          />
          {record.status === FormStatus.NEW && (
            <Button size="small" onClick={() => onMarkRead(record.id)}>
              Read
            </Button>
          )}
          {record.status !== FormStatus.ARCHIVED && (
            <Button size="small" onClick={() => onArchive(record.id)}>
              Archive
            </Button>
          )}
          <Popconfirm
            title="Delete this message?"
            onConfirm={() => onDelete(record.id)}
          >
            <Button type="text" danger size="small" icon={<LuTrash2 />} />
          </Popconfirm>
        </div>
      ),
    },
  ];
}
