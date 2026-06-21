"use client";

import { useMemo, useState } from "react";
import { Checkbox, Empty, Popconfirm, Spin } from "antd";
import { FiExternalLink, FiRefreshCw, FiTrash2 } from "react-icons/fi";
import { LuFile, LuFileImage } from "react-icons/lu";
import { useAction } from "next-safe-action/hooks";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useServerQuery } from "@/hooks/useServerActions";
import {
  cleanupUnpublishedFilesAction,
  deleteUnpublishedFilesAction,
} from "@/actions/cleanup/cleanup.action";
import { getUnpublishedFilesQuery } from "@/actions/cleanup/cleanup.queries";
import type { UnpublishedFileItem } from "@/actions/client/delete/cleanup.service";
import { getForCards } from "@/utils/getFullimageUrl";
import ReactFancyBox from "@/lib/fancybox";

const UNPUBLISHED_FILES_KEY = "unpublished-files-list";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageMime(mimeType: string): boolean {
  return mimeType.startsWith("image/");
}

interface Props {
  onRefreshStats: () => void;
}

export default function UnpublishedFilesTab({ onRefreshStats }: Props) {
  const { success, error } = useMessageStore();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [isDeletingSelected, setIsDeletingSelected] = useState(false);

  const { data: files, isLoading, isError, refetch } = useServerQuery(
    UNPUBLISHED_FILES_KEY,
    getUnpublishedFilesQuery,
    { params: {} },
  );

  const fileList = (files ?? []) as UnpublishedFileItem[];

  const { execute: deleteFiles } = useAction(deleteUnpublishedFilesAction, {
    onSuccess: ({ data: result }) => {
      if (!result) return;
      success(`${result.deletedFiles} files deleted`);
      setSelectedIds([]);
      refetch();
      onRefreshStats();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "Failed to delete file");
    },
  });

  const { execute: deleteAllFiles } = useAction(cleanupUnpublishedFilesAction, {
    onSuccess: ({ data: result }) => {
      if (!result) return;
      success(`${result.deletedFiles} unpublished files deleted`);
      setSelectedIds([]);
      refetch();
      onRefreshStats();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "File cleanup failed");
    },
  });

  const allSelected = useMemo(
    () =>
      fileList.length > 0 &&
      fileList.every((file) => selectedIds.includes(file.id)),
    [fileList, selectedIds],
  );

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
      return;
    }
    setSelectedIds(fileList.map((file) => file.id));
  };

  const toggleSelect = (fileId: number) => {
    setSelectedIds((current) =>
      current.includes(fileId)
        ? current.filter((id) => id !== fileId)
        : [...current, fileId],
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    setIsDeletingSelected(true);
    try {
      await deleteFiles({ fileIds: selectedIds });
    } finally {
      setIsDeletingSelected(false);
    }
  };

  const handleDeleteSingle = async (fileId: number) => {
    setDeletingIds((current) => [...current, fileId]);
    try {
      await deleteFiles({ fileIds: [fileId] });
    } finally {
      setDeletingIds((current) => current.filter((id) => id !== fileId));
    }
  };

  const handleDeleteAll = async () => {
    setIsDeletingAll(true);
    try {
      await deleteAllFiles();
    } finally {
      setIsDeletingAll(false);
    }
  };

  const refreshAll = () => {
    refetch();
    onRefreshStats();
  };

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-lg font-semibold text-red-600">Something went wrong</p>
        <p className="mt-2 text-sm text-red-500">
          Failed to load unpublished files
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 px-5 py-4">
        <p className="text-sm font-semibold text-amber-800">
          Review files before deleting
        </p>
        <p className="mt-1 text-xs text-amber-700">
          Only files with `published: false` are shown here. You can delete
          them individually or in bulk.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Checkbox checked={allSelected} onChange={toggleSelectAll}>
            Select all
          </Checkbox>
          <span className="text-sm text-slate-500">
            {fileList.length} files · {selectedIds.length} selected
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={refreshAll}
            disabled={isLoading}
            className="inline-flex size-10 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all hover:border-blue-500 hover:text-blue-600 disabled:opacity-50"
            aria-label="Refresh"
          >
            <FiRefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>

          <Popconfirm
            title="Delete selected files?"
            description="These files will also be removed from Cloudflare."
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeletingSelected }}
            onConfirm={handleDeleteSelected}
            disabled={selectedIds.length === 0}
          >
            <button
              type="button"
              disabled={selectedIds.length === 0 || isDeletingSelected}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-all hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2 className="h-4 w-4" />
              Delete selected
            </button>
          </Popconfirm>

          <Popconfirm
            title="Delete all unpublished files?"
            description="This action cannot be undone."
            okText="Delete all"
            cancelText="Cancel"
            okButtonProps={{ danger: true, loading: isDeletingAll }}
            onConfirm={handleDeleteAll}
            disabled={fileList.length === 0}
          >
            <button
              type="button"
              disabled={fileList.length === 0 || isDeletingAll}
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiTrash2 className="h-4 w-4" />
              {isDeletingAll ? "Deleting..." : "Delete all"}
            </button>
          </Popconfirm>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <Spin size="large" />
        </div>
      ) : fileList.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white py-16 shadow-sm">
          <Empty description="No unpublished files" />
        </div>
      ) : (
        <ReactFancyBox className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {fileList.map((file) => {
            const isSelected = selectedIds.includes(file.id);
            const isDeleting = deletingIds.includes(file.id);

            return (
              <div
                key={file.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-all ${
                  isSelected
                    ? "border-blue-300 ring-2 ring-blue-100"
                    : "border-slate-200/80"
                }`}
              >
                <div className="relative flex h-44 items-center justify-center bg-slate-100">
                  {isImageMime(file.mimeType) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getForCards(file)}
                      alt={file.originalName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <LuFile className="h-10 w-10" />
                      <span className="text-xs uppercase">{file.mimeType}</span>
                    </div>
                  )}

                  <div className="absolute left-3 top-3">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleSelect(file.id)}
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {file.originalName}
                    </p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {file.fileKey}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                    <span className="rounded-md bg-slate-100 px-2 py-1">
                      ID: {file.id}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-1">
                      {formatFileSize(file.fileSize)}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2 py-1">
                      {new Date(file.createdAt).toLocaleDateString("az-AZ")}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={getForCards(file)}
                      target="_blank"
                      data-fancybox={`file-${file.id}`}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <FiExternalLink className="h-4 w-4" />
                      View
                    </a>

                    <Popconfirm
                      title="Delete this file?"
                      description="It will also be removed from Cloudflare."
                      okText="Delete"
                      cancelText="Cancel"
                      okButtonProps={{ danger: true, loading: isDeleting }}
                      onConfirm={() => handleDeleteSingle(file.id)}
                    >
                      <button
                        type="button"
                        disabled={isDeleting}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-100 disabled:opacity-50"
                      >
                        <LuFileImage className="h-4 w-4" />
                        Delete
                      </button>
                    </Popconfirm>
                  </div>
                </div>
              </div>
            );
          })}
        </ReactFancyBox>
      )}
    </div>
  );
}
