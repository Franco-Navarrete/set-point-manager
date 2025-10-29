import { createRoot } from "react-dom/client";
import { LeagueProvider } from "./contexts/LeagueContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <LeagueProvider>
    <App />
  </LeagueProvider>
);
