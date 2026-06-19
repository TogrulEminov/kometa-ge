import { Input, type InputProps } from "antd";
import { FieldWrapper } from "./FieldsWrapper";

interface BaseFormInputProps extends InputProps {
  className?: string;
  fieldName: string;
  label?: string | undefined;
  suffix?: React.ReactNode;
  wrapperClassName?: string;
}

export type FormInputProps = BaseFormInputProps;

export default function FormInput({
  label,
  fieldName,
  className,
  type = "text",
  suffix,
  wrapperClassName,
  ...rest
}: FormInputProps) {
  return (
    <FieldWrapper
      fieldName={fieldName}
      label={label}
      className={wrapperClassName}
    >
      {(field, fieldState) => (
        <Input
          {...field}
          {...rest}
          id={field.id}
          type={type}
          onChange={(e) => {
            const val = e.target.value;
            if (type === "number") {
              if (val === "" || val === "-") {
                field.onChange(val);
              } else {
                const parsed = parseFloat(val);
                field.onChange(isNaN(parsed) ? "" : parsed);
              }
            } else {
              field.onChange(val);
            }
          }}
          suffix={suffix}
          className={`${className} ${fieldState.invalid ? "ant-input-status-error" : ""}`}
          status={fieldState.invalid ? "error" : ""}
        />
      )}
    </FieldWrapper>
  );
}
