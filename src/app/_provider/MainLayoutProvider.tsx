import Footer from "@/components/layout/footer/Footer";
import HeaderServer from "@/components/layout/header/HeaderServer";
import { CustomLocales } from "@/services/interface/type";
import React, { Suspense } from "react";
import ShipmentModal from "../[locale]/(home)/_components/atoms/FormModal";
interface Props {
  children: React.ReactNode;
  locale: CustomLocales;
}
export default async function MainLayoutProvider({ children, locale }: Props) {
  return (
    <>
      <Suspense fallback={null}>
        <HeaderServer locale={locale} />
      </Suspense>
      <main className="lg:pt-[48px] bg-background">
        <Suspense>{children}</Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer locale={locale} />
      </Suspense>
      <Suspense fallback={null}>
        <ShipmentModal />
      </Suspense>
    </>
  );
}
