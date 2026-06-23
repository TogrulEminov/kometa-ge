import LeftSidebar from "./atoms/LeftSidebar";
import {
  DirectionsType,
  IContactInformation,
  Social,
} from "@/services/interface/type";
import RootDetail from "./atoms/RootDetail";
import { Suspense } from "react";
export default function DirectionsDetailContainer({
  directionCollections,
  data,
  contactInfo,
  socials,
}: {
  directionCollections: DirectionsType[];
  data: DirectionsType;
  contactInfo: IContactInformation;
  socials: Social[];
}) {
  return (
    <div className="lg:py-20 py-10 bg-tertiary min-h-screen">
      <div className="container">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-[30%] shrink-0 lg:order-1 order-2">
            <div className="lg:sticky lg:top-25">
              <Suspense fallback={null}>
                <LeftSidebar
                  contactInfo={contactInfo}
                  socials={socials}
                  directionCollections={directionCollections}
                />
              </Suspense>
            </div>
          </aside>

          <div className="lg:w-[70%] lg:min-w-0 lg:order-2 order-1">
            <Suspense fallback={null}>
              <RootDetail data={data} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
