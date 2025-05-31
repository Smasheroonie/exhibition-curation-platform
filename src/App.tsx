import { Route, Routes } from "react-router";
import Browse from "./pages/Browse";
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
            <Route path="browse" element={<Browse />} />
          </Routes>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
