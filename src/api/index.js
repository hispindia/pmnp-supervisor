import MetadataApiClass from "./MetadataApiClass";
import DataApiClass from "./DataApiClass";
import BaseApiClass from "./BaseApiClass";

const { VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD } = import.meta.env;

const baseApi = new BaseApiClass(VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD);
const dataApi = new DataApiClass(VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD);
const metadataApi = new MetadataApiClass(VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD);

export { dataApi, metadataApi, baseApi };
