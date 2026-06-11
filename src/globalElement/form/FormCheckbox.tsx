import { Checkbox, type CheckboxProps } from "antd";
import { FieldWrapper } from "./FieldsWrapper";

interface BaseFormInputProps extends CheckboxProps {
  className?: string;
  fieldName: string;
  label?: string | undefined;
}

export type FormFieldsProps = BaseFormInputProps;

function FormCheckbox({
  label,
  fieldName,
  className,
  ...rest
}: FormFieldsProps) {
  return (
    <FieldWrapper fieldName={fieldName} label={label}>
      {(field, fieldState) => (
        <Checkbox
          {...field}
          onClick={field.onChange}
          {...rest}
          id={field.id}
          className={`${className} ${fieldState.invalid ? "ant-input-status-error" : ""}`}
        />
      )}
    </FieldWrapper>
  );
}

export default FormCheckbox;
