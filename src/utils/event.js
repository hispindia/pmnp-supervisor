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
