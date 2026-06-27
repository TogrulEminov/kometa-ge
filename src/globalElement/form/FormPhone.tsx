import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FocusEventHandler,
} from "react";
import { Input, type InputProps, type InputRef } from "antd";
import { FieldWrapper } from "./FieldsWrapper";
import { getAntdNativeInput, usePhoneMask, DEFAULT_PHONE_PLACEHOLDER } from "@/helper/phonevalidation";

export interface FormPhoneProps extends Omit<
  InputProps,
  "value" | "onChange" | "type" | "status"
> {
  fieldName: string;
  label?: string;
  labelClassName?: string;
  wrapperClassName?: string;
  className?: string;
}

function PhoneInput({
  value,
  onChange,
  onBlur,
  ref: rhfRef,
  name: _name,
  id,
  fieldName,
  invalid,
  className,
  onFocus,
  placeholder,
  ...inputProps
}: {
  value?: string;
  onChange?: (val: string) => void;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  ref?: React.Ref<InputRef>;
  name?: string;
  id?: string;
  fieldName?: string;
  invalid?: boolean;
} & Omit<InputProps, "value" | "onChange" | "type">) {
  const onChangeRef = useRef(onChange);
  const isFocusedRef = useRef(false);
  const prevValueRef = useRef(value);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (prevValueRef.current === value) return;

    if (!isFocusedRef.current) {
      setResetKey((key) => key + 1);
    }

    prevValueRef.current = value;
  }, [value]);

  const handleAccept = useCallback((maskedValue: string) => {
    onChangeRef.current?.(maskedValue);
  }, []);

  const setMaskRef = usePhoneMask(value, handleAccept);

  const attachMaskToAntdInput = useCallback(
    (instance: InputRef | null) => {
      if (!instance) {
        setMaskRef(null);
        return;
      }

      const tryAttach = () => {
        const nativeInput = getAntdNativeInput(instance);
        if (nativeInput) {
          setMaskRef(nativeInput);
          return true;
        }
        return false;
      };

      if (!tryAttach()) {
        requestAnimationFrame(tryAttach);
      }
    },
    [setMaskRef],
  );

  const setInputRef = useCallback(
    (instance: InputRef | null) => {
      if (typeof rhfRef === "function") {
        rhfRef(instance);
      } else if (rhfRef) {
        (rhfRef as React.MutableRefObject<InputRef | null>).current = instance;
      }

      attachMaskToAntdInput(instance);
    },
    [attachMaskToAntdInput, rhfRef],
  );

  const mergedStatus = invalid ? "error" : inputProps.status;

  return (
    <Input
      key={resetKey}
      {...inputProps}
      ref={setInputRef}
      id={id}
      name={fieldName}
      type="tel"
      className={`${className ?? ""} ${invalid ? "ant-input-status-error" : ""}`.trim()}
      status={mergedStatus}
      placeholder={placeholder ?? DEFAULT_PHONE_PLACEHOLDER}
      onFocus={(e) => {
        isFocusedRef.current = true;
        onFocus?.(e);
      }}
      onBlur={(e) => {
        isFocusedRef.current = false;
        onBlur?.(e);
      }}
    />
  );
}

export default function FormPhone({
  label,
  labelClassName,
  fieldName,
  wrapperClassName,
  className,
  ...rest
}: FormPhoneProps) {
  return (
    <FieldWrapper
      fieldName={fieldName as any}
      label={label}
      labelClassName={labelClassName}
      className={wrapperClassName}
    >
      {(field, fieldState) => (
        <PhoneInput
          {...field}
          {...rest}
          className={className}
          invalid={fieldState.invalid}
          id={field.id}
          fieldName={fieldName}
        />
      )}
    </FieldWrapper>
  );
}
