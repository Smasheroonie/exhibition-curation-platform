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
    <div>
      {artworks.length ? (
        <div>
          {artworks.map((artwork) => (
            <div key={artwork.artwork_id}>
              <h1>{artwork.title}</h1>
              <img src={artwork.image_url} alt="artwork" />
              {session && session.user.id === uid ? (
                <button
                  onClick={() =>
                    handleDelete(collection_id, artwork.artwork_id)
                  }
                >
                  Delete
                </button>
              ) : null}
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No artworks in collection!</p>
          <Link to="/" className="flex items-center space-x-2 font-bold">
            Browse Art
          </Link>
        </div>
      )}
    </div>
  );
}
