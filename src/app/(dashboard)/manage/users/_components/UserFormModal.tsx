"use client";

import { useEffect } from "react";
import { Input, Modal } from "antd";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { LuCopy, LuRefreshCw } from "react-icons/lu";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import FormSelect from "@/globalElement/form/FormSelect";
import { Role, User } from "@/services/interface/type";
import { createUserAction, uptadeUser } from "@/actions/auth/auth.action";
import {
  createUserFormSchema,
  updateUserFormSchema,
  type UpdateUserFormInput,
  type UpsertUserSchemaInput,
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

function normalizeRole(role: string): "admin" | "moderator" {
  return role === Role.ADMIN ? Role.ADMIN : Role.MODERATOR;
}

interface Props {
  isOpen: boolean;
  editingUser: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UserFormModal({
  isOpen,
  editingUser,
  onClose,
  onSuccess,
}: Props) {
  const { success, error } = useMessageStore();
  const isEditing = Boolean(editingUser);

  const form = useForm<UpdateUserFormInput | UpsertUserSchemaInput>({
    resolver: zodResolver(isEditing ? updateUserFormSchema : createUserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      role: Role.MODERATOR,
      password: "",
    },
    values: isOpen
      ? isEditing && editingUser
        ? {
            id: editingUser.id,
            name: editingUser.name,
            email: editingUser.email,
            role: normalizeRole(editingUser.role),
          }
        : {
            name: "",
            email: "",
            role: Role.MODERATOR,
            password: "",
          }
      : undefined,
  });

  const { control, reset, setValue, watch } = form;
  const passwordValue = watch("password");

  useEffect(() => {
    if (!isOpen) {
      reset({
        name: "",
        email: "",
        role: Role.MODERATOR,
        password: "",
      });
    }
  }, [isOpen, reset]);

  const { execute: createUser, isExecuting: isCreating } = useAction(
    createUserAction,
    {
      onSuccess: () => {
        success("User created successfully");
        onClose();
        onSuccess();
      },
      onError: (err) => {
        error(err.error?.serverError ?? "Failed to create user");
      },
    },
  );

  const { execute: updateUser, isExecuting: isUpdating } = useAction(uptadeUser, {
    onSuccess: () => {
      success("User updated successfully");
      onClose();
      onSuccess();
    },
    onError: (err) => {
      error(err.error?.serverError ?? "Failed to update user");
    },
  });

  const isSubmitting = isCreating || isUpdating;

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

  const onSubmit = (values: UpdateUserFormInput | UpsertUserSchemaInput) => {
    if (isEditing && editingUser) {
      const editValues = values as UpdateUserFormInput;
      updateUser({
        id: editValues.id,
        name: editValues.name,
        email: editValues.email,
        role: editValues.role,
      });
      return;
    }

    const createValues = values as UpsertUserSchemaInput;
    createUser({
      name: createValues.name,
      email: createValues.email,
      role: createValues.role,
      password: createValues.password,
    });
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={
        <div className="text-xl font-semibold text-slate-800">
          {isEditing ? "Edit user" : "New user"}
        </div>
      }
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      destroyOnHidden
      width={560}
    >
      <FormWrapper
        key={editingUser?.id ?? "create"}
        methods={form}
        schema={isEditing ? updateUserFormSchema : createUserFormSchema}
        onSubmit={onSubmit}
        className="mt-6 space-y-5"
      >
        <FieldBlock>
          <FormInput
            label="Name"
            placeholder="e.g. John Doe"
            fieldName="name"
          />
          <FormInput
            label="Email"
            placeholder="john@example.com"
            fieldName="email"
          />
          <FormSelect
            label="Role"
            placeholder="Select role"
            fieldName="role"
            options={[
              { value: Role.ADMIN, label: "Admin" },
              { value: Role.MODERATOR, label: "Moderator" },
            ]}
          />

          {!isEditing ? (
            <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Password</p>
                <p className="text-xs text-slate-500 mt-1">
                  Password is required for new users
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
          ) : null}

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
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create user"}
            </button>
          </div>
        </FieldBlock>
      </FormWrapper>
    </Modal>
  );
}
