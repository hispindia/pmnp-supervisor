import MetadataApiClass from "./MetadataApiClass";
import DataApiClass from "./DataApiClass";
const dataApi = new DataApiClass(
  process.env.REACT_APP_BASE_URL,
  process.env.REACT_APP_USERNAME,
  process.env.REACT_APP_PASSWORD
);
const metadataApi = new MetadataApiClass(
  process.env.REACT_APP_BASE_URL,
  process.env.REACT_APP_USERNAME,
  process.env.REACT_APP_PASSWORD
);

export { dataApi, metadataApi };
