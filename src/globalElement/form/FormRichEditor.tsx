"use client";

import RichEditor from "@/lib/rich-editor";
import { FieldWrapper } from "./FieldsWrapper";

interface FormRichEditorProps {
  className?: string;
  fieldName: string;
  label?: string;
  placeholder?: string;
}

export default function FormRichEditor({
  label,
  fieldName,
  className,
  placeholder,
}: FormRichEditorProps) {
  return (
    <FieldWrapper fieldName={fieldName} label={label} className={className}>
      {(field) => (
        <RichEditor
          value={field.value ?? ""}
          onChange={field.onChange}
          onBlur={field.onBlur}
          placeholder={placeholder ?? label}
        />
      )}
    </FieldWrapper>
  );
}
