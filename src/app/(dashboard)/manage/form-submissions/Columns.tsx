import { Popconfirm, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { FormType } from "@/generated/prisma/enums";
import type { FormSubmissionModel } from "@/services/interface/type";
import { LuTrash2 } from "react-icons/lu";

type Payload = Record<string, string | undefined>;

function getContact(payload: unknown) {
  const data = (payload ?? {}) as Payload;
  return data.email || data.name || data.telephone || data.phone || "—";
}

function getMessagePreview(payload: unknown) {
  const data = (payload ?? {}) as Payload;
  const message = data.message?.trim();
  if (!message) {
    if (data.from && data.to) return `${data.from} → ${data.to}`;
    return "—";
  }
  return message.length > 80 ? `${message.slice(0, 80)}...` : message;
}

type ColumnProps = {
  onDelete: (id: string) => void;
  typeLabels: Record<FormType, string>;
};

export function Columns({
  onDelete,
  typeLabels,
}: ColumnProps): ColumnsType<FormSubmissionModel> {
  return [
    {
      title: "Type",
      dataIndex: "type",
      width: 140,
      render: (type: FormType) => <Tag color="purple">{typeLabels[type]}</Tag>,
    },
    {
      title: "Contact",
      key: "contact",
      width: 200,
      render: (_, record) => (
        <span className="font-medium">{getContact(record.payload)}</span>
      ),
    },
    {
      title: "Message",
      key: "message",
      render: (_, record) => (
        <span className="text-gray-600">{getMessagePreview(record.payload)}</span>
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
      title: "",
      key: "actions",
      width: 60,
      render: (_, record) => (
        <Popconfirm
          title="Delete this message?"
          onConfirm={() => onDelete(record.id)}
        >
          <button
            type="button"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
          >
            <LuTrash2 className="h-4 w-4" />
          </button>
        </Popconfirm>
      ),
    },
  ];
}
