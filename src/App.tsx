import { Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Browse from "./pages/Browse";
import VAArtwork from "./pages/VAArtwork";
import HAMArtwork from "./pages/HAMArtwork";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex-1 pt-16">
        <div className="min-h-screen">
          <Routes>
            <Route index element={<Browse />} />
            <Route path="/artwork/va/:id" element={<VAArtwork />} />
            <Route path="/artwork/harvard/:id" element={<HAMArtwork />} />
          </Routes>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
