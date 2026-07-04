"use client";

import { useEffect } from "react";
import { Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { users_list } from "@/app/(dashboard)/_type/query-key";
import { useAction } from "@/hooks/useServerActions";
import { LuCopy, LuRefreshCw } from "react-icons/lu";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import { User } from "@/services/interface/type";
import { resetUserPassword } from "@/actions/auth/auth.action";
import {
  resetUserPasswordSchema,
  type ResetUserPasswordInput,
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
  user: User | null;
  onClose: () => void;
}

export default function ResetPasswordModal({ isOpen, user, onClose }: Props) {
  const { success, error } = useMessageStore();

  const form = useForm<ResetUserPasswordInput>({
    resolver: zodResolver(resetUserPasswordSchema),
    defaultValues: {
      id: "",
      password: "",
    },
    values: isOpen && user ? { id: user.id, password: "" } : undefined,
  });

  const { control, reset, setValue, watch } = form;
  const passwordValue = watch("password");

  useEffect(() => {
    if (!isOpen) {
      reset({ id: "", password: "" });
    }
  }, [isOpen, reset]);

  const { execute, isExecuting } = useAction(resetUserPassword, {
    queryKey: users_list,
    onSuccess: () => {
      success("Password updated successfully");
      onClose();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "Failed to update password");
    },
  });

  const handleGeneratePassword = () => {
    const pwd = generatePassword();
    setValue("password", pwd, { shouldDirty: true, shouldValidate: true });
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

  const onSubmit = (values: ResetUserPasswordInput) => {
    execute(values);
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
      {user ? (
        <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-800">{user.name}</p>
          <p className="text-xs text-slate-500">{user.email}</p>
        </div>
      ) : null}

      <FormWrapper
        key={user?.id ?? "reset-password"}
        methods={form}
        schema={resetUserPasswordSchema}
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
              className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 font-medium text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExecuting ? "Updating..." : "Reset password"}
            </button>
          </div>
        </FieldBlock>
      </FormWrapper>
    </Modal>
  );
}
