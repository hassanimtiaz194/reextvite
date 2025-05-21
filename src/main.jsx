window.__IS_REEXT_RUNNING__ = true;

import React from "react";
import ReactDOM from "react-dom/client";
import { Fill, ReExtProvider } from "@sencha/reext";
import App from "./App";
import './index.css'; 

Fill();
var reactroot = ReactDOM.createRoot(document.getElementById("root"));
var ReExtData = {
  sdkversion: "7.8.0",
  toolkit: "classic",
  theme: "classic",
  packages: {
    charts: true,
    fontawesome: false,
    ux: true,
    calendar: false,
    d3: false,
    exporter: false,
    pivot: false,
    pivotd3: false,
    pivotlocale: false,
    froalaeditor: false,
  },
  rtl: false,
  locale: "en",
  debug: false,
  urlbase: "./",
  location: "remote",
  overrides: false,
};
reactroot.render(
  <React.StrictMode>
    <ReExtProvider
      ReExtData={ReExtData}
      splash={false}
      reextkey={import.meta.env.VITE_REEXT_KEY}
    >
      <App />
    </ReExtProvider>
  </React.StrictMode>
);
