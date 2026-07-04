"use client";

import AdminSessionProvider, {
  type AdminSessionData,
} from "./AdminSessionProvider";

export default function DashboardProvider({
  children,
  initialSession,
}: Readonly<{
  children: React.ReactNode;
  initialSession: AdminSessionData | null;
}>) {
  return (
    <AdminSessionProvider initialSession={initialSession}>
      {children}
    </AdminSessionProvider>
  );
}
