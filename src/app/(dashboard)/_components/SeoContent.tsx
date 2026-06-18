import React from "react";
import FieldBlock from "./contentBlock";
import FormInput from "@/globalElement/form/FormInput";

export default function SeoContent() {
  return (
    <FieldBlock title="SEO məlumatları" className="mt-5">
      <FormInput
        label="Meta Başlıq"
        placeholder="Meta Başlıq"
        fieldName="metaTitle"
      />
      <FormInput
        label="Meta məlumat"
        placeholder="Meta məlumat"
        fieldName="metaDescription"
      />
      <FormInput
        label="Meta açar sözlər"
        placeholder="Meta açar sözlər"
        fieldName="metaKeywords"
      />
    </FieldBlock>
  );
}
