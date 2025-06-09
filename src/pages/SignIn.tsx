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
    alert("Display name updated successfully!");
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 py-8 px-4">
        <div className="w-full max-w-md">
          <Auth
            redirectTo="http://localhost:5173"
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-2xl font-bold text-gray-800 mb-6">
            You are logged in!
          </p>

          <form onSubmit={updateUser} className="flex flex-col gap-4 mb-6">
            <label
              htmlFor="display-name"
              className="text-lg font-medium text-gray-700"
            >
              Update Display Name:
            </label>
            <input
              className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
              type="text"
              id="display-name"
              name="display-name"
              placeholder="Enter new display name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
            >
              Update
            </button>
          </form>

          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-gray-200 text-gray-800 font-bold hover:bg-gray-300 transition-colors duration-200"
          >
            Browse Art
          </Link>
        </div>
      </div>
    );
  }
}
