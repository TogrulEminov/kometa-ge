import { Input } from "antd";
import { FieldWrapper } from "./FieldsWrapper";
import type { TextAreaProps } from "antd/es/input";

interface BaseFormInputProps extends TextAreaProps {
  className?: string;
  wrapperClassName?: string;
  fieldName: string;
  label?: string | undefined;
}

export type FormInputProps = BaseFormInputProps;
const { TextArea } = Input;

export default function FormTextarea({
  label,
  fieldName,
  className,
  wrapperClassName,
  ...rest
}: FormInputProps) {
  return (
    <FieldWrapper fieldName={fieldName} label={label} className={wrapperClassName}>
      {(field, fieldState) => (
        <TextArea
          {...field}
          {...rest}
          id={field.id}
          className={`${className} ${fieldState.invalid ? "ant-input-status-error" : ""}`}
          status={fieldState.invalid ? "error" : ""}
        />
      )}
    </FieldWrapper>
  );
}
