import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import moment from "moment";
import React, { useRef, useState } from "react";
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    textAlign: "center",
    color: theme.palette.text.secondary,
    marginBottom: "5px",
  },
}));

const SideBar = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [warningText, setWarningText] = useState(null);

  const { currentEvents } = useSelector((state) => state.data.tei.data);
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
    let existedYear = currentEvents.map((e) => moment(e.eventDate).year());
    console.log({ existedYear });
    if (!existedYear.includes(year)) {
      setWarningText(null);
      dispatch(cloneFamily(year));
      childRef.current.close();
    } else {
      setWarningText(`${year} ${"already exists."}`);
    }
  };

  // dont use
  // const handleEditEventDate = (year) => {
  //     let existedYear = currentEvents.map((e) => moment(e.eventDate).year());
  //     if (!existedYear.includes(year)) {
  //         setWarningText(null);
  //         // update event date
  //         dispatch(updateFamilyDate(year));
  //     } else {
  //         setWarningText(`${year} ${'already exists.'}`);
  //     }
  // };

  return (
    <React.Fragment>
      <Paper className={classes.paper} variant="outlined" square>
        <AddYearButton
          ref={childRef}
          selectedYear={selectedYear.year}
          maxDate={maxDate}
          minDate={minDate}
          handleAddSelectedYear={handleAddSelectedYear}
          warningText={warningText}
          setWarningText={setWarningText}
        />
      </Paper>

      <Paper className={classes.paper} variant="outlined" square>
        <SidebarItem
          events={currentEvents}
          maxDate={maxDate}
          minDate={minDate}
          selectedItem={selectedYear}
          onChangeFamily={onChangeFamily}
          onDeleteEventFamily={onDeleteEventFamily}
          // handleEditEventDate={handleEditEventDate} dont use
          warningText={warningText}
          setWarningText={setWarningText}
        />
      </Paper>
    </React.Fragment>
  );
};

export default SideBar;
