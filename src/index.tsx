import "./index.css";
// import App from "./App";

import "typeface-roboto";
import React from "react";
import ReactDOM from "react-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import AppContainer from "./containers/App/App";
import locale from "./locale";
import "./index.css";

import { Provider } from "react-redux";
import configureStore, { history } from "./redux/store";
// import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

import { ConnectedRouter } from "connected-react-router";
import Layout from "./components/Layout";

const locales = ["en", "lo"];
let resources: any = {};

locales.forEach((l) => {
  resources[l] = Object.entries(locale).reduce(
    (accumulator: any, currentValue) => {
      const key = currentValue[0];
      const value: any = currentValue[1];
      accumulator.translation[key] = value[l];
      return accumulator;
    },
    { translation: {} }
  );
});
i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const store = configureStore();

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Layout>
          <AppContainer />
        </Layout>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

// const root = ReactDOM.createRoot(
//   document.getElementById("root") as HTMLElement
// );

// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js") // Path to your service worker file
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope
        );
      })
      .catch((err) => {
        console.error("Service Worker registration failed:", err);
      });
  });
}
