"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import {
  LuCircleAlert,
  LuFile,
  LuLoader,
  LuUpload,
} from "react-icons/lu";
import { useDeleteData, usePostData } from "@/hooks/useApi";
import type { FileType } from "@/services/interface/type";
import { parseAccept } from "@/utils/parseUploadAccept";

interface DefaultFile {
  id: number;
  name: string;
  url: string;
  mimeType?: string;
}

interface MultiUploadProps {
  fieldName: string;
  label?: string;
  acceptType?: string;
  maxCount?: number;
  maxSize?: number;
  defaultFiles?: DefaultFile[];
}

type UploadItem = {
  uid: string;
  fileId?: number;
  name: string;
  url?: string;
  mimeType?: string;
  status: "uploading" | "done" | "error";
};

const MultiUploadImage: React.FC<MultiUploadProps> = ({
  fieldName,
  label = "Faylları Yüklə",
  acceptType = "image/*",
  maxCount = 10,
  maxSize = 10,
  defaultFiles = [],
}) => {
  const {
    setValue,
    getValues,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const [fileList, setFileList] = useState<UploadItem[]>(() =>
    defaultFiles.map((file) => ({
      uid: `existing-${file.id}`,
      fileId: file.id,
      name: file.name,
      url: file.url,
      mimeType: file.mimeType,
      status: "done",
    })),
  );
  const [error, setError] = useState<string | null>(null);

  const uploadQueueRef = useRef<File[]>([]);
  const isUploadingRef = useRef(false);
  const initializedRef = useRef(defaultFiles.length > 0);

  const CF_PUBLIC_URL = process.env.NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL ?? "";
  const maxBytes = maxSize * 1024 * 1024;

  const { mutate: uploadFile, isPending: isUploading } = usePostData<
    { data: FileType },
    FormData
  >();
  const { mutate: unpublishFile, isPending: isRemoving } =
    useDeleteData<{ message: string }>();

  const setFileIds = useCallback(
    (ids: number[]) => {
      setValue(fieldName, ids, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [fieldName, setValue],
  );

  useEffect(() => {
    if (!initializedRef.current || defaultFiles.length === 0) return;
    const currentIds = (getValues(fieldName) as number[] | undefined) ?? [];
    if (currentIds.length === 0) {
      setFileIds(defaultFiles.map((file) => file.id));
    }
  }, [defaultFiles, fieldName, getValues, setFileIds]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      setFileList([]);
      setError(null);
    }
  }, [isSubmitSuccessful]);

  const activeCount = fileList.filter((file) => file.status !== "error").length;
  const isBusy = isUploading || isRemoving;

  const processNextUpload = useCallback(() => {
    if (isUploadingRef.current || uploadQueueRef.current.length === 0) return;

    const file = uploadQueueRef.current.shift();
    if (!file) return;

    isUploadingRef.current = true;
    const tempUid = `upload-${Date.now()}-${file.name}`;

    setFileList((prev) => [
      ...prev,
      {
        uid: tempUid,
        name: file.name,
        mimeType: file.type,
        status: "uploading",
      },
    ]);

    const formData = new FormData();
    formData.append("file", file);

    uploadFile(
      { endpoint: "files/upload-file", payload: formData },
      {
        onSuccess: (response) => {
          const data = response.data;
          const id = Number(data.fileId ?? data.id);

          setFileList((prev) =>
            prev.map((item) =>
              item.uid === tempUid
                ? {
                    ...item,
                    status: "done",
                    fileId: id,
                    url: data.relativePath ?? data.publicUrl ?? undefined,
                    mimeType: data.mimeType ?? file.type,
                  }
                : item,
            ),
          );

          const currentIds = (getValues(fieldName) as number[] | undefined) ?? [];
          setFileIds([...currentIds, id]);

          isUploadingRef.current = false;
          processNextUpload();
        },
        onError: () => {
          setFileList((prev) =>
            prev.map((item) =>
              item.uid === tempUid ? { ...item, status: "error" } : item,
            ),
          );
          setError("Bəzi fayllar yüklənə bilmədi");
          isUploadingRef.current = false;
          processNextUpload();
        },
      },
    );
  }, [fieldName, getValues, setFileIds, uploadFile]);

  const queueFiles = useCallback(
    (files: File[]) => {
      setError(null);

      const validFiles = files.filter((file) => {
        if (file.size > maxBytes) {
          setError(`Fayl çox böyükdür (maks. ${maxSize}MB)`);
          return false;
        }
        return true;
      });

      const availableSlots = maxCount - activeCount;
      if (availableSlots <= 0) {
        setError(`Maksimum ${maxCount} fayl yükləyə bilərsiniz`);
        return;
      }

      const filesToUpload = validFiles.slice(0, availableSlots);
      if (!filesToUpload.length) return;

      uploadQueueRef.current.push(...filesToUpload);
      processNextUpload();
    },
    [activeCount, maxBytes, maxCount, maxSize, processNextUpload],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) queueFiles(acceptedFiles);
    },
    [queueFiles],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    disabled: isBusy || activeCount >= maxCount,
    accept: parseAccept(acceptType),
  });

  const handleRemove = (item: UploadItem) => {
    setFileList((prev) => prev.filter((file) => file.uid !== item.uid));

    if (!item.fileId) return;

    const nextIds = ((getValues(fieldName) as number[] | undefined) ?? []).filter(
      (id) => id !== item.fileId,
    );
    setFileIds(nextIds);

    unpublishFile(
      { endpoint: `files/delete-file/${item.fileId}` },
      {
        onError: () => setError("Silinərkən xəta baş verdi"),
      },
    );
  };

  const getFullUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${CF_PUBLIC_URL}${cleanPath}`;
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}
          ${isBusy || activeCount >= maxCount ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <LuUpload className="mx-auto mb-4 text-blue-500" size={40} />
        <p className="text-gray-700 font-medium">{label}</p>
        <p className="text-xs text-gray-400 mt-2">
          Maksimum {maxCount} fayl, hər biri {maxSize}MB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {activeCount}/{maxCount} yüklənib
        </p>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
          <LuCircleAlert size={16} />
          {error}
        </p>
      )}

      <div className="mt-5 flex flex-col gap-2.5">
        {fileList.map((file) => {
          const isImage =
            file.mimeType?.startsWith("image/") ||
            Boolean(file.url?.match(/\.(jpe?g|png|gif|webp|svg)$/i));

          return (
            <div
              key={file.uid}
              className={`p-3 border rounded-lg flex items-center justify-between gap-3
                ${file.status === "error" ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {file.status === "uploading" ? (
                  <LuLoader className="w-6 h-6 animate-spin text-blue-500 shrink-0" />
                ) : file.status === "error" ? (
                  <LuCircleAlert className="text-red-500 shrink-0" size={24} />
                ) : isImage && file.url ? (
                  <img
                    src={getFullUrl(file.url)}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded shrink-0"
                  />
                ) : (
                  <LuFile className="text-blue-500 shrink-0" size={24} />
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {file.status === "uploading" && "Yüklənir..."}
                    {file.status === "done" && "Uğurla yükləndi"}
                    {file.status === "error" && "Xəta baş verdi"}
                  </p>
                </div>
              </div>

              {file.status !== "uploading" && (
                <button
                  type="button"
                  onClick={() => handleRemove(file)}
                  disabled={isRemoving}
                  className="text-xs text-red-600 border border-red-300 px-3 py-1.5 rounded hover:bg-red-50 disabled:opacity-50"
                >
                  Sil
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiUploadImage;
