import { useEffect } from "react";

/* REDUX */
import { submitEventDataValues } from "../../redux/actions/data/tei/currentEvent";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import FamilyMemberForm from "../../components/FamilyMemberForm/FamilyMemberForm.jsx";
import withOrgUnitRequired from "../../hocs/withOrgUnitRequired";
import withSkeletonLoading from "../../hocs/withSkeletonLoading";
import { useEvent } from "../../hooks";
import FIForm from "../../skeletons/TeiList";

const LoadingFamilyMemberForm = withSkeletonLoading(FIForm)(FamilyMemberForm);

const FamilyMemberFormContainer = () => {
  const { minDate, maxDate } = useSelector((state) => state.metadata);
  const events = useSelector((state) => state.data.tei.data.currentEvents);
  const tei = useSelector((state) => state.data.tei);
  const dispatch = useDispatch();
  const eventData = events && events.length > 0 ? events[0] : null;

  const { event, initEvent, changeEvent, changeEventDataValue, setEventDirty } = useEvent(
    eventData ? JSON.parse(JSON.stringify(eventData)) : []
  );

  useEffect(() => {
    handleSaveButton();
  }, [JSON.stringify(event)]);

  useEffect(() => {
    if (events && events.length > 0 && eventData) {
      initEvent(JSON.parse(JSON.stringify(eventData)));
    }
  }, [JSON.stringify(events)]);

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
      setEventDirty={setEventDirty}
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
