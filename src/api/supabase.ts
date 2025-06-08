import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

const getCollections = async (uid) => {
  let { data: collections, error } = await supabase
    .from("collections")
    .select("*")
    .eq("user_id", uid);

  console.log(collections);
};
