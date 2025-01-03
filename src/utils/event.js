export function transformEvent(event) {
  const transformed = { ...event };
  transformed.dataValues = Object.keys(transformed.dataValues).map(
    (dataElement) => {
      const dv = {
        dataElement,
        value: transformed.dataValues[dataElement],
      };
      return dv;
    }
  );
  return transformed;
}

export function getEventsByYear(events, year) {
  if (!events) {
    return [];
  }

  const eventsByYear = events.filter((event) => {
    const eventYear = new Date(event.occurredAt).getFullYear();
    return eventYear == year;
  });

  return eventsByYear;
}

export const getEventByYearAndHalt6Month = (events, year, haft6Month) => {
  if (!events) {
    return null;
  }

  const eventsByYear = getEventsByYear(events, year);

  if (eventsByYear.length === 0) {
    return null;
  } else {
    if (eventsByYear.length > 1 && haft6Month) {
      return eventsByYear[haft6Month - 1];
    } else {
      return eventsByYear[0];
    }
  }
};

export const isImmutableYear = (year, immerYears) => {
  return immerYears.includes(Number(year));
};

// calculate Age with DOB
export const calculateAge = (dob = new Date()) => {
  // Parse the input date
  const birthDate = new Date(dob);

  // Get today's date
  const today = new Date();

  // Calculate the difference in years
  let age = today.getFullYear() - birthDate.getFullYear();

  // Adjust for the case where the birthday has not yet occurred this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

