"use client";
import { Suspense } from "react";
import { Pagination, Spin } from "antd";
import AdminTable from "@/app/(dashboard)/_components/AdminTable";
import { usePaginationQuery } from "@/hooks/usePaginationQuery";
import { useServerQuery } from "@/hooks/useServerActions";
import type { CustomLocales, Office } from "@/services/interface/type";
import { pageModels, pageRoutes } from "../../_type/constant";
import { offices_list } from "../../_type/query-key";
import SearchingArea from "../../_components/whiteBlockSearch";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import { useAction } from "@/hooks/useServerActions";
import { useMessageStore } from "@/hooks/useMessageStore";
import { Columns } from "./Columns";
import {
  deleteOffice,
  getOffices,
} from "@/actions/client/offices/offices.controller";

export default function AdminPage() {
  const { success, error } = useMessageStore();
  const { queryParams, handleChange, locale } = usePaginationQuery();
  const { data, isLoading, isError, refetch } = useServerQuery(
    offices_list,
    getOffices,
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

  const { execute: deleteData } = useAction(deleteOffice, {
    queryKey: offices_list,
    onSuccess: () => {
      success("Office deleted successfully");
    },
    onError: (err) => {
      const errMessage = err.error?.serverError ?? "Failed to delete office";
      error(errMessage ?? "Failed to delete office");
    },
  });
  const handleDelete = async (id: string) => {
    await deleteData({ id: id as string });
  };
  return (
    <div>
      <WhiteBlockTitleArea title="Offices" link={pageRoutes.offices.create} />
      <SearchingArea link={pageRoutes.offices.link} />
      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        }
      >
        <AdminTable<Office>
          onDelete={handleDelete}
          columns={Columns}
          page={pageRoutes.offices.root}
          model={pageModels.offices}
          dataItems={(data?.data ?? []) as unknown as Office[]}
          isError={isError}
          refetch={refetch}
          sortable={true}
          locale={locale}
          invalidateQueryKey={offices_list}
          isLoading={isLoading}
          updateLink={(id) => pageRoutes.offices.updateContent({ id })}
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
