import { Link } from "react-router";
import { UserAuth } from "../context/AuthContext";
import { supabase } from "../api/supabase";

export default function Header() {
  const { session } = UserAuth();

  const handleLogOut = async () => {
    let { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
  };

  return (
    <header className="fixed top-0 z-40 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-8">
        <Link
          to="/"
          className="flex items-center space-x-2 font-bold text-gray-800 hover:text-blue-600 transition-colors duration-200 text-lg"
        >
          Home
        </Link>
        {!session ? (
          <Link
            to="/sign-in"
            className="px-4 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors duration-200"
          >
            Sign In
          </Link>
        ) : (
          <div className="flex items-center space-x-4">
            <Link
              to={`/profile/${session.user.id}`}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium"
            >
              Profile
            </Link>
            <button
              className="cursor-pointer px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200"
              onClick={handleLogOut}
            >
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
