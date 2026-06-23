"use client";

import { useEffect } from "react";
import { Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "@/hooks/useServerActions";
import { LuCopy, LuRefreshCw } from "react-icons/lu";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import { resetOwnPasswordAction } from "@/actions/auth/auth.action";
import {
  resetOwnPasswordFormSchema,
  type ResetOwnPasswordFormInput,
} from "@/actions/auth/validation";
import { useMessageStore } from "@/hooks/useMessageStore";

const CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";

function generatePassword(length = 14): string {
  const arr = new Uint32Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((n) => CHARSET[n % CHARSET.length])
    .join("");
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  const { success, error } = useMessageStore();

  const form = useForm<ResetOwnPasswordFormInput>({
    resolver: zodResolver(resetOwnPasswordFormSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { control, reset, setValue, watch } = form;
  const passwordValue = watch("password");

  useEffect(() => {
    if (!isOpen) {
      reset({
        password: "",
        confirmPassword: "",
      });
    }
  }, [isOpen, reset]);

  const { execute, isExecuting } = useAction(resetOwnPasswordAction, {
    onSuccess: () => {
      success("Password reset successfully");
      reset();
      onClose();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "Failed to reset password");
    },
  });

  const handleGeneratePassword = () => {
    const pwd = generatePassword();
    setValue("password", pwd, { shouldDirty: true, shouldValidate: true });
    setValue("confirmPassword", pwd, { shouldDirty: true, shouldValidate: true });
    navigator.clipboard
      .writeText(pwd)
      .then(() => success("Password generated and copied"))
      .catch(() => success("Password generated"));
  };

  const handleCopyPassword = () => {
    if (!passwordValue) return;
    navigator.clipboard
      .writeText(passwordValue)
      .then(() => success("Password copied"))
      .catch(() => error("Failed to copy password"));
  };

  const onSubmit = (values: ResetOwnPasswordFormInput) => {
    execute({ password: values.password });
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold text-slate-800">
          Reset password
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      width={520}
    >
      <p className="mt-1 text-sm text-slate-500">
        Set a new password for your account. Current password is not required.
      </p>

      <FormWrapper
        methods={form}
        schema={resetOwnPasswordFormSchema}
        onSubmit={onSubmit}
        className="mt-6 space-y-5"
      >
        <FieldBlock>
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 space-y-3">
            <div>
              <p className="text-sm font-semibold text-slate-700">New password</p>
              <p className="text-xs text-slate-500 mt-1">
                Enter a new password or generate one automatically
              </p>
            </div>

            <div className="flex gap-2">
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Input.Password
                    {...field}
                    value={field.value ?? ""}
                    placeholder="At least 8 characters"
                    status={fieldState.invalid ? "error" : ""}
                    className="flex-1"
                  />
                )}
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
              >
                <LuRefreshCw className="h-4 w-4" />
                Generate
              </button>
              {passwordValue ? (
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                >
                  <LuCopy className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <Controller
              name="confirmPassword"
              control={control}
              render={({ field, fieldState }) => (
                <Input.Password
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Confirm new password"
                  status={fieldState.invalid ? "error" : ""}
                />
              )}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isExecuting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExecuting ? "Saving..." : "Reset password"}
            </button>
          </div>
        </FieldBlock>
      </FormWrapper>
    </Modal>
  );
}
