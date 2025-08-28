import { ConnectedRouter } from "connected-react-router";
import i18n from "i18next";
import React from "react";
import ReactDOM from "react-dom/client";
import { initReactI18next } from "react-i18next";
import { Provider } from "react-redux";
import { registerSW } from "virtual:pwa-register";
import Layout from "./components/Layout";
import { LOCALE_CODES } from "./constants/app-config";
import AppContainer from "./containers/App/App";
import "./index.css";
import locale from "./locale";
import { history, mainStore } from "./redux/store";

const locales = [LOCALE_CODES.english, LOCALE_CODES.tagalog, LOCALE_CODES.cebuano];
let resources = {};

locales.forEach((l) => {
  resources[l] = Object.entries(locale).reduce(
    (accumulator, currentValue) => {
      const key = currentValue[0];
      const value = currentValue[1];
      accumulator.translation[key] = value[l];
      return accumulator;
    },
    { translation: {} },
  );
});
i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

// export const store = configureStore();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={mainStore}>
      <ConnectedRouter history={history}>
        <Layout>
          <AppContainer />
        </Layout>
      </ConnectedRouter>
    </Provider>
  </React.StrictMode>,
);

if ("serviceWorker" in navigator) {
  // && !/localhost/.test(window.location)) {
  registerSW();
}
