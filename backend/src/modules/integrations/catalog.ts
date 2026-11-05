import { amocrm } from "./providers/amocrm.js";
import { bitrix24 } from "./providers/bitrix24.js";
import { click } from "./providers/click.js";
import { didox } from "./providers/didox.js";
import { eskiz } from "./providers/eskiz.js";
import { googleSheets, powerbi } from "./providers/feeds.js";
import { iiko } from "./providers/iiko.js";
import { moysklad } from "./providers/moysklad.js";
import { onec } from "./providers/onec.js";
import { payme } from "./providers/payme.js";
import { sapB1 } from "./providers/sap.js";
import { spot2d } from "./providers/spot2d.js";
import { telegram } from "./providers/telegram.js";
import { telephony } from "./providers/telephony.js";
import { uzumMarket } from "./providers/uzum.js";
import { webhook } from "./providers/webhook.js";
import type { Provider } from "./types.js";

export const PROVIDERS: Provider[] = [
  payme,
  click,
  didox,
  uzumMarket,
  onec,
  moysklad,
  sapB1,
  powerbi,
  googleSheets,
  bitrix24,
  amocrm,
  spot2d,
  iiko,
  telephony,
  telegram,
  eskiz,
  webhook,
];

const byKey = new Map(PROVIDERS.map((p) => [p.key, p]));
export const providerOf = (key: string) => byKey.get(key);

/** Public shape for the UI: no functions. */
export const describe = (p: Provider) => ({
  key: p.key,
  name: p.name,
  category: p.category,
  description: p.description,
  vendors: p.vendors ?? null,
  docs: p.docs ?? null,
  fields: p.fields,
  events: p.events,
  endpoints: p.endpoints ?? [],
  can_sync: Boolean(p.sync),
});
