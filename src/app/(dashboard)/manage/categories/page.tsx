"use client";

import { Suspense } from "react";
import { Pagination, Spin } from "antd";
import {
  deleteCategory,
  getCategories,
} from "@/actions/client/categories/category.controller";
import AdminTable from "@/app/(dashboard)/_components/AdminTable";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import type { Category, CustomLocales } from "@/services/interface/type";
import {  pageRoutes } from "../../_type/constant";
import { categories_content_list } from "../../_type/query-key";
import SearchingArea from "../../_components/whiteBlockSearch";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import { categoryColumns } from "./_components/categoryColumns";
import { useAction } from "next-safe-action/hooks";
import { useMessageStore } from "@/hooks/useMessageStore";

export default function AdminCategoriesPage() {
  const { success, error } = useMessageStore();
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
  console.log({ data });

  const totalCount = data?.paginations.dataCount ?? 0;
  const page = data?.paginations.page ?? 1;
  const pageSize = data?.paginations.pageSize ?? 12;
  const totalPages = data?.paginations.totalPages ?? 1;

  const { execute: deleteData } = useAction(deleteCategory, {
    onSuccess: () => {
      success("Category deleted successfully");
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
        title="Main Pages"
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
        <AdminTable<Category>
          onDelete={handleDelete}
          columns={categoryColumns}
          page={pageRoutes.categories.root}
          dataItems={(data?.data ?? []) as unknown as Category[]}
          isError={isError}
          refetch={refetch}
          locale={locale}
          invalidateQueryKey={categories_content_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.categories.updateContent({ id })}
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
