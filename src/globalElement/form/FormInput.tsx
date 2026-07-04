import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input, type InputProps } from "antd";
import { FieldWrapper } from "./FieldsWrapper";

interface BaseFormInputProps extends InputProps {
  className?: string;
  fieldName: string;
  label?: string | undefined;
  labelClassName?: string;
  suffix?: React.ReactNode;
  wrapperClassName?: string;
}

export type FormInputProps = BaseFormInputProps;

export default function FormInput({
  label,
  labelClassName,
  fieldName,
  className,
  type = "text",
  suffix,
  wrapperClassName,
  ...rest
}: FormInputProps) {
  const isPassword = type === "password";

  return (
    <FieldWrapper
      fieldName={fieldName}
      label={label}
      labelClassName={labelClassName}
      className={wrapperClassName}
    >
      {(field, fieldState) => {
        const sharedProps = {
          ...field,
          ...rest,
          id: field.id,
          suffix,
          className: `${className ?? ""} ${fieldState.invalid ? "ant-input-status-error" : ""}`.trim(),
          status: fieldState.invalid ? ("error" as const) : undefined,
        };

        if (isPassword) {
          return (
            <Input.Password
              {...sharedProps}
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          );
        }

        return (
          <Input
            {...sharedProps}
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
          />
        );
      }}
    </FieldWrapper>
  );
}
