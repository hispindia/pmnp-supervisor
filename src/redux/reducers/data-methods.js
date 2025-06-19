import { generateUid, convertValue } from "../../utils";

export const initNewData = (state, action) => {
  const { selectedOrgUnit, programMetadata } = action.payload;
  const orgUnit = selectedOrgUnit.id;
  const program = programMetadata.id;
  const generatedTeiId = generateUid();
  const generatedEnrollmentId = generateUid();
  const currentTei = {
    trackedEntity: generatedTeiId,
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
    trackedEntity: generatedTeiId,
  };
  const currentEvents = programMetadata.programStages.map((ps) => {
    return {
      event: generateUid(),
      orgUnit,
      programStage: ps.id,
      program,
      isDirty: false,
      isNew: true,
      trackedEntity: generatedTeiId,
      enrollment: generatedEnrollmentId,
      dataValues: {},
    };
  });

  return { ...state, currentTei, currentEnrollment, currentEvents };
};

export const initData = (state, action) => {
  const { trackedEntity, programMetadata } = action.payload;
  const currentTei = trackedEntity;
  const currentEnrollment = trackedEntity.enrollments[0];
  const currentEvents = trackedEntity.enrollments[0].events;
  delete currentTei.enrollments;
  delete currentEnrollment.events;
  currentTei.isNew = false;
  currentTei.isDirty = false;
  currentTei.attributes = currentTei.attributes.reduce((previousValue, currentValue) => {
    previousValue[currentValue.attribute] = convertValue(currentValue.valueType, currentValue.value);
    return previousValue;
  }, {});
  currentEnrollment.enrolledAt = convertValue("DATE", currentEnrollment.enrolledAt);
  currentEnrollment.incidentDate = convertValue("DATE", currentEnrollment.incidentDate);
  currentEnrollment.isNew = false;
  currentEnrollment.isDirty = false;
  currentEvents.forEach((event) => {
    const programStage = programMetadata.programStages.find((ps) => ps.id === event.programStage);
    if (!programStage) return;
    event.occurredAt = convertValue("DATE", event.occurredAt);
    event.dueDate = convertValue("DATE", event.dueDate);
    event.isNew = false;
    event.isDirty = false;
    event.dataValues = event.dataValues.reduce((previousValue, currentValue) => {
      const foundDe = programStage.dataElements.find((de) => de.id === currentValue.dataElement);
      if (!foundDe) return previousValue;
      previousValue[currentValue.dataElement] = convertValue(foundDe.valueType, currentValue.value);
      return previousValue;
    }, {});
  });

  return {
    ...state,
    currentTei,
    currentEnrollment,
    currentEvents: [...currentEvents],
  };
};

export const initDataMember = (state, action) => {
  const { trackedEntity, programMetadata } = action.payload;
  const memberTei = trackedEntity;
  const memberEnrollment = trackedEntity.enrollments[0];
  const memberEvents = trackedEntity.enrollments[0].events;
  delete memberTei.enrollments;
  delete memberEnrollment.events;
  memberTei.isNew = false;
  memberTei.isDirty = false;
  memberTei.attributes = memberTei.attributes.reduce((previousValue, memberValue) => {
    previousValue[memberValue.attribute] = convertValue(memberValue.valueType, memberValue.value);
    return previousValue;
  }, {});
  memberEnrollment.enrolledAt = convertValue("DATE", memberEnrollment.enrolledAt);
  memberEnrollment.incidentDate = convertValue("DATE", memberEnrollment.incidentDate);
  memberEnrollment.isNew = false;
  memberEnrollment.isDirty = false;
  memberEvents.forEach((event) => {
    const programStage = programMetadata.programStages.find((ps) => ps.id === event.programStage);
    if (!programStage) return;
    event.occurredAt = convertValue("DATE", event.occurredAt);
    event.dueDate = convertValue("DATE", event.dueDate);
    event.isNew = false;
    event.isDirty = false;
    event.dataValues = event.dataValues.reduce((previousValue, memberValue) => {
      const foundDe = programStage.dataElements.find((de) => de.id === memberValue.dataElement);
      if (!foundDe) return previousValue;
      previousValue[memberValue.dataElement] = convertValue(foundDe.valueType, memberValue.value);
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
