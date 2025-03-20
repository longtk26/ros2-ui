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

export const interpolateCurve = (points: number[][], numPoints = 50) => {
    const curvePoints: number[][] = [];

    for (let i = 0; i < points.length - 1; i++) {
        const p0 = points[Math.max(i - 1, 0)];
        const p1 = points[i];
        const p2 = points[i + 1];
        const p3 = points[Math.min(i + 2, points.length - 1)];

        for (let t = 0; t <= 1; t += 1 / numPoints) {
            const x =
                0.5 *
                ((2 * p1[0]) +
                    (-p0[0] + p2[0]) * t +
                    (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t ** 2 +
                    (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t ** 3);

            const y =
                0.5 *
                ((2 * p1[1]) +
                    (-p0[1] + p2[1]) * t +
                    (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t ** 2 +
                    (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t ** 3);

            curvePoints.push([x, y]);
        }
    }

    return curvePoints;
};

export const resamplePoints = (points: number[][], stepSize = 0.5) => {
    const resampled: number[][] = [];
    let accumulatedDist = 0;

    resampled.push(points[0]); // Bắt đầu từ điểm đầu tiên

    for (let i = 1; i < points.length; i++) {
        const prev = resampled[resampled.length - 1];
        const current = points[i];
        const segmentDist = haversineDistance(prev, current);

        if (accumulatedDist + segmentDist >= stepSize) {
            const ratio = (stepSize - accumulatedDist) / segmentDist;
            const newLat = prev[0] + (current[0] - prev[0]) * ratio;
            const newLng = prev[1] + (current[1] - prev[1]) * ratio;
            resampled.push([newLat, newLng]);
            accumulatedDist = 0; // Reset khoảng cách
        } else {
            accumulatedDist += segmentDist;
        }
    }

    return resampled;
};

export const haversineDistance = (point1: number[], point2: number[]) => {
    const R = 6371000; // Bán kính Trái Đất (m)
    const toRad = (deg: number) => (deg * Math.PI) / 180;

    const lat1 = toRad(point1[0]);
    const lat2 = toRad(point2[0]);
    const dLat = toRad(point2[0] - point1[0]);
    const dLon = toRad(point2[1] - point1[1]);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};


export const interpolateBezier = (p0: number[], p1: number[], p2: number[], step: number) => {
    const points: number[][] = [];
    let prevPoint = p0;
    
    for (let t = 0; t <= 1; t += 0.01) { // Tăng độ mượt bằng cách chọn step nhỏ
        const x = (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t ** 2 * p2[0];
        const y = (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t ** 2 * p2[1];

        const newPoint = [x, y];

        if (points.length === 0 || getDistance(prevPoint, newPoint) >= step) {
            points.push(newPoint);
            prevPoint = newPoint;
        }
    }
    return points;
};

export const getDistance = (p1: number[], p2: number[]) => {
    const R = 6371000; // Bán kính Trái Đất (m)
    const dLat = (p2[0] - p1[0]) * (Math.PI / 180);
    const dLng = (p2[1] - p1[1]) * (Math.PI / 180);

    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(p1[0] * (Math.PI / 180)) * Math.cos(p2[0] * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c; // Khoảng cách (m)
};