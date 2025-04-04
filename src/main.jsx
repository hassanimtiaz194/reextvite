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
      splash={true}
      reextkey={
        "TU5RRGZrek9nUXUyNHVvUExOTHZLTk9iT2tCMXBNM1JGUFNkdW95SFgydS45ZEROeUlUT3lZRE4zRWpPaUFIZWxKQ0xpTTNhd3AzTWxwMloxQUhOM2RYWWxwbmJ3Z0dOaGxYY3FGRE1mUldhc0ppT2lJV2R6SnllLjlKaU4xSXpVSUppT2ljR2JoSnll"
      }
    >
      <App />
    </ReExtProvider>
  </React.StrictMode>
);
