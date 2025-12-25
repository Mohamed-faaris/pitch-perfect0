import { redirect } from "next/navigation";
import { ForgotPasswordForm } from "~/components/admin/forgot-password-form";
import { getSession } from "~/server/better-auth/server";

export default async function ForgotPasswordPage() {
  const session = await getSession();

  if (session?.user) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="bg-background flex min-h-dvh items-center justify-center px-4">
      <ForgotPasswordForm />
    </div>
  );
}
