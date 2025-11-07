import { useState, useEffect } from "react";

const useEvent = (currentEvent) => {
  const [event, setEvent] = useState({});

  useEffect(() => {
    if (currentEvent) {
      initEvent(currentEvent);
    }
  }, []);

  const initEvent = (initEv) => {
    if (initEv.dataValues && !Array.isArray(initEv.dataValues)) {
      setEvent({ ...initEv });
      return;
    }
    initEv.dataValues = initEv.dataValues
      ? initEv.dataValues.reduce((accumulator, currentDataValue) => {
          accumulator[currentDataValue.dataElement] = currentDataValue.value;
          return accumulator;
        }, {})
      : {};

    initEv._isDirty = initEv._isDirty || false;
    setEvent({ ...initEv });
  };

  const clearEvent = () => {
    setEvent({});
  };

  const getEvent = () => {
    return event;
  };

  const changeEvent = (property, value) => {
    event[property] = value;
    event._isDirty = true;
    setEvent({ ...event });
  };

  const setEventDirty = (isDirty) => {
    event._isDirty = isDirty;
    setEvent({ ...event });
  };

  const changeEventDataValue = (dataElement, value) => {
    if (event.dataValues) {
      event.dataValues[dataElement] = value;
      event._isDirty = true;
      setEvent({ ...event });
    }
  };

  const transformEvent = () => {
    const transformed = { ...event };
    transformed.dataValues = Object.keys(transformed.dataValues).map((dataElement) => {
      const dv = {
        dataElement,
        value: transformed.dataValues[dataElement],
      };
      return dv;
    });
    return transformed;
  };

  return {
    event,
    initEvent,
    getEvent,
    clearEvent,
    changeEvent,
    changeEventDataValue,
    setEventDirty,
    transformEvent,
  };
};

export default useEvent;
