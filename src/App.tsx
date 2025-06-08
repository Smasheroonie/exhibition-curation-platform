import { Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Browse from "./pages/Browse";
import VAArtwork from "./pages/VAArtwork";
import HAMArtwork from "./pages/HAMArtwork";
import Header from "./components/Header";
import SignIn from "./pages/SignIn";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Header />
      <div className="flex-1 pt-16">
        <div className="min-h-screen">
          <Routes>
            <Route index element={<Browse />} />
            <Route path="/artwork/va/:id" element={<VAArtwork />} />
            <Route path="/artwork/harvard/:id" element={<HAMArtwork />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/profile/:uid" element={<UserProfile />} />
          </Routes>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
