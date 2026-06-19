"use client";
import { Modal } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAction } from "next-safe-action/hooks";
import {
  CreateSocialInput,
  createSocialSchema,
} from "@/actions/client/socials/social.schema";
import { createSocial } from "@/actions/client/socials/socials.controller";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import FormSelect from "@/globalElement/form/FormSelect";
import { availableIcons, renderSocialIcon } from "@/utils/renderSocialIcon";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function SocialCreateModal({
  isOpen,
  onClose,
  onSuccess,
}: Props) {
  const generalForm = useForm<CreateSocialInput>({
    resolver: zodResolver(createSocialSchema),
    defaultValues: {
      socialName: "",
      socialLink: "",
      iconName: "",
    },
  });

  const { handleSubmit, reset } = generalForm;

  const { execute, isExecuting } = useAction(createSocial, {
    onSuccess: () => {
      reset();
      onClose();
      onSuccess();
    },
  });

  const onSubmit = async (data: CreateSocialInput) => {
    execute(data);
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold">Add New Social Network</div>
      }
      open={isOpen}
      onCancel={handleCancel}
      width={650}
      okText="Create"
      cancelText="Cancel"
      footer={[]}
      okButtonProps={{
        size: "large",
        className: "h-10",
      }}
      cancelButtonProps={{
        size: "large",
        className: "h-10",
      }}
    >
      <FormWrapper
        schema={createSocialSchema}
        onSubmit={onSubmit}
        methods={generalForm}
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
              placeholder="https://facebook.com/yourpage"
              fieldName="socialLink"
            />
          </div>

          {/* Icon Selection */}
          <div>
            <FormSelect
              fieldName="iconName"
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
                      iconName: generalForm.watch("iconName")!,
                      width: 24,
                      height: 24,
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
              {isExecuting ? "Creating..." : "Create"}
            </button>
          </div>
        </FieldBlock>

        {/* Info Note */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Tip:</strong> Enter the full URL starting with https://
          </p>
        </div>
      </FormWrapper>
    </Modal>
  );
}
