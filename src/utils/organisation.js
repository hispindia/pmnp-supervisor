export const getOrganisationUnitById = (id, organisationUnits) => {
  return organisationUnits.find((ou) => ou.id === id);
};
