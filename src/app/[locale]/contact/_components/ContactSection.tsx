import SectionContentComponent from "@/components/SectionContent";
import InfoxBox from "./atoms/InfoxBox";
import ContactForm from "./atoms/ContactForm";
import { Suspense } from "react";
import MapContainerBox from "./MapContainer";
import MapInfo from "./atoms/MapInfo";
import SocialBox from "./atoms/SocialBox";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f5f5f7] py-20">
      <div className="container">
        <SectionContentComponent
          title="Get in touch"
          type="vertical"
          heading="h2"
          description={
            "Have a question? We are here to help. Reach out to our team."
          }
        />

        <InfoxBox />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100">
            <h2 className="text-secondary text-2xl font-bold mb-2">
              Send a message
            </h2>
            <p className="text-gray-400 text-sm mb-8">
              Fill out the form and we will get back to you shortly.
            </p>
            <ContactForm />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-3 border border-gray-100">
              <div className="rounded-2xl relative overflow-hidden h-80">
                <Suspense
                  fallback={
                    <div className="absolute inset-0 bg-gray-100 w-full h-full" />
                  }
                >
                  <MapContainerBox />
                </Suspense>
              </div>

              <div className="p-5">
                <MapInfo />
              </div>
            </div>
            <SocialBox />
          </div>
        </div>
      </div>
    </div>
  );
}
