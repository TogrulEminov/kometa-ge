import Link from "next/link";
import type { AdminTableColumn } from "@/app/(dashboard)/_components/AdminTable";
import CustomImage from "@/globalElement/CustomImage";
import { getForCards } from "@/utils/getFullimageUrl";
import { YoutubeItems } from "@/services/interface/type";
import { FaFileImage } from "react-icons/fa";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const Columns: AdminTableColumn<YoutubeItems>[] = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    width: 350,
    render: (_, record) => {
      const title = record?.translations?.[0]?.title ?? "—";
      const imageSrc = getForCards(record.imageUrl);
      return (
        <div className="flex items-center gap-3">
          {record.orderNumber && (
            <span className="size-10 bg-gray-100 rounded-sm text-gray-700 flex items-center justify-center">
              {record.orderNumber}
            </span>
          )}
          {imageSrc ? (
            <CustomImage
              src={imageSrc}
              width={40}
              height={40}
              title={title}
              className="size-10 rounded object-cover"
            />
          ) : (
            <div className="size-10 flex items-center justify-center rounded bg-gray-100 text-white">
              📌
            </div>
          )}
          <span className="font-medium">{title}</span>
        </div>
      );
    },
  },
  {
    title: "Url",
    dataIndex: "url",
    width: 150,
    key: "url",
    render: (_, record) => (
      <a href={record.url} target="_blank">
        {record.url}
      </a>
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
  {
    title: "Image",
    key: "image",
    width: 100,
    render: (_, record) => (
      <Link
        href={pageRoutes.youtubeMedia.updateImage({ id: record.id })}
        className="text-sm w-fit text-blue-600 hover:underline"
      >
        <FaFileImage size={26} />
      </Link>
    ),
  },
];
