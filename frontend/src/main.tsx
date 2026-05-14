import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// @ts-ignore: side-effect CSS import type declaration
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);