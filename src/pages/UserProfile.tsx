import { Link, useParams } from "react-router";
import { UserAuth } from "../context/AuthContext";
import { useState, useEffect, type FormEvent } from "react";
import {
  deleteCollection,
  getCollections,
  getUser,
  insertCollection,
  type Collection,
} from "../api/supabase";
import { GridLoader } from "react-spinners";

export default function UserProfile() {
  const { session } = UserAuth();
  const { uid } = useParams();
  const [collections, setCollections] = useState<Collection[] | []>([]);
  const [creatingNewCollection, setCreatingNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [profileName, setProfileName] = useState("User");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    if (session?.user.id) {
      const fetchedCollections = await getCollections(session.user.id);
      if (fetchedCollections) {
        setCollections(fetchedCollections);
      } else {
        setCollections([]);
      }
    }
  };

  const getProfile = async () => {
    const user = await getUser(uid);
    setProfileName(user.username);
    setLoading(false);
  };

  useEffect(() => {
    if (!session) {
      setLoggedIn(false);
    } else {
      setLoggedIn(true);
      fetchCollections();
      getProfile();
    }
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

  return !loggedIn ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <span className="text-red-400 text-2xl">
        Please log in to view profile.
      </span>
    </div>
  ) : loggedIn && loading ? (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
      <GridLoader color="#155dfc" size={50} aria-label="Loading spinner" />
    </div>
  ) : (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {uid === session?.user.id ? (
          <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            Welcome, {profileName}
          </h1>
        ) : (
          <h1 className="text-xl font-semibold text-gray-800 mb-4 text-center">
            You are visiting another user's profile.
          </h1>
        )}
        <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8 text-center">
          Collections
        </h2>
        {collections.length > 0 ? (
          <div className="space-y-4">
            {collections.map((collection) => (
              <div
                key={collection.collection_id}
                className="flex items-center justify-between gap-4 p-3 bg-white rounded-lg shadow-sm border border-gray-200"
              >
                <Link
                  to={`/collection/${uid}/${collection.collection_id}`}
                  className="flex-grow text-lg font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  <p>{collection.collection_name}</p>
                </Link>
                {session && session.user.id === uid ? (
                  <button
                    className="px-4 py-2 rounded-md bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200"
                    onClick={() => handleDelete(collection.collection_id, uid)}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic text-center">
            No collections found.
          </p>
        )}
        {session && session.user.id === uid && (
          <div className="mt-8 flex justify-center">
            {!creatingNewCollection ? (
              <button
                className="px-5 py-2 rounded-md bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors duration-200"
                onClick={() => setCreatingNewCollection(true)}
              >
                Create New Collection
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full max-w-md">
                <form
                  onSubmit={handleCreateCollection}
                  className="flex flex-col sm:flex-row gap-3 w-full"
                >
                  <label htmlFor="new-collection" className="sr-only">
                    New Collection Name
                  </label>
                  <input
                    className="flex-grow border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                    type="text"
                    name="new-collection"
                    id="new-collection"
                    placeholder="New Collection Name"
                    value={newCollectionName}
                    onChange={(e) => setNewCollectionName(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-5 py-2 rounded-md bg-gray-400 text-white font-medium hover:bg-gray-500 transition-colors duration-200"
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
        )}
      </div>
    </div>
  );
}
