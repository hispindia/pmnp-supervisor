import { createTheme } from "@material-ui/core";
import { PRIMARY_COLOR } from "./constants/app-config";

const muiTheme = createTheme({
  palette: {
    primary: { main: PRIMARY_COLOR },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default muiTheme;
