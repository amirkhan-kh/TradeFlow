import { StockView } from "@/features/stock/StockView";

export default async function StockPage({ searchParams }: { searchParams: Promise<{ warehouse_id?: string; low?: string }> }) {
  const { warehouse_id, low } = await searchParams;
  return <StockView initialWarehouse={warehouse_id} initialLow={low === "true"} />;
}
