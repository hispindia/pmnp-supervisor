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
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import { ConnectedRouter } from "connected-react-router";
import Layout from "./components/Layout";

const locales = ["en", "lo"];
let resources = {};

locales.forEach((l) => {
  resources[l] = Object.entries(locale).reduce(
    (accumulator, currentValue) => {
      const key = currentValue[0];
      const value = currentValue[1];
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

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
// serviceWorkerRegistration.register();
