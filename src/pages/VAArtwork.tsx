import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchVAObject } from "../api/vaApi";
import { useEffect, useState } from "react";
import {
  getCollections,
  insertArtworkIfNotExists,
  insertArtworkIntoCollection,
  type Collection,
} from "../api/supabase";
import { UserAuth } from "../context/AuthContext";

type DataCategory = {
  text: string;
  id: string;
};

export default function VAArtwork() {
  const { session } = UserAuth();
  const { id } = useParams();
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [collections, setCollections] = useState<Collection[] | []>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data, isPending, isError } = useQuery({
    queryKey: ["artwork", id],
    queryFn: () => fetchVAObject(id),
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

  const handleOpenSave = async (
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

  const handleSaveToCollection = async (
    artwork_id: string,
    collection_id: number | undefined,
    user_id: string | undefined
  ) => {
    if (collection_id && user_id) {
      await insertArtworkIntoCollection(artwork_id, collection_id, user_id);
      setCollectionModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="font-extrabold text-3xl text-gray-900 mb-6 text-center">
          {data?.record.titles?.[0]?.title || "Untitled Artwork"}
        </h1>

        {/* Main artwork image display */}
        {data?.record.images?.[0] && (
          <div className="w-full h-96 flex justify-center items-center overflow-hidden mb-6 rounded-md bg-gray-50">
            <img
              className="max-h-full max-w-full object-contain"
              src={`https://framemark.vam.ac.uk/collections/${data.record.images[0]}/full/max/0/default.jpg`}
              alt={data?.record.titles?.[0]?.title || "Artwork image"}
            />
          </div>
        )}

        {/* Additional images (if any) - displayed in a smaller, scrollable row */}
        {data?.record.images && data.record.images.length > 1 && (
          <div className="flex overflow-x-auto space-x-3 pb-3 mb-6 border-b border-gray-200">
            {data.record.images.slice(1).map((image: string) => (
              <img
                className="w-24 h-24 object-cover rounded-md shadow-sm cursor-pointer hover:scale-105 transition-transform duration-200"
                src={`https://framemark.vam.ac.uk/collections/${image}/full/max/0/default.jpg`}
                alt={`${data?.record.titles?.[0]?.title} thumbnail`}
                key={image}
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
                handleOpenSave(
                  data?.record.systemNumber,
                  data?.record.titles?.[0]?.title,
                  `https://framemark.vam.ac.uk/collections/${data?.record.images?.[0]}/full/max/0/default.jpg`
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
                    <button
                      key={collection.collection_id}
                      className="px-4 py-2 rounded-md bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors duration-200 text-center"
                      onClick={() =>
                        handleSaveToCollection(
                          data?.record.systemNumber,
                          collection.collection_id,
                          session?.user.id
                        )
                      }
                    >
                      {collection.collection_name}
                    </button>
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

        <div className="space-y-3 text-gray-700 text-lg">
          {data?.record.briefDescription && (
            <p>
              <span className="font-semibold">Brief Description: </span>
              {data.record.briefDescription}
            </p>
          )}
          {data?.record.summaryDescription && (
            <p>
              <span className="font-semibold">Summary Description: </span>
              {data.record.summaryDescription}
            </p>
          )}
          {data?.record.objectHistory && (
            <p>
              <span className="font-semibold">Object History: </span>
              {data.record.objectHistory}
            </p>
          )}
          {data?.record.categories?.length > 0 && (
            <p>
              <span className="font-semibold">Categories: </span>
              {data.record.categories.map((category: DataCategory) => (
                <span
                  key={category.id}
                  className="inline-block bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2 mb-1"
                >
                  {category.text}
                </span>
              ))}
            </p>
          )}
          {data?.record.techniques?.length > 0 && (
            <p>
              <span className="font-semibold">Techniques: </span>
              {data.record.techniques.map((technique: DataCategory) => (
                <span
                  key={technique.id}
                  className="inline-block bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2 mb-1"
                >
                  {technique.text}
                </span>
              ))}
            </p>
          )}
          {data?.record.materials?.length > 0 && (
            <p>
              <span className="font-semibold">Materials: </span>
              {data.record.materials.map((material: DataCategory) => (
                <span
                  key={material.id}
                  className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full mr-2 mb-1"
                >
                  {material.text}
                </span>
              ))}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
