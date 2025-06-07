import { useQuery } from "@tanstack/react-query";
import { fetchHAMObject } from "../api/hamApi";
import { useParams } from "react-router";
import { useEffect } from "react";

export default function HAMArtwork() {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["artwork"],
    queryFn: () => fetchHAMObject(id),
  });

  console.log(data);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      {data?.images.map((image) => (
        <img className="size-40" src={image.baseimageurl} alt="" />
      ))}
    </div>
  );
}

// add more data?
