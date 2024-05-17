import MetadataApiClass from "./MetadataApiClass";
import DataApiClass from "./DataApiClass";

const { VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD } = import.meta.env;

const dataApi = new DataApiClass(VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD);
const metadataApi = new MetadataApiClass(
  VITE_BASE_URL,
  VITE_USERNAME,
  VITE_PASSWORD
);

export { dataApi, metadataApi };
