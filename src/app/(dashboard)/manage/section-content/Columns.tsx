 
import type { AdminTableColumn } from "@/app/(dashboard)/_components/AdminTable";
 
import {   SectionContent } from "@/services/interface/type";
 
const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const Columns: AdminTableColumn<SectionContent>[] = [
  {
    title: "Title",
    key: "title",
    width: 250,
    render: (_, record) => {
      const title = record?.translations?.[0]?.title ?? "—";
      console.log(record);

      return (
        <div className="flex items-center gap-3">
          <span className="font-medium">{title}</span>
        </div>
      );
    },
  },
  {
    width: 150,
    title: "Key",
    dataIndex: "key",
    key: "key",
    render: (_, record) => (
      <span className="bg-gray-300 py-2   w-fit px-4 font-medium text-black  rounded-sm flex items-center justify-center ">
        {record.key}
      </span>
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
