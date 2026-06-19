"use client";
import { Card, Button, Popconfirm, Tag, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, LinkOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAction } from "next-safe-action/hooks";
import { useMessageStore } from "@/hooks/useMessageStore";
import { deleteSocial } from "@/actions/client/socials/socials.controller";
import { Social } from "@/services/interface/type";
import { renderSocialIcon } from "@/utils/renderSocialIcon";

interface Props {
  social: Social;
  onEdit: () => void;
  onRefetch: () => void;
}

export default function SocialCard({ social, onEdit, onRefetch }: Props) {
  const { success, error } = useMessageStore();

  const { execute: deleteData, isExecuting: isDeleting } = useAction(
    deleteSocial,
    {
      onSuccess: () => {
        success("Sosial şəbəkə uğurla silindi!");
        onRefetch();
      },
    },
  );

  const handleDelete = async () => {
    deleteData({ id: social?.id });
  };

  return (
    <Card
      className="group relative overflow-hidden border border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300"
      styles={{ body: { padding: "20px" } }}
    >
      {/* Status Badge - Top Right */}
      <div className="absolute top-3 right-3">
        <Tag
          color={social.status === "published" ? "success" : "default"}
          className="m-0"
        >
          {social.status === "published" ? "Aktiv" : "Deaktiv"}
        </Tag>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center pt-2">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-linear-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
          <div className="w-12 h-12 flex items-center justify-center text-blue-600">
            {renderSocialIcon({
              iconName: social.iconName,
            })}
          </div>
        </div>

        {/* Name */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
          {social.socialName}
        </h3>

        {/* Link */}
        <Tooltip title={social.socialLink}>
          <Link
            href={social.socialLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-blue-600 flex items-center gap-1 max-w-full truncate mb-4"
          >
            <LinkOutlined className="text-xs shrink-0" />
            <span className="truncate">{social.socialLink}</span>
          </Link>
        </Tooltip>

        {/* Actions */}
        <div className="flex gap-2 w-full pt-3 border-t border-gray-100">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={onEdit}
              className="flex-1 text-blue-600 hover:text-blue-700"
            />
          </Tooltip>

          <Popconfirm
            title="Are you sure?"
            description="This action cannot be undone."
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                loading={isDeleting}
                className="flex-1"
              />
            </Tooltip>
          </Popconfirm>
        </div>
      </div>
    </Card>
  );
}
