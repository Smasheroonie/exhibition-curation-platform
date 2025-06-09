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
    <div>
      <h1 className="font-bold">{data?.record.titles[0].title}</h1>
      {data?.record.images.map((image: string) => (
        <img
          className="size-40"
          src={`https://framemark.vam.ac.uk/collections/${image}/full/max/0/default.jpg`}
          alt={data?.record.titles[0].title}
          key={image}
        />
      ))}
      {session ? (
        <button
          className="border-2 p-1 cursor-pointer"
          onClick={() =>
            handleOpenSave(
              data?.record.systemNumber,
              data?.record.titles[0].title,
              `https://framemark.vam.ac.uk/collections/${data?.record.images[0]}/full/max/0/default.jpg`
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
              <button
                key={collection.collection_id}
                className="border-2 p-1 cursor-pointer"
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
      <p>{data?.record.briefDescription}</p>
      <p>{data?.record.objectHistory}</p>
      <p>{data?.record.summaryDescription}</p>
      <span>Categories: </span>
      {data?.record.categories.map((category: DataCategory) => (
        <p key={category.id}>{category.text}</p>
      ))}
      <span>Techniques: </span>
      {data?.record.techniques.map((technique: DataCategory) => (
        <p key={technique.id}>{technique.text}</p>
      ))}
      <span>Materials: </span>
      {data?.record.materials.map((material: DataCategory) => (
        <p key={material.id}>{material.text}</p>
      ))}
    </div>
  );
}

// add more data?
