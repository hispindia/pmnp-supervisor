export const convertValueBack = (valueType, value) => {
  switch (valueType) {
    case "TRUE_ONLY":
      // Convert 1 to "true", 0 to empty string for TRUE_ONLY fields
      if (value === "1" || value === 1 || value === "true") {
        return "true";
      } else if (value === "0" || value === 0 || value === "" || value === null || value === undefined) {
        return "";
      }
      return value;
    default:
      return value;
  }
};
