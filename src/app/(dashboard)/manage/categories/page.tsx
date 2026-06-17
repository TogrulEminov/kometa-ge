"use client";

import { Suspense } from "react";
import { Pagination, Spin } from "antd";
import { getCategories } from "@/actions/client/categories/category.controller";
import AdminTable from "@/app/(dashboard)/_components/AdminTable";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import { authClient } from "@/lib/auth/auth-client";
import type { CustomLocales } from "@/services/interface/type";
import { pageRoutes } from "../../_type/constant";
import { categories_content_list } from "../../_type/query-key";
import SearchingArea from "../../_components/whiteBlockSearch";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import { categoryColumns } from "./_components/categoryColumns";

export default function AdminCategoriesPage() {
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    categories_content_list,
    getCategories,
    {
      params: {
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        query: queryParams.title,
        locale: locale as CustomLocales,
      },
    },
  );
  const { data: session } = authClient.useSession();
  const isSuperAdmin = session?.user.role === "admin";

  const totalCount = data?.paginations.dataCount ?? 0;
  const page = data?.paginations.page ?? 1;
  const pageSize = data?.paginations.pageSize ?? 12;
  const totalPages = data?.paginations.totalPages ?? 1;

  return (
    <div>
      <WhiteBlockTitleArea
        title="Main Pages"
        disabled={!isSuperAdmin}
        link={pageRoutes.categories.create}
      />
      <SearchingArea link={pageRoutes.categories.link} />
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        }
      >
        <AdminTable
          columns={categoryColumns}
          page="categories"
          model={categories_content_list}
          dataItems={data?.data ?? []}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey={categories_content_list}
          isLoading={isLoading}
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
