import SectionContentComponent from "@/components/SectionContent";
import InfoxBox from "./atoms/InfoxBox";
import ContactForm from "./atoms/ContactForm";
import { Suspense } from "react";
import MapContainerBox from "./MapContainer";
import MapInfo from "./atoms/MapInfo";
import SocialBox from "./atoms/SocialBox";
import {
  IContactInformation,
  newInfoJson,
  Social,
} from "@/services/interface/type";
import { useTranslations } from "next-intl";

export default function ContactSection({
  data,
  sectionContent,
  socials,
}: {
  data: IContactInformation;
  sectionContent: newInfoJson;
  socials: Social[];
}) {
  const t = useTranslations("atoms.components.contactInfo");

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container">
        <SectionContentComponent
          title={sectionContent?.title ?? ""}
          type="vertical"
          heading="h1"
          description={sectionContent?.description ?? ""}
          rootClass="[&_h1]:text-foreground [&_article]:text-muted"
        />

        <InfoxBox contactInfo={data} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="surface-card rounded-3xl p-8 lg:p-10">
            <strong className="text-foreground text-2xl block font-bold mb-2">
              {t("send_a_message")}
            </strong>
            <p className="text-muted text-sm mb-8">{t("send_description")}</p>
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div className="surface-card rounded-3xl p-3">
              <div className="rounded-2xl relative overflow-hidden h-80">
                <Suspense
                  fallback={
                    <div className="absolute inset-0 bg-surface-elevated w-full h-full" />
                  }
                >
                  <MapContainerBox contactInfo={data} />
                </Suspense>
              </div>

              <div className="p-5">
                <Suspense fallback={null}>
                  <MapInfo contactInfo={data} />
                </Suspense>
              </div>
            </div>

            <Suspense fallback={null}>
              <SocialBox socials={socials} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
