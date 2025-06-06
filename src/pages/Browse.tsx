import ArtworkCard from "../components/ArtworkCard";

const artworks = [
  {
    key: 1,
    title: "art1",
    thumbnail:
      "https://images.stockcake.com/public/a/1/c/a1c24dd3-a7e4-4f2e-a6db-ececf83f3c6f_large/artist-s-blank-canvas-stockcake.jpg",
  },
  {
    key: 2,
    title: "art2",
    thumbnail:
      "https://images.stockcake.com/public/a/1/c/a1c24dd3-a7e4-4f2e-a6db-ececf83f3c6f_large/artist-s-blank-canvas-stockcake.jpg",
  },
  {
    key: 3,
    title: "art3",
    thumbnail:
      "https://images.stockcake.com/public/a/1/c/a1c24dd3-a7e4-4f2e-a6db-ececf83f3c6f_large/artist-s-blank-canvas-stockcake.jpg",
  },
];

export default function Browse() {
  return (
    <div className="flex justify-center">
      <div className="flex-col space-y-3 w-screen">
        {artworks.map((artwork) => (
          <ArtworkCard key={artwork.key} title={artwork.title} thumbnail={artwork.thumbnail} />
        ))}
      </div>
    </div>
  );
}
