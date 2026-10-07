import { AuditDetail } from "@/features/audits/AuditDetail";

export default async function AuditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AuditDetail id={id} />;
}
