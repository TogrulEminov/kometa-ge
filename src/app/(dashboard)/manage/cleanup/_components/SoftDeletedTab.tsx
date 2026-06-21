"use client";

import { useMemo, useState } from "react";
import { Spin } from "antd";
import { FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { LuHardDrive } from "react-icons/lu";
import { useAction } from "next-safe-action/hooks";
import { useMessageStore } from "@/hooks/useMessageStore";
import { purgeAllDeletedAction, purgeModuleDeletedAction } from "@/actions/cleanup/cleanup.action";
import type { CleanupModuleKey } from "@/lib/cleanup/cleanup.types";
import type { CleanupStats } from "@/services/cleanup.service";

interface Props {
  stats?: CleanupStats;
  isLoading: boolean;
  onRefresh: () => void;
}

export default function SoftDeletedTab({ stats, isLoading, onRefresh }: Props) {
  const { success, error } = useMessageStore();
  const [purgingModule, setPurgingModule] = useState<CleanupModuleKey | null>(
    null,
  );
  const [isPurgingAll, setIsPurgingAll] = useState(false);

  const { execute: purgeModule } = useAction(purgeModuleDeletedAction, {
    onSuccess: ({ data: result }) => {
      if (!result) return;
      success(
        `${result.label}: ${result.deletedRecords} records and ${result.deletedFiles} files deleted`,
      );
      onRefresh();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "Cleanup failed");
    },
  });

  const { execute: purgeAll } = useAction(purgeAllDeletedAction, {
    onSuccess: ({ data: result }) => {
      if (!result) return;
      success(`${result.totalDeletedRecords} soft-deleted records cleaned up`);
      onRefresh();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "Bulk cleanup failed");
    },
  });

  const hasDeletedItems = useMemo(
    () => (stats?.totalDeletedItems ?? 0) > 0,
    [stats?.totalDeletedItems],
  );

  const handlePurgeModule = async (moduleKey: CleanupModuleKey) => {
    setPurgingModule(moduleKey);
    try {
      await purgeModule({ moduleKey });
    } finally {
      setPurgingModule(null);
    }
  };

  const handlePurgeAll = async () => {
    setIsPurgingAll(true);
    try {
      await purgeAll();
    } finally {
      setIsPurgingAll(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-700">
            Soft-deleted records
          </p>
          <p className="text-xs text-slate-500">
            {stats?.totalDeletedItems ?? 0} deleted items
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="inline-flex size-10 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all hover:border-blue-500 hover:text-blue-600 disabled:opacity-50"
            aria-label="Refresh"
          >
            <FiRefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={handlePurgeAll}
            disabled={isPurgingAll || !hasDeletedItems}
            className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiTrash2 className="h-4 w-4" />
            {isPurgingAll ? "Cleaning up..." : "Clean up all"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spin size="large" />
        </div>
      ) : (
        <div className="space-y-3">
          {stats?.modules.map((module) => (
            <div
              key={module.key}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                  <LuHardDrive className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    {module.label}
                  </p>
                  <p className="text-sm text-slate-500">
                    {module.label}:{" "}
                    <span className="font-medium text-slate-700">
                      {module.deletedCount}
                    </span>{" "}
                    deleted items
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  handlePurgeModule(module.key as CleanupModuleKey)
                }
                disabled={
                  module.deletedCount === 0 || purgingModule === module.key
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <FiTrash2 className="h-4 w-4" />
                {purgingModule === module.key
                  ? "Cleaning up..."
                  : "Clean deleted items"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
