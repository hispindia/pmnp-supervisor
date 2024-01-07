import { useState } from "react";
import MetadataApiClass from "../api/MetadataApiClass";
import DataApiClass from "../api/DataApiClass";

const useApi = () => {
  const [metadataApi, setMetadataApi] = useState(
    new MetadataApiClass(
      process.env.REACT_APP_BASE_URL,
      process.env.REACT_APP_USERNAME,
      process.env.REACT_APP_PASSWORD
    )
  );
  const [dataApi, setDataApi] = useState(
    new DataApiClass(
      process.env.REACT_APP_BASE_URL,
      process.env.REACT_APP_USERNAME,
      process.env.REACT_APP_PASSWORD
    )
  );
  return {
    metadataApi,
    dataApi,
  };
};

export default useApi;
