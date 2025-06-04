import { Route, Routes } from "react-router";
import BrowseVA from "./pages/BrowseVA";
import BrowseHAM from "./pages/BrowseHAM";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex-1 pt-16">
        <div className="min-h-screen">
          <Routes>
            <Route index element={<Home />} />
            <Route path="browse-va" element={<BrowseVA />} />
            <Route path="browse-ham" element={<BrowseHAM />} />
          </Routes>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
