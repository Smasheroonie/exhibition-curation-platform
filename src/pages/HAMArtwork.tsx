import { useQuery } from "@tanstack/react-query";
import { fetchHAMObject } from "../api/hamApi";
import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import {
  getCollections,
  insertArtworkIfNotExists,
  type Collection,
} from "../api/supabase";
import { UserAuth } from "../context/AuthContext";

type Image = {
  baseimageurl: string;
  imageid: string;
};

export default function HAMArtwork() {
  const { session } = UserAuth();
  const { id } = useParams();
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[] | []>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, isPending, isError } = useQuery({
    queryKey: ["artwork", id],
    queryFn: () => fetchHAMObject(id),
    refetchOnWindowFocus: false,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error fetching data. Please try again.</span>;
  }

  if (!data) {
    return <span>No artwork data found.</span>;
  }

  const handleSave = async (
    artwork_id: string,
    title: string,
    image_url: string
  ) => {
    setCollectionModalOpen(true);

    await insertArtworkIfNotExists({
      artwork_id,
      title,
      image_url,
    });

    const collections = await getCollections(session?.user.id);

    if (collections) {
      setCollections(collections);
    } else {
      setCollections([]);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="font-extrabold text-3xl text-gray-900 mb-6 text-center">
          {data?.title || "Untitled Artwork"}
        </h1>

        {/* Main artwork image display */}
        {data?.images?.[0]?.baseimageurl && (
          <div className="w-full h-96 flex justify-center items-center overflow-hidden mb-6 rounded-md bg-gray-50">
            <img
              className="max-h-full max-w-full object-contain"
              src={data.images[0].baseimageurl}
              alt={data?.title || "Artwork image"}
            />
          </div>
        )}

        {/* Additional images (if any) - displayed in a smaller, scrollable row */}
        {data?.images && data.images.length > 1 && (
          <div className="flex overflow-x-auto space-x-3 pb-3 mb-6 border-b border-gray-200">
            {data.images.slice(1).map((image: Image) => (
              <img
                className="w-24 h-24 object-cover rounded-md shadow-sm cursor-pointer hover:scale-105 transition-transform duration-200"
                src={image.baseimageurl}
                alt={`${data?.title} thumbnail`}
                key={image.imageid}
                // You might want to add onClick to change the main displayed image
              />
            ))}
          </div>
        )}

        <div className="mb-6">
          {session ? (
            <button
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors duration-200 w-full mb-4"
              onClick={() =>
                handleSave(
                  data?.objectid,
                  data?.title,
                  data?.images?.[0]?.baseimageurl || ""
                )
              }
            >
              Add to Collection
            </button>
          ) : (
            <p className="text-center text-gray-600 italic mb-4">
              Log in to add this artwork to your collections.
            </p>
          )}

          {collectionModalOpen && collections.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-md shadow-inner mb-4">
              <p className="font-semibold text-gray-800 mb-3">
                Select a collection:
              </p>
              <div className="grid grid-cols-1 gap-2">
                {collections?.map((collection: Collection) => {
                  return (
                    <Link
                      key={collection.collection_id}
                      to={`/collection/${collection.collection_id}`}
                      className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200 text-center"
                    >
                      {collection.collection_name}
                    </Link>
                  );
                })}
              </div>
              <button
                className="mt-4 px-4 py-2 rounded-md bg-gray-400 text-white font-medium hover:bg-gray-500 transition-colors duration-200 w-full"
                onClick={() => setCollectionModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {collectionModalOpen && collections.length === 0 && (
            <div className="bg-gray-50 p-4 rounded-md shadow-inner text-center mb-4">
              <p className="text-gray-700 mb-3">
                You don't have any collections yet!
              </p>
              <button
                className="px-4 py-2 rounded-md bg-gray-400 text-white font-medium hover:bg-gray-500 transition-colors duration-200 w-full"
                onClick={() => setCollectionModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Artwork Details Section */}
        <div className="space-y-3 text-gray-700 text-lg">
          <p>
            <span className="font-semibold">Description: </span>
            {data?.description || "No description available."}
          </p>
          {data?.century && (
            <p>
              <span className="font-semibold">Century: </span>
              {data.century}
            </p>
          )}
          {data?.culture && (
            <p>
              <span className="font-semibold">Culture: </span>
              {data.culture}
            </p>
          )}
          {data?.department && (
            <p>
              <span className="font-semibold">Department: </span>
              {data.department}
            </p>
          )}
          {data?.division && (
            <p>
              <span className="font-semibold">Division: </span>
              {data.division}
            </p>
          )}
          {data?.technique && (
            <p>
              <span className="font-semibold">Technique: </span>
              {data.technique}
            </p>
          )}
          {data?.medium && (
            <p>
              <span className="font-semibold">Materials: </span>
              {data.medium}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
