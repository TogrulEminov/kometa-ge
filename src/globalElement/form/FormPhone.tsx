import React, { useEffect, useRef } from "react";
import { type InputMask } from "imask";
import { Input, type InputProps } from "antd";
import { FieldWrapper } from "./FieldsWrapper";
import { createPhoneMask } from "@/helper/phonevalidation";

export interface FormPhoneProps extends Omit<
  InputProps,
  "value" | "onChange" | "type" | "status"
> {
  fieldName: string;
  label?: string;
}

function PhoneInput({
  value,
  onChange,
  id,
  fieldName,
  invalid,
  placeholder,
  ...restAntdProps
}: {
  value?: string;
  onChange?: (val: string) => void;
  id?: string;
  fieldName?: string;
  invalid?: boolean;
} & Omit<InputProps, "value" | "onChange" | "type" | "status">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const maskRef = useRef<InputMask<any> | null>(null);
  const isInternalUpdate = useRef(false);

  useEffect(() => {
    if (!inputRef.current || maskRef.current) return;

    // IMask-a aid bütün məntiq phoneMask.ts-dən gəlir
    maskRef.current = createPhoneMask(inputRef.current);

    maskRef.current.on("accept", () => {
      if (!isInternalUpdate.current) {
        onChange?.(maskRef.current?.value ?? "");
      }
    });

    return () => maskRef.current?.destroy();
  }, [onChange]);

  useEffect(() => {
    if (maskRef.current && value !== maskRef.current.value) {
      isInternalUpdate.current = true;
      maskRef.current.value = value || "";
      isInternalUpdate.current = false;
    }
  }, [value]);

  return (
    <Input
      status={invalid ? "error" : undefined}
      ref={(antInputRef) => {
        (inputRef as any).current = (antInputRef as any)?.input ?? antInputRef;
      }}
      id={id}
      name={fieldName}
      type="tel"
      placeholder={placeholder ?? "+994 (00) 000-00-00"}
      onChange={() => {}}
      {...restAntdProps}
    />
  );
}

export default function FormPhone({
  label,
  fieldName,
  ...rest
}: FormPhoneProps) {
  return (
    <FieldWrapper fieldName={fieldName as any} label={label}>
      {(field, fieldState) => (
        <PhoneInput
          {...field}
          {...rest}
          invalid={fieldState.invalid}
          id={field.id}
          fieldName={fieldName}
        />
      )}
    </FieldWrapper>
  );
}
