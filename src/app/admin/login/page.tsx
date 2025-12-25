import { redirect } from "next/navigation";
import { AdminLoginForm } from "~/components/admin/admin-login-form";
import { getSession } from "~/server/better-auth/server";

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-4">
      <AdminLoginForm />
    </div>
  );
}
