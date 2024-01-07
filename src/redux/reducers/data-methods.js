import { generateCode, convertValue } from "../../utils";

// export const initData = (state, action) => {
//   const { property, value } = action.payload;
//   const { currentTei } = state;
//   currentTei[property] = value;
//   currentTei.isDirty = true;
//   return { ...state, currentTei };
// };

// export const mutateAttribute = (state, action) => {
//   const { attribute, value } = action.payload;
//   const { currentTei } = state;
//   currentTei.attributes[attribute] = value;
//   currentTei.isDirty = true;
//
//   return { ...state, currentTei };
// };

// export const mutateEnrollment = (state, action) => {
//   const { property, value } = action.payload;
//   const { currentEnrollment } = state;
//   currentEnrollment[property] = value;
//   currentEnrollment.isDirty = true;
//   return { ...state, currentEnrollment };
// };

// export const mutateEvent = (state, action) => {
//   const { eventId, property, value } = action.payload;
//   const { currentEvents } = state;
//   const currentEventIndex = currentEvents.findIndex(
//     (event) => event.event === eventId
//   );
//   currentEvents[currentEventIndex][property] = value;
//   currentEvents[currentEventIndex].isDirty = true;
//   return { ...state, currentEvents: [...currentEvents] };
// };

// export const mutateDataValue = (state, action) => {
//   const { eventId, dataElement, value } = action.payload;
//   const { currentEvents } = state;
//   const currentEventIndex = currentEvents.findIndex(
//     (event) => event.event === eventId
//   );
//   currentEvents[currentEventIndex].dataValues[dataElement] = value;
//   currentEvents[currentEventIndex].isDirty = true;
//   return { ...state, currentEvents: [...currentEvents] };
// };

export const initNewData = (state, action) => {
  const { selectedOrgUnit, programMetadata } = action.payload;
  const orgUnit = selectedOrgUnit.id;
  const program = programMetadata.id;
  const generatedTeiId = generateCode();
  const generatedEnrollmentId = generateCode();
  const currentTei = {
    trackedEntityInstance: generatedTeiId,
    orgUnit,
    isDirty: false,
    isNew: true,
    isSaved: false,
    trackedEntityType: programMetadata.trackedEntityType,
    attributes: {},
  };
  const currentEnrollment = {
    enrollment: generatedEnrollmentId,
    orgUnit,
    program,
    isDirty: false,
    isNew: true,
    trackedEntityInstance: generatedTeiId,
  };
  const currentEvents = programMetadata.programStages.map((ps) => {
    return {
      event: generateCode(),
      orgUnit,
      programStage: ps.id,
      program,
      isDirty: false,
      isNew: true,
      trackedEntityInstance: generatedTeiId,
      enrollment: generatedEnrollmentId,
      dataValues: {},
    };
  });

  return { ...state, currentTei, currentEnrollment, currentEvents };
};

export const initData = (state, action) => {
  const { trackedEntityInstance, programMetadata } = action.payload;
  const currentTei = trackedEntityInstance;
  const currentEnrollment = trackedEntityInstance.enrollments[0];
  const currentEvents = trackedEntityInstance.enrollments[0].events;
  delete currentTei.enrollments;
  delete currentEnrollment.events;
  currentTei.isNew = false;
  currentTei.isDirty = false;
  currentTei.attributes = currentTei.attributes.reduce(
    (previousValue, currentValue) => {
      previousValue[currentValue.attribute] = convertValue(
        currentValue.valueType,
        currentValue.value
      );
      return previousValue;
    },
    {}
  );
  currentEnrollment.enrollmentDate = convertValue(
    "DATE",
    currentEnrollment.enrollmentDate
  );
  currentEnrollment.incidentDate = convertValue(
    "DATE",
    currentEnrollment.incidentDate
  );
  currentEnrollment.isNew = false;
  currentEnrollment.isDirty = false;
  currentEvents.forEach((event) => {
    const programStage = programMetadata.programStages.find(
      (ps) => ps.id === event.programStage
    );
    if (!programStage) return;
    event.eventDate = convertValue("DATE", event.eventDate);
    event.dueDate = convertValue("DATE", event.dueDate);
    event.isNew = false;
    event.isDirty = false;
    event.dataValues = event.dataValues.reduce(
      (previousValue, currentValue) => {
        const foundDe = programStage.dataElements.find(
          (de) => de.id === currentValue.dataElement
        );
        if (!foundDe) return previousValue;
        previousValue[currentValue.dataElement] = convertValue(
          foundDe.valueType,
          currentValue.value
        );
        return previousValue;
      },
      {}
    );
  });

  return {
    ...state,
    currentTei,
    currentEnrollment,
    currentEvents: [...currentEvents],
  };
};

export const initDataMember = (state, action) => {
  const { trackedEntityInstance, programMetadata } = action.payload;
  const memberTei = trackedEntityInstance;
  const memberEnrollment = trackedEntityInstance.enrollments[0];
  const memberEvents = trackedEntityInstance.enrollments[0].events;
  delete memberTei.enrollments;
  delete memberEnrollment.events;
  memberTei.isNew = false;
  memberTei.isDirty = false;
  memberTei.attributes = memberTei.attributes.reduce(
    (previousValue, memberValue) => {
      previousValue[memberValue.attribute] = convertValue(
        memberValue.valueType,
        memberValue.value
      );
      return previousValue;
    },
    {}
  );
  memberEnrollment.enrollmentDate = convertValue(
    "DATE",
    memberEnrollment.enrollmentDate
  );
  memberEnrollment.incidentDate = convertValue(
    "DATE",
    memberEnrollment.incidentDate
  );
  memberEnrollment.isNew = false;
  memberEnrollment.isDirty = false;
  memberEvents.forEach((event) => {
    const programStage = programMetadata.programStages.find(
      (ps) => ps.id === event.programStage
    );
    if (!programStage) return;
    event.eventDate = convertValue("DATE", event.eventDate);
    event.dueDate = convertValue("DATE", event.dueDate);
    event.isNew = false;
    event.isDirty = false;
    event.dataValues = event.dataValues.reduce((previousValue, memberValue) => {
      const foundDe = programStage.dataElements.find(
        (de) => de.id === memberValue.dataElement
      );
      if (!foundDe) return previousValue;
      previousValue[memberValue.dataElement] = convertValue(
        foundDe.valueType,
        memberValue.value
      );
      return previousValue;
    }, {});
  });

  return {
    ...state,
    memberTei,
    memberEnrollment,
    memberEvents: [...memberEvents],
  };
};

// export const initNewEvent = (state, action) => {
//   const { eventId, programStage } = action.payload;
//   const { currentTei, currentEnrollment, currentEvents } = state;
//   const newEvent = {
//     event: eventId,
//     isNew: true,
//     isDirty: false,
//     orgUnit: currentTei.orgUnit,
//     enrollment: currentEnrollment.enrollment,
//     trackedEntityInstance: currentTei.trackedEntityInstance,
//     program: currentEnrollment.program,
//     programStage,
//     dataValues: {},
//   };
//   return { ...state, currentEvents: [...currentEvents, newEvent] };
// };
