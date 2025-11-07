const jsonfile = require("jsonfile");
require("dotenv/config");
const manifest = require("./manifest.webapp.json");

// const { VITE_APP_NAME, VITE_APP_ICON } = process.env;
// manifest.name = VITE_APP_NAME;
// manifest.short_name = VITE_APP_NAME;
// manifest.description = VITE_APP_NAME;
// manifest.short_name = VITE_APP_NAME;
// if (VITE_APP_ICON) {
//   manifest.icons["16"] = VITE_APP_ICON;
//   manifest.icons["48"] = VITE_APP_ICON;
//   manifest.icons["128"] = VITE_APP_ICON;
// }

// FOR PWA
// jsonfile.writeFileSync("./dist/manifest.webmanifest", manifest);

// FOR WEBAPP DHIS2
manifest.icons = {
  16: "logo.png",
  48: "logo.png",
  128: "logo.png",
  144: "logo.png",
};

jsonfile.writeFileSync("./dist/manifest.webapp", manifest);
