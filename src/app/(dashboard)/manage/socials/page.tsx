"use client";
import { useState } from "react";
import { Spin, Button, Empty, Input } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import SocialCard from "./_components/SocialCard";
import SocialCreateModal from "./_components/SocialCreateModal";
import SocialUpdateModal from "./_components/SocialUpdateModal";
import { social_list } from "../../_type/query-key";
import { useServerQuery } from "@/hooks/useServerActions";
import { getSocials } from "@/actions/client/socials/socials.controller";
import { Social } from "@/services/interface/type";

export default function SocialsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSocialId, setSelectedSocialId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch, isError } = useServerQuery(
    `${social_list}-${page}`,
    () =>
      getSocials({
        page,
        pageSize: 12,
      }),
    {
      params: {},
    },
  );

  const socials = (data?.data as Social[]) || [];
  const pagination = data?.paginations;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Social Networks</h1>

          <p className="text-gray-600 mt-1">Manage social media links</p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsCreateModalOpen(true)}
          size="large"
        >
          Add new social
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Empty
            description="An error occurred while loading the data."
            className="py-12"
          >
            <Button type="primary" onClick={() => refetch()}>
              Reload
            </Button>
          </Empty>
        ) : socials.length === 0 ? (
          <Empty
            description="No social networks found. Add your first social network!"
            className="py-12"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {socials.map((social) => (
              <SocialCard
                key={social.id}
                social={social}
                onEdit={() => setSelectedSocialId(social.id)}
                onRefetch={refetch}
              />
            ))}
          </div>
        )}
      </div>
      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <Button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            size="large"
          >
            Prev
          </Button>
          <span className="text-sm font-medium">
            Page {page} / {pagination.totalPages}
          </span>
          <Button
            disabled={page === pagination.totalPages}
            onClick={() => setPage(page + 1)}
            size="large"
          >
            Next
          </Button>
        </div>
      )}

      <SocialCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={refetch}
      />

      <SocialUpdateModal
        isOpen={!!selectedSocialId}
        socialDocumentId={selectedSocialId}
        onClose={() => setSelectedSocialId(null)}
        onSuccess={refetch}
      />
    </div>
  );
}
