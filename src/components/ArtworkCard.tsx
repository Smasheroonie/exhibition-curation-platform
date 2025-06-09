import { Link } from "react-router";

type ArtworkCardProps = {
  title: string;
  thumbnail: string;
  place: string;
  date: string;
  person: string;
  institution: string;
  objectId: string;
};

export default function ArtworkCard({
  title,
  thumbnail,
  place,
  date,
  person,
  institution,
  objectId,
}: ArtworkCardProps) {
  return (
    <div className="flex-col gap-2 outline m-3 p-4">
      <h2 className="font-bold text-lg truncate">{title || "Untitled"}</h2>
      <div className="w-auto h-72 overflow-clip">
        <img
          className="h-full w-full object-scale-down"
          src={thumbnail}
          alt="placeholder artwork"
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col gap-1">
          <p className="text-sm">{person || "Unknown"}</p>
          <p className="text-sm">{date || "Unknown"}</p>
          <p className="text-sm">{place || "Unknown"}</p>
          <p className="text-sm">
            {institution === "harvard"
              ? "Harvard Art Museums"
              : "Victoria & Albert Museum"}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Link
            className="border-2 p-1"
            to={`/artwork/${institution}/${objectId}`}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}
