import FieldBlock from "../../../_components/contentBlock";
import FormInput from "@/src/globalElements/FormBuilder/components/FormInput/FormInput";
import FormSelect from "@/src/globalElements/FormBuilder/components/FormSelect/FormSelect";
import pageData from "@/src/json/main/page.json";
import SingleUploadImage from "../../../_components/upload/single";
import NavigateBtn from "../../../_components/navigateBtn";
import CreateButton from "../../../_components/createButton";
import { useFieldArray, useFormContext } from "react-hook-form";
import JsonSectionBlock from "../../../_components/JsonSectionBlock";
import SubmitAdminButton from "../../../_components/submitBtn";
import { Plus } from "lucide-react";
interface Props {
  isPending: boolean;
  title?: string | null;
  isImage?: boolean;
}
export default function CustomForm({
  isPending,
  title,
  isImage = false,
}: Props) {
  const generalContentForm = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: generalContentForm.control,
    name: "description",
  });
  return (
    <>
      <div className={"flex flex-col space-y-5"}>
        <FieldBlock>
          <FormInput
            label="Başlıq"
            placeholder="Başlıq"
            fieldName="title"
            styles={{
              input: {
                height: "40px",
              },
            }}
          />
          <FormSelect
            label="Səhifəni seçin"
            placeholder="Səhifəni seçin"
            fieldName="slug"
            options={pageData.categories}
          />
          <FieldBlock title="Ətraflı məlumat">
            {fields.map((field, index) => (
              <JsonSectionBlock
                key={field.id}
                fieldName="description"
                sectionIndex={index}
                onRemove={() => remove(index)}
                typeOptions={[
                  {
                    value: "advantages",
                    label: "Üstünlüklərimiz",
                  },
                  {
                    value: "main",
                    label: "Əsas",
                  },
                ]}
                typeConfig={{
                  advantages: {
                    showSectionDescription: false,
                    richSectionDescription: false,
                    showItems: true,
                    showItemDescription: false,
                  },
                  main: {
                    showSectionDescription: true,
                    richSectionDescription: true,
                    showItems: false,
                  },
                }}
              />
            ))}

            {fields.length < 6 && (
              <button
                type="button"
                onClick={() =>
                  append({ title: "", description: "", type: "", items: [] })
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl  bg-blue-500 text-white cursor-pointer hover:bg-blue-600 transition-all text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Yeni bölmə əlavə et
              </button>
            )}
          </FieldBlock>
        </FieldBlock>
      </div>
      <div className={"flex flex-col space-y-5"}>
        <FieldBlock title="SEO məlumatları">
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
        {isImage && (
          <FieldBlock title="Əsas şəkili daxil et">
            <SingleUploadImage
              fieldName="image"
              label="Şəkil yüklə"
              acceptType="image/*"
            />
          </FieldBlock>
        )}
        <div className={"grid grid-cols-2 gap-5"}>
          <NavigateBtn />
          {title ? (
            <SubmitAdminButton
              title={title}
              isLoading={isPending}
              disabled={!generalContentForm.formState.isDirty || isPending}
            />
          ) : (
            <CreateButton
              isLoading={isPending}
              disabled={!generalContentForm.formState.isDirty || isPending}
            />
          )}
        </div>
      </div>
    </>
  );
}
