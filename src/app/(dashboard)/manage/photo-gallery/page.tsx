"use client";

import { Suspense } from "react";
import { Pagination, Spin } from "antd";
import AdminTable from "@/app/(dashboard)/_components/AdminTable";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import type { CustomLocales, PhotoGalleryType, ServicesType } from "@/services/interface/type";
import { pageModels, pageRoutes } from "../../_type/constant";
import { photo_gallery_list } from "../../_type/query-key";
import SearchingArea from "../../_components/whiteBlockSearch";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import { Columns } from "./_components/Columns";
import { useAction } from "next-safe-action/hooks";
import { useMessageStore } from "@/hooks/useMessageStore";
import {
  getServices,
} from "@/actions/client/services/services.controller";
import { deletePhotoGallery, getPhotoGallery } from "@/actions/client/photoGallery/photoGallery.controller";

export default function AdminPage() {
  const { success, error } = useMessageStore();
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    photo_gallery_list,
    getPhotoGallery,
    {
      params: {
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        query: queryParams.title,
        locale: locale as CustomLocales,
      },
    },
  );
  console.log({ data });

  const totalCount = data?.paginations.dataCount ?? 0;
  const page = data?.paginations.page ?? 1;
  const pageSize = data?.paginations.pageSize ?? 12;
  const totalPages = data?.paginations.totalPages ?? 1;

  const { execute: deleteData } = useAction(deletePhotoGallery, {
    onSuccess: () => {
      success("Data deleted successfully");
    },
    onError: (err) => {
      const errMessage = err.error?.serverError ?? "Failed to delete category";
      error(errMessage ?? "Failed to delete category");
    },
  });
  const handleDelete = async (id: string) => {
    await deleteData({ id: id as string });
  };
  return (
    <div>
      <WhiteBlockTitleArea
        title="Photo Gallery"
        link={pageRoutes.photoGallery.create}
      />
      <SearchingArea link={pageRoutes.photoGallery.link} />
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        }
      >
        <AdminTable<PhotoGalleryType>
          onDelete={handleDelete}
          columns={Columns}
          page={pageRoutes.photoGallery.root}
          model={pageModels.photoGallery}
          dataItems={(data?.data ?? []) as unknown as PhotoGalleryType[]}
          isError={isError}
          refetch={refetch}
          locale={locale}
          sortable={true}
          invalidateQueryKey={photo_gallery_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.photoGallery.updateContent({ id })}
        />
      </Suspense>

      {totalPages > 1 && (
        <div className="mt-10">
          <Pagination
            current={page}
            total={totalCount}
            pageSize={pageSize}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
}
