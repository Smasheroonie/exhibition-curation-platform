export default function Header() {
  return (
    <header className="fixed top-0 z-40 px-8 w-full border-b bg-white">
      <div className="flex h-16 items-center space-x-4 justify-between sm:space-x-0">
        <a href="/" className="flex items-center space-x-2">
          <span className="inline-block font-bold cursor-pointer">Home</span>
        </a>
      </div>
    </header>
  );
}
