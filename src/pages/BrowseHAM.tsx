import { useQuery } from "@tanstack/react-query";
import ArtworkCard from "../components/ArtworkCard";
import { fetchHAMArtworks } from "../api/hamApi";

type Artwork = {
  objectnumber: string;
  title: string;
  images: any[];
};

export default function BrowseHAM() {
  const query = useQuery({
    queryKey: ["HAMArtworks"],
    queryFn: fetchHAMArtworks,
  });

  if (query.status === "error") {
    return <p>Error!</p>;
  }

  console.log(query.data);

  return (
    <div className="flex justify-center">
      <div className="flex-col space-y-3 w-screen">
        {query.data?.records.map((artwork: Artwork) => (
          <ArtworkCard
            key={artwork.objectnumber}
            title={artwork.title}
            thumbnail={artwork.images[0].baseimageurl}
          />
        ))}
      </div>
    </div>
  );
}
