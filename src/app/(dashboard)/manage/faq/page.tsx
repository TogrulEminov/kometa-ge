"use client";
import { Suspense } from "react";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import SearchingArea from "../../_components/whiteBlockSearch";
import { Spin } from "antd";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import { faq_list } from "../../_type/query-key";
import { CustomLocales, FaqItem } from "@/services/interface/type";
import { pageModels, pageRoutes } from "../../_type/constant";
import AdminTable from "../../_components/AdminTable";
import { Columns } from "./Columns";
import { useAction } from "next-safe-action/hooks";
import { deleteFag, getFagData } from "@/actions/client/fags/fags.controller";

export default function ContentAdminPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    faq_list,
    getFagData,
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
  const { execute: deleteData } = useAction(deleteFag, {});
  const handleDelete = async (id: string) => {
    await deleteData({ id: id as string });
  };
  return (
    <div>
      <WhiteBlockTitleArea title={"FAG"} link={pageRoutes.faq.create} />
      <SearchingArea link={pageRoutes.faq.link} />
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
        <AdminTable<FaqItem>
          onDelete={handleDelete}
          columns={Columns}
          page={pageRoutes.faq.root}
          dataItems={(data?.data ?? []) as unknown as FaqItem[]}
          isError={isError}
          refetch={refetch}
          sortable={true}
          model={pageModels.faq}
          locale={locale}
          invalidateQueryKey={faq_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.faq.updateContent({ id })}
        />
      </Suspense>

      {totalPages > 1 && (
        <div style={{ marginTop: "40px" }}>
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
