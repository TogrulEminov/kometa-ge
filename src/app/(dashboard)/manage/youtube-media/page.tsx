"use client";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import { Suspense } from "react";
import { youtube_media_list } from "../../_type/query-key";
import {
  deleteYoutube,
  getYoutube,
} from "@/actions/client/youtube/youtube.controller";
import { CustomLocales, YoutubeItems } from "@/services/interface/type";
import { pageModels, pageRoutes } from "../../_type/constant";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import SearchingArea from "../../_components/whiteBlockSearch";
import { Pagination, Spin } from "antd";
import AdminTable from "../../_components/AdminTable";
import { Columns } from "./TableColumns";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useAction } from "@/hooks/useServerActions";

export default function AdminYoutubePage() {
  const { success, error } = useMessageStore();
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    youtube_media_list,
    getYoutube,
    {
      params: {
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        query: queryParams.title,
        locale: locale as CustomLocales,
      },
    },
  );

  const totalCount = Number(data?.paginations?.dataCount) || 0;
  const page = Number(data?.paginations?.page) || 1;
  const pageSize = Number(data?.paginations?.pageSize) || 12;
  const totalPages = Number(data?.paginations?.totalPages) || 1;

  const { execute: deleteData } = useAction(deleteYoutube, {
    queryKey: youtube_media_list,
    onSuccess: () => {
      success("Date deleted successfully");
    },
    onError: (err) => {
      const errMessage = err.error?.serverError ?? "Failed to delete data";
      error(errMessage ?? "Failed to delete data");
    },
  });
  const handleDelete = async (id: string) => {
    await deleteData({ id: id as string });
  };
  return (
    <div>
      <WhiteBlockTitleArea
        title="Youtube videos"
        link={pageRoutes.youtubeMedia.create}
      />
      <SearchingArea link={pageRoutes.youtubeMedia.link} />
      <Suspense
        fallback={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "50px",
            }}
          >
            <Spin size="large" />
          </div>
        }
      >
        <AdminTable<YoutubeItems>
          onDelete={handleDelete}
          columns={Columns}
          page={pageRoutes.youtubeMedia.root}
          dataItems={(data?.data ?? []) as unknown as YoutubeItems[]}
          isError={isError}
          refetch={refetch}
          locale={locale}
          sortable={true}
          model={pageModels.youtube}
          invalidateQueryKey={youtube_media_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.youtubeMedia.updateContent({ id })}
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
