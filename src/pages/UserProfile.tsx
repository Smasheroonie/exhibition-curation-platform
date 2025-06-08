import { useParams } from "react-router";
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
    </div>
  );
}
