import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import Header from "./components/Header.tsx";

createRoot(document.getElementById("root")!).render(
  <div className="relative flex min-h-screen flex-col">
    <Header />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </div>
);
