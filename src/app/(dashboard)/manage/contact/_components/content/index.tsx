"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { CustomLocales, IContactInformation } from "@/services/interface/type";
import {
  UpsertContactFormValues,
  UpsertContactInput,
  upsertContactSchema,
} from "@/actions/client/contact/contact.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertContact } from "@/actions/client/contact/contact.controller";
import FormWrapper from "@/globalElement/form/FormWrapper";
import FieldBlock from "@/app/(dashboard)/_components/contentBlock";
import FormInput from "@/globalElement/form/FormInput";
import FormTextarea from "@/globalElement/form/FormTextarea";
import FormPhone from "@/globalElement/form/FormPhone";
import NavigateBtn from "@/app/(dashboard)/_components/navigateBtn";
import SubmitAdminButton from "@/app/(dashboard)/_components/submitBtn";

interface Props {
  existingData: IContactInformation | undefined;
  refetch: () => void;
}

export default function Content({ existingData, refetch }: Props) {
  const searchParams = useSearchParams();
  const locale = searchParams?.get("locale") ?? "az";
  const router = useRouter();
  const translations = existingData?.translations?.[0];
  const generalForm = useForm<UpsertContactFormValues>({
    resolver: zodResolver(upsertContactSchema),
    mode: "onChange",
    values: {
      phone: existingData?.phone ?? "",
      adressLink: existingData?.adressLink ?? "",
      email: existingData?.email ?? "",
      latitude: existingData?.latitude ?? "",
      longitude: existingData?.longitude ?? "",
      whatsapp: existingData?.whatsapp ?? "",
      adress: translations?.adress ?? "",
      locale: locale as CustomLocales,
    },
  });
  const {
    formState: { isDirty },
    reset,
  } = generalForm;

  const { execute, isExecuting } = useAction(upsertContact, {
    onSuccess() {
      reset();
      router.refresh();
      refetch();
    },
    onError: (err) => {
      console.error(err);
    },
  });
  const onSubmit = async (data: UpsertContactFormValues) => {
    execute(data);
  };

  return (
    <section className="flex flex-col gap-4 mb-2">
      <FormWrapper
        methods={generalForm}
        onSubmit={onSubmit}
        schema={upsertContactSchema}
        className="grid grid-cols-1 gap-3"
      >
        <div className="flex flex-col space-y-4">
          <FieldBlock title="Form information to be translated">
            <FormInput
              label="Address"
              placeholder="Enter address"
              fieldName="adress"
            />
          </FieldBlock>

          <FieldBlock
            title="Map coordinates (x,y)"
            wrapperClassName="grid md:grid-cols-2 gap-4"
          >
            <FormInput
              label="Latitude"
              placeholder="40.4093"
              type="number"
              step={0.0001}
              fieldName="latitude"
            />
            <FormInput
              label="Longitude"
              placeholder="49.4093"
              type="number"
              step={0.0001}
              fieldName="longitude"
            />
          </FieldBlock>

          <FieldBlock
            title="Contact details"
            wrapperClassName="grid md:grid-cols-2 gap-4"
          >
            <FormPhone
              label="Phone"
              fieldName="phone"
              placeholder="+994 XX XXX XX XX"
            />
            <FormPhone
              placeholder="+994 XX XXX XX XX"
              label="WhatsApp number"
              fieldName="whatsapp"
            />
            <FormInput
              label="Email"
              placeholder="info@example.com"
              type="email"
              fieldName="email"
            />
            <FormInput
              type={"url"}
              label="Address link"
              placeholder="Google Maps link"
              fieldName="adressLink"
            />
          </FieldBlock>
        </div>

        <div className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4 mt-auto max-w-lg">
            <NavigateBtn />
            <SubmitAdminButton
              title={existingData ? "Update" : "Add"}
              isLoading={isExecuting}
              disabled={!isDirty || isExecuting}
            />
          </div>
        </div>
      </FormWrapper>
    </section>
  );
}
