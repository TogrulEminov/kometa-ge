import React from "react";
import Link from "next/link";

const NoDataInfo = ({ 
  title = "Add",
  link,
}: {
  title?: string;
  link?: string;
}) => {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-xl w-full bg-white rounded-2xl border-[4px] border-dashed border-slate-200 p-12">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-slate-100">
              <svg
                className="h-16 w-16 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 shadow-lg">
              <svg
                className="h-5 w-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">
              No data found
            </h2>
            <p className="max-w-sm text-sm text-slate-600">
              No data found in this section. To add new data, click the button below.
            </p>
          </div>

          {link && (
            <Link
              href={link}
              className="group inline-flex cursor-pointer items-center gap-3 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl"
            >
              <svg
                className="h-5 w-5 transition-transform group-hover:rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {title}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(NoDataInfo);
