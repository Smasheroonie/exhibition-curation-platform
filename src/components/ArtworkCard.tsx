import { Link } from "react-router";
import { useEffect, useState } from "react";

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
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [thumbnail]);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const institutionName =
    institution === "harvard"
      ? "Harvard Art Museums"
      : "Victoria & Albert Museum";

  return (
    <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between h-full transition-transform duration-200 hover:scale-[1.02]">
      <h2 className="font-bold text-xl text-gray-900 mb-2 text-center truncate w-full">
        {title || "Untitled"}
      </h2>

      <div className="w-full h-72 flex justify-center items-center overflow-hidden mb-4 bg-gray-100 rounded-md">
        {!imageLoaded && !imageError && (
          <div className="w-full h-full flex items-center justify-center text-gray-400 animate-pulse">
            <svg
              className="w-12 h-12 text-gray-300"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3.75 6.75c0-.621.504-1.125 1.125-1.125h13.5a1.125 1.125 0 0 1 1.125 1.125v6.75a1.125 1.125 0 0 1-1.125 1.125H4.875a1.125 1.125 0 0 1-1.125-1.125V6.75ZM6.25 11.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM5 17.25c0-.414.336-.75.75-.75h12a.75.75 0 0 0 .75-.75V8.25a.75.75 0 0 0-.75-.75H5.75a.75.75 0 0 0-.75.75v8.25Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}

        {imageError ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-500 p-4 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <p className="text-sm font-semibold">Image Not Available</p>
          </div>
        ) : (
          <img
            className={`max-h-full max-w-full object-contain ${
              !imageLoaded ? "hidden" : ""
            }`}
            src={thumbnail}
            alt="Artwork thumbnail"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
      </div>

      <div className="flex flex-col flex-grow justify-between w-full text-center">
        <div className="flex flex-col gap-1 mb-4">
          <p className="text-base text-gray-700 font-medium">
            {person || "Unknown"}
          </p>
          <p className="text-sm text-gray-600">{date || "Unknown"}</p>
          <p className="text-sm text-gray-600">{place || "Unknown"}</p>
          <p className="text-sm text-blue-700 font-semibold">
            {institutionName}
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
