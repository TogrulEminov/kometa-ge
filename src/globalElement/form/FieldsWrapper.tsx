import React, { useId } from "react";
import {
  useFormContext,
  Controller,
  type FieldValues,
  type Path,
  ControllerRenderProps,
  ControllerFieldState,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useFormSchema } from "./FormContextType";
import { isFieldRequired } from "@/helper/isFieldRequired";
import { cn } from "@/utils/cn";

type RenderFieldProps<
  T extends FieldValues,
  K extends Path<T>,
> = ControllerRenderProps<T, K> & {
  id: string;
};

interface FieldWrapperProps<T extends FieldValues, K extends Path<T>> {
  fieldName: K;
  label?: string;
  labelClassName?: string;
  className?: string;
  children: (
    fieldProps: RenderFieldProps<T, K>,
    fieldState: ControllerFieldState,
  ) => React.ReactNode;
}

export function FieldWrapper<T extends FieldValues, K extends Path<T>>({
  fieldName,
  label,
  labelClassName,
  children,
  className,
}: FieldWrapperProps<T, K>) {
  const id = useId();
  const schema = useFormSchema();
  const {
    control,
    formState: { errors },
  } = useFormContext<T>();
  const isRequired = isFieldRequired(schema, fieldName);
  return (
    <div className={cn(className, "flex flex-col gap-1")}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "flex items-center text-sm font-medium text-slate-700 dark-site:text-foreground",
            labelClassName,
          )}
        >
          {label}
          {isRequired && (
            <span className="text-red-500 ml-1" title="Mütləq doldurulmalıdır">
              *
            </span>
          )}
        </label>
      )}

      <Controller
        name={fieldName}
        control={control}
        render={({ field, fieldState }) => (
          <>{children({ ...field, id }, fieldState)}</>
        )}
      />
      <ErrorMessage
        errors={errors}
        name={fieldName as any}
        render={({ message }) => (
          <span className="text-red-400 text-xs italic mt-1">{message}</span>
        )}
      />
    </div>
  );
}
