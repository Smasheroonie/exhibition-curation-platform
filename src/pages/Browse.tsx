import { useEffect, useState, type FormEvent } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVAArtworks } from "../api/vaApi";
import { fetchHAMArtworks } from "../api/hamApi";
import { GridLoader } from "react-spinners";
import { useSearchParams } from "react-router";

type HamArtwork = {
  id: number;
  institution: string;
  title: string;
  primaryimageurl: string;
  culture: string;
  dated: string;
  people: [key: { name: string }];
};

type VaArtwork = {
  systemNumber: string;
  institution: string;
  _primaryTitle: string;
  _images: {
    _iiif_image_base_url: string;
  };
  _primaryPlace: string;
  _primaryDate: string;
  _primaryMaker: {
    name: string;
  };
};

type ProcessedArtwork = {
  key: string;
  institution: string;
  title: string;
  thumbnail: string;
  place: string;
  date: string;
  person: string;
};

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("Art");
  const [orderParam, setOrderParam] = useState(
    searchParams.get("order") || "desc"
  );
  const [allArtworks, setAllArtworks] = useState<ProcessedArtwork[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const vaQuery = useQuery({
    queryKey: ["vaArtworks", page, searchTerm, orderParam],
    queryFn: () => fetchVAArtworks(searchTerm, page, orderParam),
    staleTime: 300000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  const hamQuery = useQuery({
    queryKey: ["hamArtworks", page, searchTerm, orderParam],
    queryFn: () => fetchHAMArtworks(searchTerm, page, orderParam),
    staleTime: 300000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (vaQuery.isSuccess && hamQuery.isSuccess) {
      const hamArray: ProcessedArtwork[] =
        hamQuery.data?.records?.map((artwork: HamArtwork) => ({
          key: artwork.id.toString(),
          institution: "harvard",
          title: artwork.title,
          thumbnail: artwork.primaryimageurl,
          place: artwork.culture,
          date: artwork.dated,
          person: artwork.people?.[0]?.name || "Unknown",
        })) || [];

      const vaArray: ProcessedArtwork[] =
        vaQuery.data?.records?.map((artwork: VaArtwork) => ({
          key: artwork.systemNumber,
          institution: "va",
          title: artwork._primaryTitle,
          thumbnail:
            artwork._images?._iiif_image_base_url + "/full/max/0/default.jpg" ||
            "",
          place: artwork._primaryPlace,
          date: artwork._primaryDate,
          person: artwork._primaryMaker?.name || "Unknown",
        })) || [];

      const combinedArr = hamArray.concat(vaArray);

      combinedArr.sort((a, b) => {
        const getYear = (dateString: string | undefined): number => {
          if (!dateString) {
            return 0;
          }

          const centuryMatch = dateString.match(
            /(\d{1,2})(?:st|nd|rd|th)\s+Century/i
          );
          if (centuryMatch && centuryMatch[1]) {
            const centuryNumber = parseInt(centuryMatch[1]);
            return centuryNumber * 100 - 1;
          }

          const decadeMatch = dateString.match(/(\d{4})s/);
          if (decadeMatch && decadeMatch[1]) {
            return parseInt(decadeMatch[1]);
          }

          const yearMatch = dateString.match(/\d{4}/);
          if (yearMatch && yearMatch[0]) {
            return parseInt(yearMatch[0]);
          }

          return 0;
        };

        const dateA = getYear(a.date);
        const dateB = getYear(b.date);

        if (orderParam === "desc") {
          return dateB - dateA;
        }

        return dateA - dateB;
      });

      setAllArtworks(combinedArr);
    }
  }, [
    vaQuery.data,
    hamQuery.data,
    vaQuery.isSuccess,
    hamQuery.isSuccess,
    orderParam,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [vaQuery.data, hamQuery.data]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setPage(1);
    if (searchInput.length) {
      setSearchTerm(searchInput);
    } else {
      setSearchTerm("Art");
    }
  };

  if (vaQuery.isPending || hamQuery.isPending) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
        <GridLoader color="#155dfc" size={50} aria-label="Loading spinner" />
      </div>
    );
  }

  if (vaQuery.isError || hamQuery.isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-8 px-4">
        <span className="text-red-400 text-2xl">
          Error fetching data. Please try again.
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center mb-6 w-full max-w-md rounded-md shadow-md"
      >
        <label htmlFor="searchbar" className="sr-only">
          Search Artworks
        </label>
        <input
          className="flex-grow border border-gray-300 rounded-l-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          type="text"
          name="searchbar"
          id="searchbar"
          placeholder="Search art"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md transition-colors duration-200"
        >
          Search
        </button>
      </form>

      <div className="flex items-center gap-2 mb-6">
        <label htmlFor="order-select" className="font-medium text-gray-700">
          Order:{" "}
        </label>
        <select
          name="order-select"
          id="order-select"
          value={orderParam}
          onChange={(e) => {
            setOrderParam(e.target.value);
            setSearchParams({ order: e.target.value });
          }}
          className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 py-6">
          {allArtworks?.map((artwork) => (
            <ArtworkCard
              key={artwork.key}
              title={artwork.title}
              thumbnail={artwork.thumbnail}
              place={artwork.place}
              date={artwork.date}
              person={artwork.person}
              institution={artwork.institution}
              objectId={artwork.key}
            />
          ))}
        </div>

        <div className="flex justify-center items-center gap-4 py-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => setPage((old) => old - 1)}
            disabled={page === 1}
          >
            Previous Page
          </button>
          <p className="text-lg font-medium text-gray-700">
            Current Page: {page}
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            onClick={() => {
              setPage((old) => old + 1);
            }}
            disabled={
              page >= (vaQuery.data?.info.pages || 0) &&
              page >= (hamQuery.data?.info.pages || 0)
            }
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
}
