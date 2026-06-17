import Link from "next/link";
import type { AdminTableColumn } from "@/app/(dashboard)/_components/AdminTable";
import CustomImage from "@/globalElement/CustomImage";
import type { CategoryListItem } from "@/services/interface/type";
import { getForCards } from "@/utils/getFullimageUrl";

const formatDate = (date: Date | string) =>
  new Date(date).toLocaleDateString("az-AZ", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

export const categoryColumns: AdminTableColumn<CategoryListItem>[] = [
  {
    title: "Başlıq",
    key: "title",
    render: (_, record) => {
      const title = record.translations[0]?.title ?? "—";
      const imageSrc = getForCards(record.imageUrl);

      return (
        <div className="flex items-center gap-3">
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
    title: "Slug",
    dataIndex: "slug",
    key: "slug",
  },
  {
    title: "Yaradılıb",
    key: "createdAt",
    width: 120,
    render: (_, record) => formatDate(record.createdAt),
  },
  {
    title: "Yenilənib",
    key: "updatedAt",
    width: 120,
    render: (_, record) => formatDate(record.updatedAt),
  },
  {
    title: "Şəkil",
    key: "image",
    width: 100,
    render: (_, record) => (
      <Link
        href={`/manage/categories/uptade/${record.id}/image`}
        className="text-sm text-blue-600 hover:underline"
      >
        Şəkil
      </Link>
    ),
  },
];
