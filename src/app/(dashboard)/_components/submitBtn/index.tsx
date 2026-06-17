"use client";

import React, { useEffect, useRef, useState } from "react";
import { LuLoader, LuPlus, LuRefreshCw, LuX } from "react-icons/lu";

interface SubmitButtonProps {
  title?: string;
  isLoading: boolean;
  disabled?: boolean;
  onModalClose?: () => void;
}

const SubmitAdminButton: React.FC<SubmitButtonProps> = ({
  title,
  isLoading,
  disabled,
  onModalClose,
}) => {
  const isUpdate = Boolean(title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const prevLoadingRef = useRef(false);

  const isDisabled = disabled || isLoading;

  const closeModal = () => {
    setIsModalOpen(false);
    onModalClose?.();
  };

  useEffect(() => {
    if (!isUpdate) return;

    if (prevLoadingRef.current && !isLoading) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
        onModalClose?.();
      }, 400);
      return () => clearTimeout(timer);
    }

    prevLoadingRef.current = isLoading;
  }, [isLoading, isUpdate, onModalClose]);

  const buttonClass = `w-full py-3 px-6 rounded-lg font-medium text-white transition-all duration-200 ${
    isDisabled
      ? "bg-gray-400 cursor-not-allowed opacity-70"
      : "bg-blue-600 cursor-pointer hover:bg-blue-700 active:scale-[0.98]"
  }`;

  const label = isUpdate ? "Yenilə" : "Yarat";
  const loadingLabel = isUpdate ? "Yenilənir..." : "Yaradılır...";
  const Icon = isUpdate ? LuRefreshCw : LuPlus;

  if (!isUpdate) {
    return (
      <button
        type="submit"
        disabled={isDisabled}
        className={buttonClass}
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading ? (
            <LuLoader className="w-5 h-5 animate-spin" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
          {isLoading ? loadingLabel : label}
        </span>
      </button>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={isDisabled}
        className={buttonClass}
      >
        <span className="flex items-center justify-center gap-2">
          <Icon className="w-5 h-5" />
          {label}
        </span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Bağla"
            onClick={() => !isLoading && closeModal()}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            {!isLoading && (
              <button
                type="button"
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <LuX className="w-5 h-5" />
              </button>
            )}

            <h3 className="text-lg font-bold text-center text-gray-900 mb-2">
              Yeniləməyi təsdiqləyin
            </h3>
            <p className="text-center text-gray-600 mb-6 text-sm">
              Məlumatları yeniləmək istədiyinizdən əminsiniz?
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 cursor-pointer"
              >
                Ləğv et
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <LuLoader className="w-4 h-4 animate-spin" />
                    {loadingLabel}
                  </span>
                ) : (
                  "Bəli, təsdiq edirəm"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitAdminButton;
