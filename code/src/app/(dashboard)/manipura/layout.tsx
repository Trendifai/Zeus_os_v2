import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ManipuraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*, tenants:tenant_id(*)")
    .eq("user_id", user.id)
    .single();

  if (!profile?.tenants) {
    redirect("/onboarding");
  }

  const tenant = profile.tenants;

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-amber-500">
              MANIPURA
            </span>
            <span className="text-sm text-zinc-500">
              {tenant.name}
            </span>
            {tenant.plan_type === "ultra" && (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-500">
                ULTRA PLAN
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-400">
            <span>{profile.full_name || user.email}</span>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}