"use client";
import { Suspense } from "react";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import SearchingArea from "../../_components/whiteBlockSearch";

import { Spin } from "antd";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import { enum_list } from "../../_type/query-key";

import { CustomLocales, Enum } from "@/services/interface/type";
import { pageRoutes } from "../../_type/constant";
import AdminTable from "../../_components/AdminTable";
import { Columns } from "./Columns";
import { useAction } from "@/hooks/useServerActions";
import { deleteEnum, getEnumData } from "@/actions/client/enum/enum.controller";

export default function ContentAdminPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    enum_list,
    getEnumData,
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

  console.log(data);

  const { execute: deleteData } = useAction(deleteEnum, {
    queryKey: enum_list,
  });
  const handleDelete = async (id: string) => {
    await deleteData({ id: id as string });
  };
  return (
    <div>
      <WhiteBlockTitleArea
        title={"System types"}
        link={pageRoutes.enum.create}
      />
      <SearchingArea link={pageRoutes.enum.link} />
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
        <AdminTable<Enum>
          onDelete={handleDelete}
          columns={Columns}
          page={pageRoutes.enum.root}
          dataItems={(data?.data ?? []) as unknown as Enum[]}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey={enum_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.enum.updateContent({ id })}
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
