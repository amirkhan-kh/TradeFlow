import { DeliveriesView } from "@/features/deliveries/DeliveriesView";

export default async function DeliveriesPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  return <DeliveriesView initialStatus={status} />;
}
