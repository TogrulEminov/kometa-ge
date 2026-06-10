import Footer from "@/components/layout/footer/Footer";
import Header from "@/components/layout/header/Header";
import React, { Suspense } from "react";
interface Props {
  children: React.ReactNode;
}
export default function MainLayoutProvider({ children }: Props) {
  return (
    <>
      <Header />
      <main className="lg:pt-[48px]">
        <Suspense>{children}</Suspense>
      </main>
      <Footer/>
    </>
  );
}
