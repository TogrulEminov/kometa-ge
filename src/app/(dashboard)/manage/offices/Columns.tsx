import type { AdminTableColumn } from "@/app/(dashboard)/_components/AdminTable";
import { Office } from "@/services/interface/type";

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const Columns: AdminTableColumn<Office>[] = [
  {
    title: "Title",
    key: "title",
    width: 250,
    render: (_, record) => {
      const title = record?.translations?.[0]?.city ?? "—";

      return (
        <div className="flex items-center gap-3">
          {record.orderNumber && (
            <span className="size-10 bg-gray-100 rounded-sm text-gray-700 flex items-center justify-center">
              {record.orderNumber}
            </span>
          )}
          <span className="font-medium">{title}</span>
        </div>
      );
    },
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    render: (_, record) => <span className="font-medium">{record.type}</span>,
  },
  {
    width: 150,
    title: "ISO Code",
    dataIndex: "branch.isoCode",
    key: "branch.isoCode",
    render: (_, record) => (
      <span className="font-medium">{record.branch.isoCode}</span>
    ),
  },
  {
    title: "Created At",
    key: "createdAt",
    width: 120,
    render: (_, record) => formatDate(record.createdAt),
  },
  {
    title: "Updated At",
    key: "updatedAt",
    width: 120,
    render: (_, record) => formatDate(record.updatedAt),
  },
];
