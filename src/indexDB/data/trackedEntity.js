import _ from 'lodash';

const toDhis2Tei = (trackedEntityInstance, teiData, enrs = []) => {
    let attributes = [];

    teiData.map((e) => {
        attributes.push({
            attribute: e.attribute,
            value: e.value,
            valueType: e.valueType,
            displayName: e.displayName,
        });
    });

    let { isOnline, orgUnit, isDeleted, trackedEntityType, lastUpdated } =
        teiData[0];

    return {
        trackedEntityInstance,
        trackedEntityType,
        enrollments: enrs,
        lastUpdated,
        isOnline: isOnline,
        orgUnit: orgUnit,
        deleted: isDeleted,
        attributes,
    };
};

export const toDhis2TrackedEntities = (teis) => {
    if (!teis) return [];
    let resTEIS = _.groupBy(teis, 'trackedEntityInstance');

    return Object.entries(resTEIS).map(([trackedEntityInstance, teiData]) =>
        toDhis2Tei(trackedEntityInstance, teiData)
    );
};

export const toDhis2TrackedEntity = (tei, enrs = []) => {
    if (!tei) return null;
    let resTEIS = _.groupBy(tei, 'trackedEntityInstance');

    const formatedTei = Object.entries(resTEIS).map(([uid, teiData]) => {
        return toDhis2Tei(uid, teiData, enrs);
    });

    return formatedTei[0];
};
