import { Link, useParams } from "react-router";
import { UserAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { session } = UserAuth();

  const { uid } = useParams();

  console.log(session);
  return (
    <div>
      {uid === session?.user.id ? (
        <p>This is your profile!</p>
      ) : (
        <p>Visiting another user's profile!</p>
      )}
      <p>Collections:</p>
      <Link to={"/collection/123"}>
        <p className="border-2 bg-blue-300">{"My Collection"}</p>
      </Link>
    </div>
  );
}
