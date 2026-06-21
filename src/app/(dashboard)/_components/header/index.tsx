"use client";
import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  LuMenu,
  LuChevronDown,
  LuUser,
  LuLock,
  LuLogOut,
  LuUserPlus,
  LuShield,
} from "react-icons/lu";
import useOutSideClick from "@/hooks/useOutsideClick";
import { useToggleStore } from "@/lib/rich-editor/zustand/functions";
import { useLogout } from "@/hooks/useLogout";
import { useAdminSession } from "@/app/(dashboard)/manage/AdminSessionProvider";
import ChangePasswordModal from "./ChangePasswordModal";
import { pageRoutes } from "../../_type/constant";

const Header = () => {
  const ref = useRef(null);
  const { open, handleToggle: handleUserDrop, handleClose } = useOutSideClick({ ref: ref });
  const { session, isPending } = useAdminSession();
  const displayName = isPending ? "User" : session?.user?.name;
  const { logout, isLoggingOut } = useLogout();
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const handleLogout = () => {
    if (isLoggingOut) return;
    logout();
  };

  const toggle = useToggleStore((state) => state.toggle);

  return (
    <>
      <header className="fixed z-50 bg-blue-600 w-full h-16 px-6 flex items-center shadow-md">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => toggle("admin-sidebar")}
              className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <LuMenu className="w-5 h-5 text-white" />
            </button>
            <Link
              href={pageRoutes.dashboard.root}
              className="text-xl font-bold text-white font-poppins flex items-center gap-2"
            >
              <LuShield className="w-6 h-6" />
              Admin Panel
            </Link>
          </div>

          <div className="relative" ref={ref}>
            <button
              type="button"
              onClick={handleUserDrop}
              className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center">
                <LuUser className="w-5 h-5 text-blue-600" />
              </div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-semibold text-white">
                  {displayName}
                </span>
                <span className="text-xs text-blue-100">
                  {session?.user?.role}
                </span>
              </div>
              <LuChevronDown
                className={`w-4 h-4 text-white transition-transform ${
                  open ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500">{session?.user?.role}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPasswordModalOpen(true);
                    handleClose();
                  }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <LuLock className="w-4 h-4" />
                  Reset password
                </button>
                {session?.user?.role === "admin" && (
                  <Link
                    href="/manage/users"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={handleClose}
                  >
                    <LuUserPlus className="w-4 h-4" />
                    Manage users
                  </Link>
                )}
                <hr className="my-2 border-gray-200" />
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer w-full disabled:opacity-50"
                >
                  <LuLogOut className="w-4 h-4" />
                  {isLoggingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />
    </>
  );
};

export default React.memo(Header);
