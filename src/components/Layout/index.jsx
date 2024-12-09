import React from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import AppContextProvider from "../App/App.context";
import styles from "../../components/App/App.module.css";

import HeaderBar from "@/components/HeaderBar/HeaderBar.component";
import { useDisableSwipeDownRefresh, useIsPwa } from "@/hooks";
const { app, headerBarContainer } = styles;

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

const Layout = ({ children }) => {
  const isPwa = useIsPwa();
  // useDisableSwipeDownRefresh();

  return (
    <SnackbarProvider maxSnack={3}>
      <AppContextProvider>
        <ThemeProvider theme={theme}>
          <div className={app}>
            {!isPwa && (
              <div className={headerBarContainer}>
                <HeaderBar title="Household Information System" />
              </div>
            )}
            {children}
          </div>
        </ThemeProvider>
      </AppContextProvider>
    </SnackbarProvider>
  );
};

export default Layout;
