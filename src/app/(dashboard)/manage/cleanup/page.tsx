"use client";

import { Suspense } from "react";
import { Spin } from "antd";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import {
  QueryTabs,
  TabsBody,
  TabsList,
  TabsTitle,
} from "../../_components/tabs/QueryTabs";
import { useServerQuery } from "@/hooks/useServerActions";
import { getCleanupStatsQuery } from "@/actions/cleanup/cleanup.queries";
import SoftDeletedTab from "./_components/SoftDeletedTab";
import UnpublishedFilesTab from "./_components/UnpublishedFilesTab";

const CLEANUP_STATS_KEY = "cleanup-stats";

function CleanupContent() {
  const { data: stats, isLoading, isError, refetch } = useServerQuery(
    CLEANUP_STATS_KEY,
    getCleanupStatsQuery,
    { params: {} },
  );

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-lg font-semibold text-red-600">Something went wrong</p>
        <p className="mt-2 text-sm text-red-500">
          Failed to load cleanup statistics
        </p>
      </div>
    );
  }

  return (
    <QueryTabs defaultTab="deleted" queryParam="tab">
      <TabsList variant="pills" className="mb-2">
        <TabsTitle value="deleted">
          Soft-deleted records ({stats?.totalDeletedItems ?? 0})
        </TabsTitle>
        <TabsTitle value="files">
          Unpublished files ({stats?.unpublishedFileCount ?? 0})
        </TabsTitle>
      </TabsList>

      <TabsBody value="deleted">
        <SoftDeletedTab
          stats={stats}
          isLoading={isLoading}
          onRefresh={refetch}
        />
      </TabsBody>

      <TabsBody value="files">
        <UnpublishedFilesTab onRefreshStats={refetch} />
      </TabsBody>
    </QueryTabs>
  );
}

export default function CleanupPage() {
  return (
    <>
      <WhiteBlockTitleArea title="System Cleanup" disabled />

      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        }
      >
        <CleanupContent />
      </Suspense>
    </>
  );
}
