import type { MsgKey } from "@/shared/i18n/messages";

export type Category =
  | "payments"
  | "einvoice"
  | "marketplace"
  | "bi"
  | "erp"
  | "crm"
  | "pos"
  | "distribution"
  | "telephony"
  | "messenger"
  | "sms"
  | "automation";

export interface FieldDef {
  key: string;
  label: string;
  type: "text" | "url" | "password" | "number" | "select";
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: { value: string; label: string }[];
}

export interface Endpoint {
  label: string;
  method: "GET" | "POST";
  path: string;
  hint?: string;
}

export interface ProviderInfo {
  key: string;
  name: string;
  category: Category;
  description: string;
  vendors: string | null;
  docs: string | null;
  fields: FieldDef[];
  events: string[];
  endpoints: Endpoint[];
  can_sync: boolean;
}

export interface Catalog {
  providers: ProviderInfo[];
  events: Record<string, string>;
}

export interface Integration {
  id: number;
  provider: string;
  name: string;
  config: Record<string, string>;
  events: string[];
  token: string;
  active: boolean;
  last_sync_at: string | null;
  last_error: string | null;
  created_at: string;
  pending_jobs: number;
  failed_jobs: number;
  sent_today: number;
  provider_info: ProviderInfo;
}

export const CATEGORIES: Record<Category, MsgKey> = {
  payments: "To'lov tizimlari",
  einvoice: "E-faktura (Soliq)",
  marketplace: "Marketpleyslar",
  erp: "ERP va buxgalteriya",
  bi: "Hisobot va analitika",
  crm: "CRM",
  distribution: "Distribyutsiya",
  pos: "POS / HoReCa",
  telephony: "Telefoniya",
  messenger: "Messenjer",
  sms: "SMS xabarnoma",
  automation: "Avtomatlashtirish",
};

export const inboundUrl = (token: string, path: string) =>
  `${typeof window === "undefined" ? "" : window.location.origin}/api/v1/public/integrations/${token}/${path}`;
