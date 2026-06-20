"use client";
import { Suspense } from "react";
import { Pagination, Spin } from "antd";
import AdminTable from "@/app/(dashboard)/_components/AdminTable";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import type { BranchItem, CustomLocales } from "@/services/interface/type";
import { pageModels, pageRoutes } from "../../_type/constant";
import { branches_list } from "../../_type/query-key";
import SearchingArea from "../../_components/whiteBlockSearch";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import { useAction } from "next-safe-action/hooks";
import { useMessageStore } from "@/hooks/useMessageStore";
import {
  deleteBranch,
  getBranches,
} from "@/actions/client/branches/branches.controller";
import { Columns } from "./Columns";

export default function AdminBranchesPage() {
  const { success, error } = useMessageStore();
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    branches_list,
    getBranches,
    {
      params: {
        page: queryParams.page,
        pageSize: queryParams.pageSize,
        query: queryParams.title,
        locale: locale as CustomLocales,
      },
    },
  );
  const totalCount = data?.paginations.dataCount ?? 0;
  const page = data?.paginations.page ?? 1;
  const pageSize = data?.paginations.pageSize ?? 12;
  const totalPages = data?.paginations.totalPages ?? 1;

  const { execute: deleteData } = useAction(deleteBranch, {
    onSuccess: () => {
      success("Branch deleted successfully");
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
      <WhiteBlockTitleArea title="Branches" link={pageRoutes.branches.create} />
      <SearchingArea link={pageRoutes.branches.link} />
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        }
      >
        <AdminTable<BranchItem>
          onDelete={handleDelete}
          columns={Columns}
          page={pageRoutes.branches.root}
          model={pageModels.branches}
          dataItems={(data?.data ?? []) as unknown as BranchItem[]}
          isError={isError}
          refetch={refetch}
          sortable={true}
          locale={locale}
          invalidateQueryKey={branches_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.branches.updateContent({ id })}
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
