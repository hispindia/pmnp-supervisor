import { useState } from "react";
import MetadataApiClass from "../api/MetadataApiClass";
import DataApiClass from "../api/DataApiClass";

const { VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD } = import.meta.env;

const useApi = () => {
  const [metadataApi, setMetadataApi] = useState(
    new MetadataApiClass(VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD)
  );
  const [dataApi, setDataApi] = useState(
    new DataApiClass(VITE_BASE_URL, VITE_USERNAME, VITE_PASSWORD)
  );
  return {
    metadataApi,
    dataApi,
  };
};

export default useApi;
