import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  changeEventFamily,
  cloneFamily,
  deleteEventFamily,
  // updateFamilyDate, // dont use
} from "@/redux/actions/data/tei";

/* components */
import AddYearButton from "@/components/Buttons/AddYearButton.jsx";
import SidebarItem from "@/components/Buttons/SidebarItem.jsx";
import { MEMBER_IN_YEAR_PROGRAM_STAGE_ID } from "@/constants/app-config";

const SideBar = () => {
  const dispatch = useDispatch();
  const [warningText, setWarningText] = useState(null);

  const { currentEvents } = useSelector((state) => state.data.tei.data);
  const memberDetailsEvents = currentEvents.filter(
    (e) => e.programStage === MEMBER_IN_YEAR_PROGRAM_STAGE_ID
  );

  const { maxDate, minDate } = useSelector((state) => state.metadata);
  const selectedYear = useSelector((state) => state.data.tei.selectedYear);
  const { selected6Month } = selectedYear;

  const childRef = useRef();

  const onChangeFamily = (index, year) => {
    dispatch(changeEventFamily(index, year, selected6Month));
  };

  const onDeleteEventFamily = (e, eventId) => {
    e.stopPropagation();
    dispatch(deleteEventFamily(eventId));
  };

  const handleAddSelectedYear = (year) => {
    let existedYear = memberDetailsEvents.map((e) =>
      moment(e.occurredAt).year()
    );

    if (!existedYear.includes(year)) {
      setWarningText(null);
      dispatch(cloneFamily(year));
      const currentItemSize = memberDetailsEvents.reduce((years, event) => {
        const year = moment(event.occurredAt).format("YYYY");
        if (!years.includes(year)) years.push(year);
        return years;
      }, []).length;
      dispatch(changeEventFamily(currentItemSize, year, 1));
      childRef.current.close();
    } else {
      setWarningText(`${year} ${"already exists."}`);
    }
  };

  return (
    <React.Fragment>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          // alignItems: "center",
          border: "1px solid #f0f0f0",
          padding: "0",
        }}
      >
        <AddYearButton
          ref={childRef}
          selectedYear={selectedYear.year}
          maxDate={maxDate}
          minDate={minDate}
          handleAddSelectedYear={handleAddSelectedYear}
          warningText={warningText}
          setWarningText={setWarningText}
        />

        <SidebarItem
          events={memberDetailsEvents}
          maxDate={maxDate}
          minDate={minDate}
          selectedItem={selectedYear}
          onChangeFamily={onChangeFamily}
          onDeleteEventFamily={onDeleteEventFamily}
          // handleEditEventDate={handleEditEventDate} dont use
          warningText={warningText}
          setWarningText={setWarningText}
        />
      </div>
    </React.Fragment>
  );
};

export default SideBar;
