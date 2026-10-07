import type { Metadata } from "next";
import { Shell } from "@/features/shell/Shell";

export const metadata: Metadata = { title: "Boshqaruv paneli", robots: { index: false } };

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <Shell>{children}</Shell>;
}
