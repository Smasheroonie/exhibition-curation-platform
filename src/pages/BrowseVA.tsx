import { useQuery } from "@tanstack/react-query";
import ArtworkCard from "../components/ArtworkCard";
import { fetchVAArtworks } from "../api/vaApi";

type Images = {
  [key: string]: string;
};

type Artwork = {
  systemNumber: string;
  _primaryTitle: string;
  _images: Images;
};

export default function BrowseVA() {
  const query = useQuery({
    queryKey: ["VAArtworks"],
    queryFn: fetchVAArtworks,
  });

  if (query.status === "error") {
    return <p>Error!</p>;
  }

  console.log(query.data?.records);

  return (
    <div className="flex justify-center">
      <div className="flex-col space-y-3 w-screen">
        {query.data?.records.map((artwork: Artwork) => (
          <ArtworkCard
            key={artwork.systemNumber}
            title={artwork._primaryTitle}
            thumbnail={artwork._images._primary_thumbnail}
          />
        ))}
      </div>
    </div>
  );
}
