"use client";

import { useState } from "react";
import { Button, Empty, Input, Pagination, Select, Spin, Table } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import {
  deleteFormSubmission,
  getFormSubmissions,
} from "@/actions/client/form-submissions/form-submissions.controller";
import { form_submissions_list } from "../../_type/query-key";
import { useAction, useServerQuery } from "@/hooks/useServerActions";
import { FormType } from "@/generated/prisma/enums";
import type { FormSubmissionModel } from "@/services/interface/type";
import { Columns } from "./Columns";

const TYPE_LABELS: Record<FormType, string> = {
  CONTACT: "Contact",
  HERO_BOOKING: "Hero Booking",
  SHIPMENT_MODAL: "Shipment Modal",
};

type Payload = Record<string, string | undefined>;

function renderPayloadDetails(payload: unknown) {
  const data = (payload ?? {}) as Payload;
  const rows = [
    ["Name", [data.name, data.surname].filter(Boolean).join(" ")],
    ["Email", data.email],
    ["Phone", data.phone || data.telephone],
    ["Pickup", data.from],
    ["Delivery", data.to],
    ["Message", data.message],
  ].filter(([, value]) => value);

  return (
    <div className="grid gap-2 py-2 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label} className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {label}
          </p>
          <p className="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default function FormSubmissionsPage() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<FormType | undefined>();

  const { data, isLoading, isError, refetch } = useServerQuery(
    form_submissions_list,
    getFormSubmissions,
    {
      params: {
        page,
        pageSize: 20,
        query: search,
        type: typeFilter,
      },
    },
  );

  const { execute: deleteSubmission } = useAction(deleteFormSubmission, {
    queryKey: form_submissions_list,
  });

  const submissions = (data?.data ?? []) as FormSubmissionModel[];
  const pagination = data?.paginations;

  const handleSearch = () => {
    setPage(1);
    setSearch(query.trim());
  };

  const handleDelete = async (id: string) => {
    await deleteSubmission({ id });
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
              onDelete: handleDelete,
              typeLabels: TYPE_LABELS,
            })}
            pagination={false}
            expandable={{
              expandedRowRender: (record) => renderPayloadDetails(record.payload),
            }}
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
    </div>
  );
}
