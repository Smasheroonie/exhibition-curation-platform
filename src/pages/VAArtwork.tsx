import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { fetchVAObject } from "../api/vaApi";
import { useEffect } from "react";

type DataCategory = {
  text: string;
  id: string;
};

export default function VAArtwork() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { id } = useParams();

  const { data, isPending, isError } = useQuery({
    queryKey: ["artwork"],
    queryFn: () => fetchVAObject(id),
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
      <h1 className="font-bold">{data?.record.titles[0].title}</h1>
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
      {data?.record.images.map((image: string) => (
        <img
          className="size-40"
          src={`https://framemark.vam.ac.uk/collections/${image}/full/max/0/default.jpg`}
          alt={data?.record.titles[0].title}
          key={image}
        />
      ))}
    </div>
  );
}

// add more data?
