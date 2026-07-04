import { HeroInfo } from "@/services/interface/type";
import HeroService from "./atoms/HeroService";
import FormComponent from "./atoms/FormComponent";
import { Suspense } from "react";

export default function CallAction({ className, heroInfo }: { className?: string, heroInfo?: HeroInfo | null }) {
  const services=heroInfo?.service
  if(!heroInfo) return null;
  return (
    <div
      className={`relative z-10 container py-10 border-b border-b-black/3 lg:pb-10 lg:py-0 ${className}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2  gap-6 items-end">
        <HeroService  services={services}/>
        <Suspense fallback={null}>  <FormComponent /></Suspense>
      </div>
    </div>
  );
}





 