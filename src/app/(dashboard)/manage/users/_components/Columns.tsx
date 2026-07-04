import { Popconfirm, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Role, User } from "@/services/interface/type";
import { LuKeyRound, LuPencil, LuTrash2 } from "react-icons/lu";

const roleColor: Record<string, string> = {
  [Role.ADMIN]: "red",
  [Role.MODERATOR]: "blue",
  [Role.USER]: "default",
};

interface ColumnsProps {
  currentUserId?: string;
  currentUserRole?: string;
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (id: string) => void;
  deletingId: string | null;
}

function getDeleteDisabledReason(
  record: User,
  currentUserId?: string,
  currentUserRole?: string,
): string | null {
  if (currentUserId && record.id === currentUserId) {
    return "You cannot delete your own account";
  }

  if (currentUserRole && record.role === currentUserRole) {
    return "You cannot delete a user with the same role";
  }

  return null;
}

export function getUserColumns({
  currentUserId,
  currentUserRole,
  onEdit,
  onResetPassword,
  onDelete,
  deletingId,
}: ColumnsProps): ColumnsType<User> {
  return [
    {
      title: "Name",
      key: "name",
      width: 220,
      render: (_, record) => (
        <div>
          <p className="font-medium text-slate-800">{record.name}</p>
          <p className="text-xs text-slate-400">{record.email}</p>
        </div>
      ),
    },
    {
      title: "Role",
      key: "role",
      width: 140,
      render: (_, record) => (
        <Tag color={roleColor[record.role] ?? "default"} className="font-semibold">
          {record.role?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Created at",
      key: "createdAt",
      width: 160,
      render: (_, record) =>
        record.createdAt
          ? new Date(record.createdAt).toLocaleDateString("en-US")
          : "—",
    },
    {
      title: "Actions",
      key: "actions",
      width: 320,
      render: (_, record) => {
        const deleteDisabledReason = getDeleteDisabledReason(
          record,
          currentUserId,
          currentUserRole,
        );
        const canDelete = !deleteDisabledReason;

        const deleteButton = (
          <button
            type="button"
            disabled={!canDelete || deletingId === record.id}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-all hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
          >
            <LuTrash2 className="h-4 w-4" />
            Delete
          </button>
        );

        return (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(record)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-all hover:border-blue-300 hover:bg-blue-100"
            >
              <LuPencil className="h-4 w-4" />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onResetPassword(record)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-medium text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-100"
            >
              <LuKeyRound className="h-4 w-4" />
              Reset password
            </button>

            {canDelete ? (
              <Popconfirm
                title="Delete this user?"
                description="This action cannot be undone."
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{
                  danger: true,
                  loading: deletingId === record.id,
                }}
                onConfirm={() => onDelete(record.id)}
              >
                {deleteButton}
              </Popconfirm>
            ) : (
              <Tooltip title={deleteDisabledReason}>
                <span>{deleteButton}</span>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];
}
