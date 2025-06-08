import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "../api/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { UserAuth } from "../context/AuthContext";

export default function SignIn() {
  const { session } = UserAuth();

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return <div>Logged in!</div>;
  }
}
