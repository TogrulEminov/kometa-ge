"use client";

import { useState } from "react";
import {
  Button,
  Empty,
  Input,
  Modal,
  Pagination,
  Select,
  Spin,
  Table,
  Tag,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  deleteFormSubmission,
  getFormSubmissions,
  updateFormSubmissionStatus,
} from "@/actions/client/form-submissions/form-submissions.controller";
import { form_submissions_list } from "../../_type/query-key";
import { useAction, useServerQuery } from "@/hooks/useServerActions";
import { FormStatus, FormType } from "@/generated/prisma/enums";
import type { FormSubmissionModel } from "@/services/interface/type";
import { Columns } from "./Columns";

const TYPE_LABELS: Record<FormType, string> = {
  CONTACT: "Contact",
  HERO_BOOKING: "Hero Booking",
  SHIPMENT_MODAL: "Shipment Modal",
};

const STATUS_COLORS: Record<FormStatus, string> = {
  NEW: "red",
  READ: "blue",
  ARCHIVED: "default",
};

export default function FormSubmissionsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FormType | undefined>();
  const [statusFilter, setStatusFilter] = useState<FormStatus | undefined>();
  const [selected, setSelected] = useState<FormSubmissionModel | null>(null);

  const { data, isLoading, isError, refetch } = useServerQuery(
    form_submissions_list,
    getFormSubmissions,
    {
      params: {
        page,
        pageSize: 20,
        query: search,
        type: typeFilter,
        status: statusFilter,
      },
    },
  );

  const { execute: updateStatus } = useAction(updateFormSubmissionStatus, {
    queryKey: form_submissions_list,
  });

  const { execute: deleteSubmission } = useAction(deleteFormSubmission, {
    queryKey: form_submissions_list,
  });

  const submissions = (data?.data ?? []) as FormSubmissionModel[];
  const pagination = data?.paginations;

  const handleSearch = () => {
    setPage(1);
    setSearch(query.trim());
  };

  const handleMarkRead = async (id: string) => {
    await updateStatus({ id, status: FormStatus.READ });
    if (selected?.id === id) {
      setSelected((prev) =>
        prev ? { ...prev, status: FormStatus.READ } : null,
      );
    }
  };

  const handleArchive = async (id: string) => {
    await updateStatus({ id, status: FormStatus.ARCHIVED });
    if (selected?.id === id) {
      setSelected((prev) =>
        prev ? { ...prev, status: FormStatus.ARCHIVED } : null,
      );
    }
  };

  const handleDelete = async (id: string) => {
    await deleteSubmission({ id });
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Form Messages</h1>
        <p className="mt-1 text-gray-600">
          Contact, hero booking and shipment modal submissions
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search email, name, phone..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={handleSearch}
          prefix={<SearchOutlined />}
          style={{ width: 280 }}
        />
        <Select
          allowClear
          placeholder="Type"
          style={{ width: 180 }}
          value={typeFilter}
          onChange={(v) => {
            setTypeFilter(v);
            setPage(1);
          }}
          options={Object.values(FormType).map((t) => ({
            label: TYPE_LABELS[t],
            value: t,
          }))}
        />
        <Select
          allowClear
          placeholder="Status"
          style={{ width: 140 }}
          value={statusFilter}
          onChange={(v) => {
            setStatusFilter(v);
            setPage(1);
          }}
          options={Object.values(FormStatus).map((s) => ({
            label: s,
            value: s,
          }))}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>

      <div className="rounded-lg bg-white p-4 shadow-md">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Spin size="large" />
          </div>
        ) : isError ? (
          <Empty description="Failed to load messages">
            <Button type="primary" onClick={() => refetch()}>
              Retry
            </Button>
          </Empty>
        ) : (
          <Table
            rowKey="id"
            dataSource={submissions}
            columns={Columns({
              onView: setSelected,
              onMarkRead: handleMarkRead,
              onArchive: handleArchive,
              onDelete: handleDelete,
              typeLabels: TYPE_LABELS,
              statusColors: STATUS_COLORS,
            })}
            pagination={false}
            onRow={(record) => ({
              onClick: () => setSelected(record),
              className: "cursor-pointer",
            })}
          />
        )}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            current={page}
            total={pagination.dataCount}
            pageSize={pagination.pageSize}
            onChange={setPage}
          />
        </div>
      )}

      <Modal
        open={!!selected}
        onCancel={() => setSelected(null)}
        footer={null}
        title="Message detail"
        width={640}
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Tag color="purple">{TYPE_LABELS[selected.type]}</Tag>
              <Tag color={STATUS_COLORS[selected.status]}>{selected.status}</Tag>
              {selected.locale && <Tag>{selected.locale}</Tag>}
            </div>
            <p className="text-sm text-gray-500">
              {new Date(selected.createdAt).toLocaleString()}
              {selected.ipAddress && ` · IP: ${selected.ipAddress}`}
            </p>
            <pre className="max-h-80 overflow-auto rounded-lg bg-gray-50 p-4 text-sm whitespace-pre-wrap">
              {JSON.stringify(selected.payload, null, 2)}
            </pre>
            <div className="flex flex-wrap gap-2 pt-2">
              {selected.status === FormStatus.NEW && (
                <Button onClick={() => handleMarkRead(selected.id)}>
                  Mark as read
                </Button>
              )}
              {selected.status !== FormStatus.ARCHIVED && (
                <Button onClick={() => handleArchive(selected.id)}>
                  Archive
                </Button>
              )}
              <Button danger onClick={() => handleDelete(selected.id)}>
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
