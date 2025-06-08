import { useQuery } from "@tanstack/react-query";
import { fetchHAMObject } from "../api/hamApi";
import { useParams } from "react-router";
import { useEffect } from "react";

type Image = {
  baseimageurl: string;
  imageid: string;
};

export default function HAMArtwork() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["artwork", id],
    queryFn: () => fetchHAMObject(id),
    refetchOnWindowFocus: false,
  });

  console.log(data);

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error fetching data. Please try again.</span>;
  }

  if (!data) {
    return <span>No artwork data found.</span>;
  }

  return (
    <div>
      <h1 className="font-bold">{data?.title}</h1>
      <p>{data?.description || "No description."}</p>
      <p>{data?.century}</p>
      <p>{data?.culture}</p>
      <p>{data?.department}</p>
      <p>{data?.division}</p>
      <span>Technique: </span>
      <p>{data?.technique}</p>
      <span>Materials: </span>
      <p>{data?.medium}</p>
      {data?.images.map((image: Image) => (
        <img
          className="size-40"
          src={image.baseimageurl}
          alt={data?.title}
          key={image.imageid}
        />
      ))}
    </div>
  );
}

// add more data?
