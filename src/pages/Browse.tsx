import ArtworkCard from "../components/ArtworkCard";

export default function Browse() {
  return (
    <div className="flex justify-center">
      <div className="flex-col space-y-3 w-screen">
        <ArtworkCard />
        <ArtworkCard />
        <ArtworkCard />
      </div>
    </div>
  );
}
