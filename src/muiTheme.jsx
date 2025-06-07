import { createTheme } from "@material-ui/core";
import { PRIMARY_COLOR } from "./constants/app-config";

const muiTheme = createTheme({
  palette: {
    primary: { main: PRIMARY_COLOR },
    success: { main: "#158d46" }, // Example secondary color
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

export default muiTheme;
