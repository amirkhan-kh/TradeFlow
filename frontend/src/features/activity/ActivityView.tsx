"use client";

import { usePaged } from "@/shared/lib/usePaged";
import { Chips, PageHeader, Pagination, SearchInput } from "@/shared/ui/Page";
import { ErrorState, Loading } from "@/shared/ui/States";
import { ActivityFeed, type ActivityItem } from "./ActivityFeed";

const GROUPS = [
  { value: "", label: "Barchasi" },
  { value: "auth", label: "Kirishlar" },
  { value: "user", label: "Xodimlar boshqaruvi" },
  { value: "profile", label: "Profil o'zgarishlari" },
];

export function ActivityView() {
  const list = usePaged<ActivityItem>("/activity");
  return (
    <div className="animate-rise">
      <PageHeader title="Faoliyat jurnali" description="Kim, qachon, qayerdan kirdi va xodimlar bo'yicha qanday o'zgarish qildi" />
      <div className="card">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-4 lg:flex-row lg:items-center lg:justify-between">
          <Chips options={GROUPS} value={list.status} onChange={list.setStatus} />
          <SearchInput value={list.q} onChange={list.setQ} placeholder="Xodim yoki IP…" />
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={list.reload} />
        ) : list.loading && !list.data ? (
          <Loading />
        ) : (
          <>
            <div className="p-4">
              <ActivityFeed items={list.data?.items ?? []} />
            </div>
            {list.data && list.data.total > 0 && <Pagination page={list.page} limit={list.data.limit} total={list.data.total} onChange={list.setPage} />}
          </>
        )}
      </div>
    </div>
  );
}
