import type { Role } from "@/shared/lib/roles";

export interface Staff {
  id: number;
  username: string;
  full_name: string;
  role: Role;
  phone: string | null;
  email: string | null;
  region: string | null;
  monthly_plan: number;
  active: boolean;
  last_login_at: string | null;
  password_changed_at: string | null;
  created_at: string;
}

export interface RoleStat {
  role: Role;
  total: number;
  active: number;
  online: number;
}
