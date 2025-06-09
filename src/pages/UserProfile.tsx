import { Link, useParams } from "react-router";
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect, type FormEvent } from "react";
import {
  deleteCollection,
  getCollections,
  insertCollection,
  type Collection,
} from "../api/supabase";

export default function UserProfile() {
  const { session } = UserAuth();
  const { uid } = useParams();
  const [collections, setCollections] = useState<Collection[] | []>([]);
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCollections = async () => {
    if (session?.user.id) {
      const fetchedCollections = await getCollections(session.user.id);
      if (fetchedCollections) {
        setCollections(fetchedCollections);
      } else {
        setCollections([]);
      }
    }
  };

  useEffect(() => {
    fetchCollections();
  }, [session]);

  const handleDelete = async (
    collection_id: number | undefined,
    user_id: string
  ) => {
    if (collection_id) {
      const deleted = await deleteCollection(collection_id, user_id);

      if (deleted) {
        fetchCollections();
      }
    }
  };

  const handleCreateCollection = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (uid && newCollectionName.trim().length) {
      try {
        await insertCollection(uid, newCollectionName.trim());
        setNewCollectionName("");
        setCreatingNewCollection(false);
        await fetchCollections();
      } catch (error) {
        console.error("Error creating collection:", error);
      }
    } else {
      console.warn("Collection name cannot be empty.");
    }
  };

  return (
    <div>
      {uid === session?.user.id ? (
        <p>This is your profile!</p>
      ) : (
        <p>Visiting another user's profile!</p>
      )}
      <p>Collections:</p>
      {collections.length > 0 ? (
        collections.map((collection) => (
          <div key={collection.collection_id} className="flex gap-1">
            <Link to={`/collection/${uid}/${collection.collection_id}`}>
              <p className="border-2 bg-blue-300">
                {collection.collection_name}
              </p>
            </Link>
            {session && session.user.id === uid ? (
              <button
                className="bg-red-300"
                onClick={() => handleDelete(collection.collection_id, uid)}
              >
                Delete
              </button>
            ) : null}
          </div>
        ))
      ) : (
        <p>No collections found.</p>
      )}
      {!creatingNewCollection ? (
        <button
          className="border-2 p-1 cursor-pointer"
          onClick={() => setCreatingNewCollection(true)}
        >
          Create Collection
        </button>
      ) : (
        <div className="flex">
          <form onSubmit={handleCreateCollection} className="flex gap-2">
            <label htmlFor="new-collection" className="sr-only">
              New Collection Name
            </label>
            <input
              className="border-2 p-1"
              autoFocus
              type="text"
              name="new-collection"
              id="new-collection"
              placeholder="New Collection"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              required
            />
            <button type="submit" className="border-2 p-1 cursor-pointer">
              Save
            </button>

            <button
              type="button"
              className="border-2 p-1 cursor-pointer"
              onClick={() => {
                setCreatingNewCollection(false);
                setNewCollectionName("");
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
