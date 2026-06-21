import Footer from "@/components/layout/footer/Footer";
import HeaderServer from "@/components/layout/header/HeaderServer";
import { CustomLocales } from "@/services/interface/type";
import React, { Suspense } from "react";
interface Props {
  children: React.ReactNode;
  locale: CustomLocales;
}
export default async function MainLayoutProvider({ children, locale }: Props) {
  return (
    <>
      <HeaderServer locale={locale} />
      <main className="lg:pt-[48px]">
        <Suspense>{children}</Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer locale={locale} />
      </Suspense>
    </>
  );
}
