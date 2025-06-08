import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "../api/supabase";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { UserAuth } from "../context/AuthContext";
import { Link } from "react-router";
import { useState, type FormEvent } from "react";

export default function SignIn() {
  const { session } = UserAuth();
  const [displayName, setDisplayName] = useState("");

  const updateUser = async (e: FormEvent) => {
    e.preventDefault();

    const { data, error } = await supabase
      .from("profiles")
      .update({ username: displayName })
      .eq("id", session?.user.id)
      .select();

    if (error) {
      console.error(`Error updating profile username`, error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.warn(`No profile found to update.`);
      return;
    }

    console.log("Profile updated successfully:", data);
  };

  if (!session) {
    return (
      <Auth
        redirectTo="http://localhost:5173"
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
      />
    );
  } else {
    return (
      <div className="flex items-center justify-center">
        <div>
          <p>Logged In!</p>
          <Link to="/" className="flex items-center space-x-2 font-bold">
            Home
          </Link>
          <form onSubmit={updateUser}>
            <label className="pr-2" htmlFor="display-name">
              Update Display Name:
            </label>
            <input
              className="outline"
              type="text"
              id="display-name"
              name="display-name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <button type="submit" className="bg-blue-300 outline ml-1 px-1">
              Update
            </button>
          </form>
        </div>
      </div>
    );
  }
}
