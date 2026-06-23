"use client";
import { Suspense } from "react";
import { Pagination } from "antd";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import SearchingArea from "../../_components/whiteBlockSearch";

import { Spin } from "antd";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import { section_content_list } from "../../_type/query-key";
import {
  deleteSection,
  getSectionContent,
} from "@/actions/client/section/section.controller";
import { CustomLocales, SectionContent } from "@/services/interface/type";
import { pageRoutes } from "../../_type/constant";
import AdminTable from "../../_components/AdminTable";
import { Columns } from "./Columns";
import { useAction } from "@/hooks/useServerActions";

export default function SectionContentAdminPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    section_content_list,
    getSectionContent,
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
  const { execute: deleteData } = useAction(deleteSection, {
    queryKey: section_content_list,
  });
  const handleDelete = async (id: string) => {
    await deleteData({ id: id as string });
  };
  return (
    <div>
      <WhiteBlockTitleArea
        title={"Section area"}
        link={pageRoutes.sectionContent.create}
      />
      <SearchingArea link={pageRoutes.sectionContent.link} />
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
        <AdminTable<SectionContent>
          onDelete={handleDelete}
          columns={Columns}
          page={pageRoutes.sectionContent.root}
          dataItems={(data?.data ?? []) as unknown as SectionContent[]}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey={section_content_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.sectionContent.updateContent({ id })}
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
