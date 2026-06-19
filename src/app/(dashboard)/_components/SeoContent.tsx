import FieldBlock from "./contentBlock";
import FormInput from "@/globalElement/form/FormInput";

export default function SeoContent() {
  return (
    <FieldBlock title="SEO Information">
      <FormInput
        label="Meta Title"
        placeholder="Meta Title"
        fieldName="metaTitle"
      />
      <FormInput
        label="Meta Description"
        placeholder="Meta Description"
        fieldName="metaDescription"
      />
      <FormInput
        label="Meta Keywords"
        placeholder="Meta Keywords"
        fieldName="metaKeywords"
      />
    </FieldBlock>
  );
}
