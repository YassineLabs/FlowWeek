import React from "react";
import "./app/globals.css";
import { ServiceWorkerRegistration } from "./components/ServiceWorkerRegistration";
import HomePage from "./app/page";

function App() {
  return (
    <>
      <ServiceWorkerRegistration />
      <HomePage />
    </>
  );
}

export default App;

