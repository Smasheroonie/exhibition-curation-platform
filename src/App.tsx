import { Route, Routes } from "react-router";
import Browse from "./pages/Browse";
import Home from "./pages/Home";

function App() {
  return (
    <div className="flex-1 pt-16">
      <div className="min-h-screen">
        <Routes>
          <Route index element={<Home />} />
          <Route path="browse" element={<Browse />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
