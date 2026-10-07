import { ClientsList } from "@/features/clients/ClientsList";

export default async function ClientsPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return <ClientsList initialStatus={status} />;
}
