import { createServerSupabaseClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import BrandKitForm, { type BrandKitData } from "@/components/brand-kit/BrandKitForm";

export default async function BrandKitPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("brand_kits")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl">
      <div className="mb-10">
        <h1 className="font-serif text-4xl mb-2">Brand Kit</h1>
        <p className="text-bloom-black/60 text-sm">
          Set up once. Applied automatically to every post you create.
        </p>
      </div>
      <BrandKitForm userId={user.id} initial={data as BrandKitData | null} />
    </div>
  );
}
