import CensusDetailForm from "@/components/CensusDetailForm";
import { changeEventFamily } from "@/redux/actions/data/tei";
import { submitEvent } from "@/redux/actions/data/tei/currentEvent";
import { generateUid } from "@/utils";
import { transformEvent } from "@/utils/event";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

const getHalfYear = (selected6Month, year) => {
  const startMonth = selected6Month === 1 ? "01" : "07";
  const endMonth = selected6Month === 1 ? "06" : "12";
  return {
    startDate: `${year}-${startMonth}-01`,
    endDate: `${year}-${endMonth}-${selected6Month === 1 ? "30" : "31"}`,
  };
};

const CensusDetailFormContainer = () => {
  const currentEvents = useSelector(
    (state) => state.data.tei.data.currentEvents
  );
  const { year, index, selected6Month } = useSelector(
    (state) => state.data.tei.selectedYear
  );

  const { startDate, endDate } = getHalfYear(selected6Month, year);

  const currentEvent = currentEvents.find((event) =>
    moment(event.occurredAt).isBetween(startDate, endDate, null, "[]")
  );

  const onTabChange = (tabIndex) => {
    dispatch(changeEventFamily(index, year, tabIndex));
  };

  const dispatch = useDispatch();

  const onSubmit = (eventDataValues) => {
    console.log("onSubmit");
    // submit new event
    if (!currentEvent?.dataValues) {
      // clone an event
      let cloneEvent = currentEvents[currentEvents.length - 1];

      // init new event
      dispatch(
        submitEvent(
          transformEvent({
            ...cloneEvent,
            _isDirty: true,
            event: generateUid(),
            occurredAt: `${endDate}`,
            dueDate: `${endDate}`,
            status: "ACTIVE",
            dataValues: eventDataValues,
          })
        )
      );
      return;
    } else {
      // update event
      dispatch(
        submitEvent(
          transformEvent({
            ...currentEvent,
            _isDirty: true,
            dataValues: eventDataValues,
          })
        )
      );
    }
  };

  return (
    <CensusDetailForm
      values={currentEvent?.dataValues || {}}
      selected6Month={selected6Month}
      onTabChange={onTabChange}
      onSubmit={onSubmit}
    />
  );
};

export default CensusDetailFormContainer;
