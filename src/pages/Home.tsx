export default function Home() {
  return (
    <div className="flex justify-center">
      <a href="/browse-va" className="border-2 m-2 p-1">
        Victoria & Albert Museum
      </a>
      <a href="/browse-ham" className="border-2 m-2 p-1">
        Harvard Art Museum
      </a>
      <a href="/browse" className="border-2 m-2 p-1">
        Browse
      </a>
    </div>
  );
}
