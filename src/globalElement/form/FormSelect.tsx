import {Select, type SelectProps} from "antd";
import {FieldWrapper} from "./FieldsWrapper";

interface BaseFormSelectProps extends SelectProps {
    className?: string;
    fieldName: string;
    label?: string;
    labelClassName?: string;
}

export type FormSelectProps = BaseFormSelectProps;

export default function FormSelect({
                                       label,
                                       labelClassName,
                                       fieldName,
                                       className,
                                       options,
                                       ...rest
                                   }: FormSelectProps) {

    return (
        <FieldWrapper fieldName={fieldName} label={label} labelClassName={labelClassName}>
            {(field, fieldState) => (
                <Select
                    {...field}
                    {...rest}
                    options={options}
                    id={field.id}
                    className={`${className} w-full`}
                    status={fieldState.invalid ? "error" : ""}
                    value={field.value ?? undefined}
                />
            )}
        </FieldWrapper>
    );
}