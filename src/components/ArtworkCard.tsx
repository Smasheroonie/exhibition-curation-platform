type ArtworkCardProps = {
  title: string;
  thumbnail: string;
};

export default function ArtworkCard({ title, thumbnail }: ArtworkCardProps) {
  return (
    <div className="flex gap-2 outline m-3 p-4">
      <div className="outline">
        <img
          className="size-44 md:size-60 object-cover"
          src={
            thumbnail ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg/800px-Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg"
          }
          alt="placeholder artwork"
        />
      </div>
      <div className="flex flex-col justify-between w-full">
        <div className="flex flex-col gap-1">
          <h2 className="font-bold">{title}</h2>
          <p className="text-sm">
            Description lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem
            ipsum lorem ipsum lorem ipsum lorem ipsum{" "}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <button className="border-2 p-1">Share</button>
          <button className="border-2 p-1">Save to collection</button>
        </div>
      </div>
    </div>
  );
}
