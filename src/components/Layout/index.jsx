import React from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import AppContextProvider from "../App/App.context";
import styles from "../../components/App/App.module.css";

import HeaderBar from "@/components/HeaderBar/HeaderBar.component";
import { useDisableSwipeDownRefresh, useIsPwa } from "@/hooks";
import { ConfigProvider } from "antd";
const { app, headerBarContainer } = styles;
import antdThemeConfig from "@/antdTheme";
import muiTheme from "@/muiTheme";

const Layout = ({ children }) => {
  const isPwa = useIsPwa();
  // useDisableSwipeDownRefresh();

  return (
    <SnackbarProvider maxSnack={3}>
      <AppContextProvider>
        <ThemeProvider theme={muiTheme}>
          <ConfigProvider theme={antdThemeConfig}>
            <div className={app}>
              {!isPwa && (
                <div className={headerBarContainer}>
                  <HeaderBar title="Scorecard Survey" />
                </div>
              )}
              {children}
            </div>
          </ConfigProvider>
        </ThemeProvider>
      </AppContextProvider>
    </SnackbarProvider>
  );
};

export default Layout;
