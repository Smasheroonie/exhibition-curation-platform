import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchVAObject } from "../api/vaApi";
import { useEffect } from "react";

export default function VAArtwork() {
  const { id } = useParams();

  const { data } = useQuery({
    queryKey: ["artwork"],
    queryFn: () => fetchVAObject(id),
  });

  console.log(data);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <h1 className="font-bold">{data?.record.titles[0].title}</h1>
      <p>{data?.record.briefDescription}</p>
      <p>{data?.record.objectHistory}</p>
      <p>{data?.record.summaryDescription}</p>
      <span>Categories: </span>
      {data?.record.categories.map((category) => (
        <p>{category.text}</p>
      ))}
      <span>Techniques: </span>
      {data?.record.techniques.map((technique) => (
        <p>{technique.text}</p>
      ))}
      <span>Materials: </span>
      {data?.record.materials.map((material) => (
        <p>{material.text}</p>
      ))}
      {data?.record.images.map((image: string) => (
        <img
          className="size-40"
          src={`https://framemark.vam.ac.uk/collections/${image}/full/max/0/default.jpg`}
          alt=""
        />
      ))}
    </div>
  );
}

// add more data?
