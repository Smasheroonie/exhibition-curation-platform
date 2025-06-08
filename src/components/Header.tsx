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
    <header className="fixed top-0 z-40 px-8 w-full border-b bg-white">
      <div className="flex h-16 items-center space-x-4 justify-between sm:space-x-0">
        <Link to="/" className="flex items-center space-x-2 font-bold">
          Home
        </Link>
        {!session ? (
          <Link to="/sign-in">Sign In</Link>
        ) : (
          <div className="space-x-3">
            <Link to={`/profile/${session.user.id}`}>Profile</Link>
            <button onClick={handleLogOut}>Log Out</button>
          </div>
        )}
      </div>
    </header>
  );
}
