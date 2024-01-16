import { Provider } from "@dhis2/app-runtime";
import { HeaderBar } from "@dhis2/ui-widgets";
import { useEffect, useState } from "react";
import useApi from "../../hooks/useApi";
import "./HeaderBar.styles.css";
import propTypes from "./HeaderBar.types.js";

const Dhis2HeaderBar = ({ title }) => {
  const { metadataApi } = useApi();
  const [data, setData] = useState(null);
  useEffect(() => {
    // metadataApi.getHeaderBarData().then((json) => {
    //   json.title = title;
    //   setData(json);
    // });
  }, []);
  return (
    <Provider config={{ apiVersion: "33", baseUrl: "../../.." }}>
      {/* <CustomDataProvider data={createCustomData(data)}> */}
      <HeaderBar appName={title} />
      {/* </CustomDataProvider> */}
    </Provider>
  );
};

Dhis2HeaderBar.propTypes = propTypes;
export default Dhis2HeaderBar;
