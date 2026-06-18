"use client";
import React, { useState, useCallback } from "react";
import Link from "next/link";
import { Popover } from "antd";
import { LuPencil } from "react-icons/lu";

interface Props {
  link: string;
  documentId: string;
}

const UptadeButton = ({ link, documentId }: Props) => {
  const [editOpen, setEditOpen] = useState<string>("");

  const handleOpenChange = useCallback((documentId: string, open: boolean) => {
    setEditOpen(open ? documentId : "");
  }, []);

  const lang = [
    { label: "En", value: "en" },
    { label: "Ge", value: "ka" },
  ];
  return (
    <Popover
      content={
        <div className="flex flex-col gap-1">
          {lang?.map((l) => (
            <Link
              key={l.value}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
              href={`/${link}/${documentId}?locale=${l.value}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      }
      trigger="click"
      open={editOpen === documentId}
      onOpenChange={(open: boolean) => handleOpenChange(documentId, open)}
    >
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors cursor-pointer"
      >
        <LuPencil className="w-4 h-4" />
        Edit
      </button>
    </Popover>
  );
};

export default React.memo(UptadeButton);
