import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import DashboardProvider from "./DashboardProvider";
import { Suspense } from "react";
import WhiteBlock from "../_components/whiteBlock";
import { redirect } from "next/navigation";
import Sidebar from "../_components/sidebar";
import Header from "../_components/header";

export default async function AdminDashboarLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session?.user) {
    redirect("/auth/login");
  }
  return (
    <DashboardProvider>
      <Sidebar />
      <Header />
      <Suspense fallback={null}>
        <main className={"min-h-dvh bg-[#e8e8e8] pt-20 pb-5 overflow-hidden"}>
          <WhiteBlock>{children}</WhiteBlock>
        </main>
      </Suspense>
    </DashboardProvider>
  );
}
