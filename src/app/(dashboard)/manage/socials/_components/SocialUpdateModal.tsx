"use client";
import { useEffect } from "react";
import { Modal, Spin, Space } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { social_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { useServerQuery } from "@/hooks/useServerActions";
import {
  getSocialById,
  updateSocial,
} from "@/actions/client/socials/socials.controller";
import { Social } from "@/services/interface/type";
import {
  UpdateSocialInput,
  updateSocialSchema,
} from "@/actions/client/socials/social.schema";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import FormSelect from "@/globalElement/form/FormSelect";
import { availableIcons, renderSocialIcon } from "@/utils/renderSocialIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  socialDocumentId: string | null;
  onSuccess: () => void;
}

export default function SocialUpdateModal({
  isOpen,
  onClose,
  socialDocumentId,
  onSuccess,
}: Props) {
  const { data: socialData, isLoading } = useServerQuery(
    `social-${socialDocumentId}`,
    () => getSocialById({ id: socialDocumentId as string }),
    {
      params: {},
      enabled: !!socialDocumentId && isOpen,
    },
  );

  const social = socialData?.data as Social | undefined;

  const generalForm = useForm<UpdateSocialInput>({
    resolver: zodResolver(updateSocialSchema),
    values: {
      id: social?.id,
      socialName: social?.socialName || null,
      socialLink: social?.socialLink || null,
      iconName: social?.iconName || null,
    },
  });

  const { handleSubmit, reset } = generalForm;

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const { execute, isExecuting } = useAction(updateSocial, {
    queryKey: social_list,
    onSuccess: () => {
      reset();
      onClose();
      onSuccess();
    },
  });

  const onSubmit = async (data: UpdateSocialInput) => {
    execute(data);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={<div className="text-xl font-semibold">Edit Social Network</div>}
      open={isOpen}
      confirmLoading={isExecuting}
      width={650}
      okText="Update"
      footer={null}
      cancelText="Cancel"
      okButtonProps={{
        size: "large",
        className: "h-10",
      }}
      cancelButtonProps={{
        size: "large",
        className: "h-10",
      }}
    >
      {isLoading ? (
        <div className="flex justify-center items-center p-16">
          <Space orientation="vertical" align="center" size="large">
            <Spin size="large" />
            <p className="text-gray-500">Loading...</p>
          </Space>
        </div>
      ) : (
        <FormWrapper
          methods={generalForm}
          schema={updateSocialSchema}
          onSubmit={onSubmit}
          className="space-y-5 mt-6"
        >
          <FieldBlock>
            {/* Social Name */}
            <div>
              <FormInput
                label="Social Network Name"
                placeholder="e.g. Facebook, Instagram"
                fieldName="socialName"
              />
            </div>

            {/* Social Link */}
            <div>
              <FormInput
                label="Link"
                type="url"
                placeholder="https://facebook.com/yourpage"
                fieldName="socialLink"
              />
            </div>

            {/* Icon Selection */}
            <div>
              <FormSelect
                fieldName="iconName"
                optionFilterProp="label"
                filterOption={(input, option) =>
                  (option?.label as string)
                    ?.toLowerCase()
                    .includes(input.toLowerCase())
                }
                placeholder="Select icon"
                className="w-full"
                size="large"
                showSearch
                options={availableIcons}
              />
            </div>

            {generalForm.watch("iconName") && (
              <div className="bg-linear-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Icon Preview:
                </p>
                <div className="flex items-center justify-center">
                  <div className="w-20 h-20 bg-white rounded-xl shadow-md flex items-center justify-center">
                    <div className="w-12 h-12 flex items-center justify-center text-blue-600">
                      {renderSocialIcon({
                        iconName: generalForm.watch("iconName") || "",
                        fill: "currentColor",
                      })}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 text-center mt-3 font-mono">
                  {generalForm.watch("iconName")}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isExecuting}
                className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
              >
                {isExecuting && (
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                )}
                {isExecuting ? "Updating..." : "Update"}
              </button>
            </div>
          </FieldBlock>

          {/* Info Note */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-yellow-800">
              💡 <strong>Note:</strong> Click Update to save your changes
            </p>
          </div>
        </FormWrapper>
      )}
    </Modal>
  );
}
