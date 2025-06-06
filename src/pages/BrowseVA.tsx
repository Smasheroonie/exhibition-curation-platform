import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import ArtworkCard from "../components/ArtworkCard";
import { fetchVAArtworks } from "../api/vaApi";
import { useEffect, useState } from "react";

type Images = {
  [key: string]: string;
};

type Artwork = {
  systemNumber: string;
  _primaryTitle: string;
  _images: Images;
};

export default function BrowseVA() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("vinci");
  const [orderParam, setOrderParam] = useState("date");
  const [sortParam, setSortParam] = useState("desc");

  const { status, data, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["artworks", page],
    queryFn: () => fetchVAArtworks(searchTerm, page, orderParam, sortParam),
    placeholderData: keepPreviousData,
    staleTime: 5000,
  });

  useEffect(() => {
    if (!isPlaceholderData && data?.hasMore) {
      queryClient.prefetchQuery({
        queryKey: ["artworks", page + 1],
        queryFn: () =>
          fetchVAArtworks(searchTerm, page + 1, orderParam, sortParam),
      });
    }
  }, [data, isPlaceholderData, page, queryClient]);

  return (
    <div>
      {status === "pending" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error: {error.message}</div>
      ) : (
        <div className="flex justify-center">
          <div className="flex-col space-y-3 w-screen">
            {data.records.map((artwork: Artwork) => (
              <ArtworkCard
                key={artwork.systemNumber}
                title={artwork._primaryTitle}
                thumbnail={artwork._images._primary_thumbnail}
              />
            ))}
          </div>
        </div>
      )}
      <div>Current Page: {page}</div>
      <button
        className="outline"
        onClick={() => setPage((old) => old - 1)}
        disabled={page === 1}
      >
        Previous Page
      </button>{" "}
      <button
        className="outline"
        onClick={() => {
          setPage((old) => old + 1);
        }}
      >
        Next Page
      </button>
      {
        // Since the last page's data potentially sticks around between page requests,
        // we can use `isFetching` to show a background loading
        // indicator since our `status === 'pending'` state won't be triggered
        isFetching ? <span> Loading...</span> : null
      }
    </div>
  );
}
