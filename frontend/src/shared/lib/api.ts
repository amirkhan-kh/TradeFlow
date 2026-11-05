export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/** Matches the rewrite proxy timeout: a stalled request ends with an error instead of an endless spinner. */
const TIMEOUT_MS = 30_000;

export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, ...rest } = init;
  const timeout = AbortSignal.timeout(TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch(`/api/v1${path}`, {
      ...rest,
      signal: rest.signal ? AbortSignal.any([rest.signal, timeout]) : timeout,
      credentials: "include",
      headers: json !== undefined ? { "content-type": "application/json", ...rest.headers } : rest.headers,
      body: json !== undefined ? JSON.stringify(json) : rest.body,
    });
  } catch (err) {
    if (rest.signal?.aborted) throw err;
    throw new ApiError(0, timeout.aborted ? "Server javob bermadi — qayta urinib ko'ring" : "Tarmoq bilan aloqa yo'q — internetni tekshiring");
  }

  if (res.status === 401 && !path.startsWith("/auth/login")) {
    await fetch("/api/v1/auth/logout", { method: "POST", credentials: "include" });
    window.location.href = `/login?next=${encodeURIComponent(window.location.pathname)}`;
    throw new ApiError(401, "Sessiya tugadi");
  }
  if (res.status === 204) return undefined as T;

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const issue = body?.issues?.[0];
    const detail = issue ? `${issue.path?.join(".") ?? ""}: ${issue.message}` : "";
    throw new ApiError(res.status, body?.error ? `${body.error}${detail ? ` (${detail})` : ""}` : "Xatolik yuz berdi");
  }
  return body as T;
}

/** Window event: the signed-in user's profile changed, refetch `/auth/me`. */
export const ME_CHANGED = "tf:me-changed";

export const qs = (params: Record<string, string | number | boolean | undefined | null>) => {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") s.set(k, String(v));
  const str = s.toString();
  return str ? `?${str}` : "";
};
