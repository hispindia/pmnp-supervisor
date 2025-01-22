import React, { useEffect, useState } from "react";
// import { TableColumn, TableFilter } from "../../utils/index";
/* REDUX */
import { submitEventDataValues } from "../../redux/actions/data/tei/currentEvent";
/* REDUX */
import { useDispatch, useSelector } from "react-redux";

/* Components */
import FamilyMemberForm from "../../components/FamilyMemberForm/FamilyMemberForm.jsx";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import { useEvent } from "../../hooks";
import FIForm from "../../skeletons/TeiList";
import { getEventByYearAndHalt6Month } from "@/utils/event";

const LoadingFamilyMemberForm = withSkeletonLoading(FIForm)(FamilyMemberForm);

const FamilyMemberFormContainer = () => {
  const { minDate, maxDate } = useSelector((state) => state.metadata);
  const events = useSelector((state) => state.data.tei.data.currentEvents);
  const tei = useSelector((state) => state.data.tei);
  const selectedYear = useSelector((state) => state.data.tei.selectedYear);

  const eventData = getEventByYearAndHalt6Month(
    events,
    selectedYear.year,
    selectedYear.selected6Month
  );

  const {
    event,
    initEvent,
    getEvent,
    clearEvent,
    changeEvent,
    changeEventDataValue,
    setEventDirty,
    transformEvent,
  } = useEvent(eventData ? JSON.parse(JSON.stringify(eventData)) : []);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log("Trigger save immediately when event is changed");
    handleSaveButton();
  }, [JSON.stringify(event)]);

  useEffect(() => {
    // console.log("update selected year", events, selectedYear, eventData);
    // https://dhis2.asia/laomembers/api/trackedEntityInstances/query.json?attribute=gv9xX5w4kKt:EQ:yAHVhPxHorS&ou=Y9PhSNpBvg0&attribute=tASKWHyRolc&attribute=NLth2WTyo7M&attribute=tJrT8GIy477&attribute=BaiVwt8jVfg&attribute=IBLkiaYRRL3&attribute=bIzDI9HJCB0&attribute=IEE2BMhfoSc&attribute=tQeFLjYbqzv&attribute=DmuazFb368B&attribute=ck9h7CokxQE

    if (events && events.length > 0 && eventData) {
      initEvent(JSON.parse(JSON.stringify(eventData)));
    }
  }, [selectedYear, JSON.stringify(events)]);

  const handleSaveButton = (saveInBackground = false) => {
    if (event._isDirty) {
      console.log("saving event", event);
      // PUSH TEI event
      dispatch(submitEventDataValues(event.dataValues));
      setEventDirty(false);
    }
  };

  const handleChangeDataValue = (dataElement, value) => {
    changeEventDataValue(dataElement, value);
    setEventDirty(true);
  };

  return (
    <LoadingFamilyMemberForm
      loading={tei.loading}
      loaded={true}
      mask
      currentEvent={event}
      changeEventDataValue={handleChangeDataValue}
      changeEvent={changeEvent}
      blockEntry={false}
      events={events}
      externalComponents={<div></div>}
      setDisableCompleteBtn={() => {}}
      maxDate={maxDate}
      minDate={minDate}
    />
  );
};

export default withOrgUnitRequired()(FamilyMemberFormContainer);
