export const extractTeis = (fullTeis) => {
  const teis = [];
  const enrs = [];
  const events = [];

  fullTeis.forEach((tei) => {
    // remove enrollments and push tei to list
    const { enrollments = [], ...teiData } = tei;
    teis.push(teiData);

    enrollments.forEach((enr) => {
      // remove events and push enr to list
      const { events: enrEvents = [], ...enrData } = enr;
      enrs.push(enrData);
      // push events to list
      events.push(...enrEvents);
    });
  });

  return { teis, enrs, events };
};

export const mergeTeis = (teis, enrs, events) => {
  const enrById = new Map(enrs.map((e) => [e.id, e]));
  const teisById = new Map(teis.map((t) => [t.id, t]));

  const eventsByEnr = new Map();
  events.forEach((ev) => {
    const enrId = ev?.enrollment;
    if (!enrId || (ignoreOrphans && !enrById.has(enrId))) return;
    if (!eventsByEnr.has(enrId)) eventsByEnr.set(enrId, []);
    eventsByEnr.get(enrId).push({ ...ev });
  });

  const enrsByTei = new Map();
  enrs.forEach((enr) => {
    const teiId = enr?.tei;
    if (!teiId && ignoreOrphans) return;
    if (!ignoreOrphans || teisById.has(teiId)) {
      const enrichedEnr = {
        ...enr,
        events: eventsByEnr.get(enr.id) ? [...eventsByEnr.get(enr.id)] : [],
      };
      if (!enrsByTei.has(teiId)) enrsByTei.set(teiId, []);
      enrsByTei.get(teiId).push(enrichedEnr);
    }
  });

  const fullTeis = [];
  teis.forEach((tei) => {
    const enrollments = enrsByTei.get(tei.id) || [];
    fullTeis.push({ ...tei, enrollments });
  });

  return fullTeis;
};
