import { PRIMARY_COLOR } from "./constants/app-config";

const antdThemeConfig = {
  token: {
    colorPrimary: PRIMARY_COLOR,
    colorPrimaryText: "#fff",
    colorSuccess: "#158d46",
    colorSuccessText: "#fff",
  },
  components: {
    Button: {
      colorPrimary: PRIMARY_COLOR,
      colorPrimaryText: "#fff",
      colorSuccess: "#158d46",
      colorSuccessText: "#fff",
    },
    Input: {
      colorPrimary: PRIMARY_COLOR,
    },
    Select: {
      colorPrimary: PRIMARY_COLOR,
    },
  },
};

export default antdThemeConfig;
