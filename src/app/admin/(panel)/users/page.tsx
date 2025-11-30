import { requireManager } from "~/server/admin/session";
import { AdminUsersPanel } from "~/components/admin/admin-users-panel";

export default async function UsersPage() {
  await requireManager();
  return <AdminUsersPanel />;
}
