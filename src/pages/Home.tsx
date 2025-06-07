import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex justify-center">
      <Link to="/browse" className="border-2 m-2 p-1">
        Browse
      </Link>
    </div>
  );
}
