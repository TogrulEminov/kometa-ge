"use client";

import { Suspense, useMemo, useState } from "react";
import { Spin, Table } from "antd";
import { BiPlus } from "react-icons/bi";
import { FiRefreshCw } from "react-icons/fi";
import { useAction } from "next-safe-action/hooks";
import WhiteBlockTitleArea from "../../_components/whiteBlockTitle";
import { User } from "@/services/interface/type";
import { deleteUser, getUsers } from "@/actions/auth/auth.action";
import { useAdminSession } from "@/app/(dashboard)/manage/AdminSessionProvider";
import { useMessageStore } from "@/hooks/useMessageStore";
import { useServerQuery } from "@/hooks/useServerActions";
import UserFormModal from "./_components/UserFormModal";
import ResetPasswordModal from "./_components/ResetPasswordModal";
import { getUserColumns } from "./_components/Columns";

const USERS_QUERY_KEY = "users-list";

export default function UsersPage() {
  const { success, error } = useMessageStore();
  const { session } = useAdminSession();
  const [modalOpen, setModalOpen] = useState(false);
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const currentUserId = session?.user?.id;
  const currentUserRole = session?.user?.role ?? undefined;

  const { data, isLoading, isError, refetch } = useServerQuery(
    USERS_QUERY_KEY,
    getUsers,
    { params: {} },
  );

  const users = (data ?? []) as User[];

  const { execute: deleteUserAction } = useAction(deleteUser, {
    onSuccess: () => {
      success("User deleted successfully");
      refetch();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "Failed to delete user");
    },
  });

  const openCreate = () => {
    setEditingUser(null);
    setModalOpen(true);
  };

  const openEdit = (user: User) => {
    setEditingUser(user);
    setModalOpen(true);
  };

  const openResetPassword = (user: User) => {
    setResetPasswordUser(user);
    setResetPasswordOpen(true);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteUserAction({ id });
    } finally {
      setDeletingId(null);
    }
  };

  const columns = useMemo(
    () =>
      getUserColumns({
        currentUserId,
        currentUserRole,
        onEdit: openEdit,
        onResetPassword: openResetPassword,
        onDelete: handleDelete,
        deletingId,
      }),
    [currentUserId, currentUserRole, deletingId],
  );

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-lg font-semibold text-red-600">Something went wrong</p>
        <p className="mt-2 text-sm text-red-500">
          Failed to load users
        </p>
      </div>
    );
  }

  return (
    <>
      <WhiteBlockTitleArea title="Users" disabled />

      <div className="mb-4 flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 shadow-sm">
        <div>
          <p className="text-sm font-semibold text-slate-700">Users</p>
          <p className="text-xs text-slate-500">{users.length} users</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading}
            className="inline-flex size-11 items-center justify-center rounded-xl border-2 border-gray-200 bg-white text-gray-600 transition-all hover:border-blue-500 hover:text-blue-600 hover:shadow-md disabled:opacity-50"
            aria-label="Refresh"
          >
            <FiRefreshCw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
          >
            <BiPlus className="h-5 w-5" />
            New user
          </button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        }
      >
        <div className="admin-table">
          <div className="admin-table__header">
            <div className="flex items-center gap-3">
              <span className="admin-table__title">User list</span>
              <span className="admin-table__badge">{users.length}</span>
            </div>
          </div>
          <Table<User>
            rowKey="id"
            columns={columns}
            dataSource={users}
            loading={isLoading || deletingId !== null}
            pagination={false}
            scroll={{ x: "max-content" }}
            size="middle"
          />
        </div>
      </Suspense>

      <UserFormModal
        isOpen={modalOpen}
        editingUser={editingUser}
        onClose={() => {
          setModalOpen(false);
          setEditingUser(null);
        }}
        onSuccess={refetch}
      />

      <ResetPasswordModal
        isOpen={resetPasswordOpen}
        user={resetPasswordUser}
        onClose={() => {
          setResetPasswordOpen(false);
          setResetPasswordUser(null);
        }}
      />
    </>
  );
}
