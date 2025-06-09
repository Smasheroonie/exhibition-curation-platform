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
    <div>
      <h1 className="font-bold">{data?.title}</h1>
      {data?.images.map((image: Image) => (
        <img
          className="size-40"
          src={image.baseimageurl}
          alt={data?.title}
          key={image.imageid}
        />
      ))}
      {session ? (
        <button
          className="border-2 p-1 cursor-pointer"
          onClick={() =>
            handleSave(
              data?.objectid,
              data?.title,
              data?.images[0].baseimageurl
            )
          }
        >
          Save
        </button>
      ) : null}
      {collectionModalOpen && collections.length > 0 ? (
        <div>
          {collections?.map((collection: Collection) => {
            return (
              <Link
                key={collection.collection_id}
                to={`/collection/${collection.collection_id}`}
                className="border-2 p-1 cursor-pointer"
              >
                {collection.collection_name}
              </Link>
            );
          })}
          <button
            className="border-2 p-1 cursor-pointer"
            onClick={() => setCollectionModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      ) : collectionModalOpen && collections.length === 0 ? (
        <div>
          <p>No Collections!</p>
          <button
            className="border-2 p-1 cursor-pointer"
            onClick={() => setCollectionModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      ) : null}
      <p>{data?.description || "No description."}</p>
      <p>{data?.century}</p>
      <p>{data?.culture}</p>
      <p>{data?.department}</p>
      <p>{data?.division}</p>
      <span>Technique: </span>
      <p>{data?.technique}</p>
      <span>Materials: </span>
      <p>{data?.medium}</p>
    </div>
  );
}

// add more data?
