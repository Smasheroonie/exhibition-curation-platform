import { useEffect, useState, type FormEvent } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchVAArtworks } from "../api/vaApi";
import { fetchHAMArtworks } from "../api/hamApi";

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
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("Art");
  const [orderParam, setOrderParam] = useState("desc");
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
    return <span>Loading...</span>;
  }

  if (vaQuery.isError || hamQuery.isError) {
    return <span>Error fetching data. Please try again.</span>;
  }

  return (
    <div className="flex-col justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex justify-center mt-3 w-screen"
      >
        <label htmlFor="searchbar"></label>
        <input
          className="outline px-1"
          type="text"
          name="searchbar"
          id="searchbar"
          placeholder="Search art"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button type="submit" className="bg-blue-300 outline ml-1 px-1">
          Search
        </button>
      </form>
      <div className="flex justify-center pt-3 gap-2">
        <label htmlFor="order-select">Order: </label>
        <select
          name="order-select"
          id="order-select"
          value={orderParam}
          onChange={(e) => setOrderParam(e.target.value)}
          className=""
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>
      <div>
        <div className="flex-col space-y-3">
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
        <div>Current Page: {page}</div>
        <button
          className="outline disabled:text-gray-500"
          onClick={() => setPage((old) => old - 1)}
          disabled={page === 1}
        >
          Previous Page
        </button>{" "}
        <button
          className="outline disabled:text-gray-500"
          onClick={() => {
            setPage((old) => old + 1);
          }}
          disabled={
            page >= vaQuery.data?.info.pages &&
            page >= hamQuery.data?.info.pages
          }
        >
          Next Page
        </button>
      </div>
    </div>
  );
}

// grid with larger images on desktop
