"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import {
  LuFile,
  LuImage,
  LuLoader,
  LuCircleAlert,
  LuUpload,
  LuX,
} from "react-icons/lu";
import { useDeleteData, usePostData } from "@/hooks/useApi";
import type { FileType } from "@/services/interface/type";
import { parseAccept } from "@/utils/parseUploadAccept";
import ReactFancyBox from "@/lib/fancybox";

interface DefaultPreview {
  name: string;
  url: string;
  mimeType?: string;
}

interface SingleUploadProps {
  fieldName: string;
  label?: string;
  acceptType?: string;
  defaultPreview?: DefaultPreview;
  onRemoveSuccess?: () => void;
}

type UploadPreview = {
  name: string;
  url?: string;
  mimeType?: string;
};

const SingleUploadImage: React.FC<SingleUploadProps> = ({
  fieldName,
  label = "Upload file",
  acceptType = "image/*",
  defaultPreview,
  onRemoveSuccess,
}) => {
  const {
    setValue,
    watch,
    formState: { isSubmitSuccessful },
  } = useFormContext();

  const fileId = watch(fieldName) as number | null | undefined;
  const [preview, setPreview] = useState<UploadPreview | null>(
    defaultPreview ?? null,
  );
  const [error, setError] = useState<string | null>(null);

  const CF_PUBLIC_URL = process.env.NEXT_PUBLIC_CF_PUBLIC_ACCESS_URL ?? "";

  const { mutate: uploadFile, isPending: isUploading } = usePostData<
    { data: FileType },
    FormData
  >();
  const { mutate: unpublishFile, isPending: isRemoving } = useDeleteData<{
    message: string;
  }>();

  const setFileId = useCallback(
    (id: number | null) => {
      setValue(fieldName, id, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [fieldName, setValue],
  );

  useEffect(() => {
    if (isSubmitSuccessful) {
      setPreview(null);
      setError(null);
    }
  }, [isSubmitSuccessful]);

  const uploadSelectedFile = useCallback(
    (file: File) => {
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      uploadFile(
        { endpoint: "files/upload-file", payload: formData },
        {
          onSuccess: (response) => {
            const data = response.data;
            const id = Number(data.fileId ?? data.id);

            setFileId(id);
            setPreview({
              name: data.originalName ?? file.name,
              url: data.relativePath ?? data.publicUrl ?? undefined,
              mimeType: data.mimeType ?? file.type,
            });
          },
          onError: (err) => {
            setError(
              (err as Error).message ||
                "An error occurred while uploading the file",
            );
            setFileId(null);
            setPreview(null);
          },
        },
      );
    },
    [setFileId, uploadFile],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) uploadSelectedFile(file);
    },
    [uploadSelectedFile],
  );

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
      const rejection = fileRejections[0];
      const message = rejection?.errors[0]?.message;

      setError(
        message
          ? `File rejected: ${message}`
          : "Unsupported file type. Please check the allowed format.",
      );
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    multiple: false,
    disabled: isUploading || isRemoving,
    accept: parseAccept(acceptType),
  });

  const handleRemove = () => {
    if (!fileId) {
      setPreview(null);
      setFileId(null);
      return;
    }

    unpublishFile(
      { endpoint: `files/delete-file/${fileId}` },
      {
        onSuccess: () => {
          setPreview(null);
          setFileId(null);
          setError(null);
          onRemoveSuccess?.();
        },
        onError: () => {
          setError("An error occurred while deleting the file");
        },
      },
    );
  };

  const getFullUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("blob:")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${CF_PUBLIC_URL}${cleanPath}`;
  };

  const isBusy = isUploading || isRemoving;
  const showPreview = Boolean(preview || fileId);
  const isImage =
    preview?.mimeType?.startsWith("image/") ||
    Boolean(preview?.url?.match(/\.(jpe?g|png|gif|webp|svg)$/i));

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}
          ${isBusy ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />
        <LuUpload className="mx-auto mb-4 text-blue-500" size={40} />
        <p className="text-gray-700 font-medium mb-1">{label}</p>
        <p className="text-sm text-gray-500">
          {isUploading ? "Uploading..." : "Select a file or drag and drop it here"}
        </p>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-500 flex items-center gap-2">
          <LuCircleAlert size={16} />
          {error}
        </p>
      )}

      {showPreview && preview && (
        <div className="mt-5 p-4 border border-gray-200 bg-gray-50 rounded-lg flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {isImage && preview.url ? (
              <img
                src={getFullUrl(preview.url)}
                alt={preview.name}
                className="w-14 h-14 object-cover rounded border border-gray-200"
              />
            ) : (
              <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded border border-blue-200">
                <LuFile className="text-blue-500" size={24} />
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {preview.name}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {isUploading && "Uploading..."}
                {!isUploading && !isRemoving && "Successfully uploaded"}
                {isRemoving && "Deleting..."}
              </p>
            </div>
          </div>

          <ReactFancyBox className="flex items-center gap-2">
            {isBusy ? (
              <LuLoader className="w-5 h-5 animate-spin text-blue-500" />
            ) : (
              <>
                {isImage && preview.url && (
                  <a
                    href={getFullUrl(preview.url)}
                    target="_blank"
                    rel="noreferrer"
                    data-fancybox="gallery"
                    className="px-3 py-1.5 border border-gray-300 rounded text-sm text-blue-600 hover:bg-blue-50"
                  >
                    <LuImage size={16} className="inline mr-1" />
                    Preview
                  </a>
                )}
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 border border-red-300 rounded text-sm text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </>
            )}
          </ReactFancyBox>
        </div>
      )}

      {showPreview && !preview && fileId && (
        <div className="mt-5 p-4 border border-gray-200 bg-gray-50 rounded-lg flex items-center justify-between">
          <p className="text-sm text-gray-700">Selected file ID: {fileId}</p>
          <button
            type="button"
            onClick={handleRemove}
            className="p-2 hover:bg-red-100 rounded-full"
          >
            <LuX className="text-red-500" size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SingleUploadImage;