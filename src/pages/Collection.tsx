import { useEffect, useState } from "react";
import {
  deleteArtworkFromCollection,
  getArtworksByCollectionId,
  type ArtworkData,
} from "../api/supabase";
import { Link, useParams } from "react-router";
import { UserAuth } from "../context/AuthContext";

export default function Collection() {
  const { session } = UserAuth();
  const { uid, collection_id } = useParams();

  const [artworks, setArtworks] = useState<ArtworkData[] | []>([]);

  const fetchArtworks = async () => {
    const fetchedArtworks = await getArtworksByCollectionId(collection_id);
    if (fetchedArtworks) {
      setArtworks(fetchedArtworks);
    } else {
      setArtworks([]);
    }
  };

  const handleDelete = async (
    collection_id: string | undefined,
    artwork_id: string
  ) => {
    if (collection_id) {
      const deleted = await deleteArtworkFromCollection(
        collection_id,
        artwork_id
      );

      if (deleted) {
        fetchArtworks();
      }
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {artworks.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artworks.map((artwork) => (
              <div
                key={artwork.artwork_id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-between h-full"
              >
                <h2 className="font-bold text-xl text-gray-900 mb-2 text-center truncate w-full">
                  {artwork.title || "Untitled"}
                </h2>
                <div className="w-full h-72 flex justify-center items-center overflow-hidden mb-4">
                  <img
                    className="max-h-full max-w-full object-contain"
                    src={artwork.image_url}
                    alt={artwork.title || "Artwork image"}
                  />
                </div>
                {session && session.user.id === uid ? (
                  <div className="mt-auto">
                    {" "}
                    {/* Pushes button to the bottom */}
                    <button
                      className="px-5 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200"
                      onClick={() =>
                        handleDelete(collection_id, artwork.artwork_id)
                      }
                    >
                      Remove from Collection
                    </button>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg shadow-md text-center">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              No artworks in this collection yet!
            </p>
            <Link
              to="/"
              className="px-6 py-3 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
            >
              <span>Browse Art</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
