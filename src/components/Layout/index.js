import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import AppContextProvider from "../../components/App/App.context";
import styles from "../../components/App/App.module.css";

import HeaderBar from "../../components/HeaderBar/HeaderBar.component";
const { app, headerBarContainer } = styles;

const theme = createMuiTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

const Layout = ({ children }) => {
  return (
    <SnackbarProvider maxSnack={3}>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <div className={app}>
            <div className={headerBarContainer}>
              <HeaderBar title="Family Information System" />
              {/* HeaderBar testing */}
            </div>
            {children}
          </div>
        </ThemeProvider>
      </AppContextProvider>
    </SnackbarProvider>
  );
};

export default Layout;
