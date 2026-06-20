import Link from "next/link";
import type { AdminTableColumn } from "@/app/(dashboard)/_components/AdminTable";
import CustomImage from "@/globalElement/CustomImage";
import { getForCards } from "@/utils/getFullimageUrl";
import { FileType, SubServicesType } from "@/services/interface/type";
import { FaFileImage } from "react-icons/fa";
import { pageRoutes } from "@/app/(dashboard)/_type/constant";
import { TfiGallery } from "react-icons/tfi";

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const Columns: AdminTableColumn<SubServicesType>[] = [
  {
    title: "Title",
    key: "title",
    width: 250,
    render: (_, record) => {
      const title = record?.translations?.[0]?.title ?? "—";
      const imageSrc = getForCards(record?.imageUrl as FileType | null);
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
              className="h-10 w-10 rounded object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded bg-gray-100" />
          )}
          <span className="font-medium">{title}</span>
        </div>
      );
    },
  },
  {
    width: 150,
    title: "Slug",
    dataIndex: "slug",
    key: "slug",
    render: (_, record) => {
      const slug = record?.translations?.[0]?.slug ?? "—";
      return <span className="font-medium whitespace-nowrap">{slug}</span>;
    },
  },
  {
    width: 150,
    title: "Related Service",
    dataIndex: "services",
    key: "services",
    render: (_, record) => {
      return (
        <span className="font-medium whitespace-nowrap bg-blue-50 py-2 px-4 rounded-sm">
          {record.services?.translations?.[0]?.title ?? "—"}
        </span>
      );
    },
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
        href={pageRoutes.subServices.updateImage({ id: record.id })}
        className="text-sm mx-auto  w-fit text-blue-600 hover:underline"
      >
        <FaFileImage size={26} />
      </Link>
    ),
  },
  {
    title: "Gallery",
    key: "gallery",
    width: 100,
    render: (_, record) => (
      <Link
        href={pageRoutes.subServices.updateGallery({ id: record.id })}
        className="text-sm mx-auto  w-fit text-blue-600 hover:underline"
      >
        <TfiGallery size={26} />
      </Link>
    ),
  },
];
