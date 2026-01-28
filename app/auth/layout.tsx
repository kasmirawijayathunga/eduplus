
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    redirect("/portal");
  }

  return <>{children}</>;
}
