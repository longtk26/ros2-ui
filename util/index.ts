export const interpolatePoints = (
    start: number[],
    end: number[],
    step: number
) => {
    const points: number[][] = [];
    const distLat = end[0] - start[0];
    const distLng = end[1] - start[1];
    const numPoints = Math.floor(Math.sqrt(distLat ** 2 + distLng ** 2) / step);

    for (let i = 0; i <= numPoints; i++) {
        points.push([
            start[0] + (i / numPoints) * distLat,
            start[1] + (i / numPoints) * distLng,
        ]);
    }
    return points;
};

export const convertToCoordsMap = (value: number) => {
    const deg = Math.floor(value / 100);
    const min = value - deg * 100;
    const result = deg + min / 60;

    return result;
};
