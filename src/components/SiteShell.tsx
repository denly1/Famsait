"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ParticleField from "@/components/ParticleField";
import SupportChat from "@/components/SupportChat";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <ParticleField />
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
      <SupportChat />
    </>
  );
}
