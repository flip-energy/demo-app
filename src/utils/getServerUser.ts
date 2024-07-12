"use server";

import { User, SupabaseClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface PropsType {
  requireUser?: boolean;
}

interface ReturnType {
  supabase: SupabaseClient;
  user: User | null;
}

const getServerUser = async (props?: PropsType): Promise<ReturnType> => {
  const { requireUser } = props ?? {};
  const supabase = createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user && requireUser)
    redirect(`${process.env.NEXT_PUBLIC_SITE_URL}/login`);
  return { supabase, user };
};

export default getServerUser;
