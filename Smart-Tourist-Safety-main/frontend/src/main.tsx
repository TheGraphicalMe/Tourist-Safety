import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { TripProvider } from "./context/trip.context";

// Get token from localStorage
const token = localStorage.getItem("token") || "";

createRoot(document.getElementById("root")!).render(
  <TripProvider token={token}>
    <App />
  </TripProvider>
);
