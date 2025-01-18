import React from "react"
import { createRoot } from "react-dom/client"
import "./i18n"
import App from "./App"
import { IonItem, IonToggle } from "@ionic/react"

const onClick = (e: CustomEvent) => {
  console.log("Toggle clicked", e.detail.checked);
};

const container = document.getElementById("root")
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
