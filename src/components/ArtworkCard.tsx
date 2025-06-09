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
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between h-full transition-transform duration-200 hover:scale-[1.02]">
      <h2 className="font-bold text-xl text-gray-900 mb-2 text-center truncate w-full">
        {title || "Untitled"}
      </h2>
      <div className="w-full h-72 flex justify-center items-center overflow-hidden mb-4">
        <img
          className="max-h-full max-w-full object-contain"
          src={thumbnail}
          alt="Artwork thumbnail"
        />
      </div>
      <div className="flex flex-col flex-grow justify-between w-full text-center">
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-base text-gray-700 font-medium">
            {person || "Unknown"}
          </p>
          <p className="text-sm text-gray-600">{date || "Unknown"}</p>
          <p className="text-sm text-gray-600">{place || "Unknown"}</p>
          <p className="text-sm text-blue-700 font-semibold">
            {institution === "harvard"
              ? "Harvard Art Museums"
              : "Victoria & Albert Museum"}
          </p>
        </div>
        <div className="flex justify-center mt-auto">
          <Link
            className="px-6 py-2 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors duration-200"
            to={`/artwork/${institution}/${objectId}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
