import React, { useState } from "react";
import moment from "moment";

export const AppContext = React.createContext(null);

export default ({ children }) => {
  const lastInputDataYear = moment()
    // .subtract(1, "years")
    // .endOf('year')
    .format("YYYY");
  const [minDate] = useState("2018");
  const [maxDate] = useState(lastInputDataYear);
  const [selectedOrgUnit, setSelectedOrgUnit] = useState(
    sessionStorage.getItem("selectedOrgUnit")
      ? JSON.parse(sessionStorage.getItem("selectedOrgUnit"))
      : ""
  );

  if (process.env.NODE_ENV == "development") {
  }

  const [selectedProgram, setSelectedProgram] = useState("L0EgY4EomHv");
  const [selectedTei, setSelectedTei] = useState(null);
  const [selectedEnr, setSelectedEnr] = useState(null);

  const store = {
    orgUnit: { selectedOrgUnit, setSelectedOrgUnit },
    program: { selectedProgram, setSelectedProgram },
    tei: { selectedTei, setSelectedTei },
    enr: { selectedEnr, setSelectedEnr },
    minDate: minDate,
    maxDate: maxDate,
  };

  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};
