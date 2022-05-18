const matrixMultiply = (mat1, mat2) => {
    if (mat1[0].length !== mat2.length) {
        throw new Error('Matrix dimensions do not match');
    }
    const result = [];
    for (let i = 0; i < mat1.length; i++) {
        result[i] = [];
        for (let j = 0; j < mat2[0].length; j++) {
            let sum = 0;
            for (let k = 0; k < mat1[0].length; k++) {
                sum += mat1[i][k] * mat2[k][j];
            }
            result[i][j] = sum;
        }
    }
    return result;
}

const matrixTranspose = (mat) => {
    const result = [];
    for (let i = 0; i < mat[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < mat.length; j++) {
            result[i][j] = mat[j][i];
        }
    }
    return result;
}

const linespace = (start, end, n) => {
    const result = [];
    const step = (end - start) / (n - 1);
    for (let i = 0; i < n; i++) {
        result.push(start + (step * i));
    }
    return result;
}

const sphToCart = (r, theta, phi) => {
    return [
        [r * Math.sin(theta) * Math.cos(phi)],
        [r * Math.sin(theta) * Math.sin(phi)],
        [r * Math.cos(theta)]
    ];
}

const cartToSph = (x, y, z) => {
    const r = Math.sqrt(x * x + y * y + z * z);
    const theta = Math.acos(z / r);
    const phi = Math.atan2(y, x);
    return [[r], [theta], [phi]];
}

const degToRad = (deg) => {
    return deg * Math.PI / 180;
}

const radToDeg = (rad) => {
    return rad * 180 / Math.PI;
}

const getAzimuthAndElevationOfSun = (elevationOfSun, latitude, longitude) => {
    const R = [
        [-1 * Math.sin(longitude), Math.cos(longitude), 0],
        [-1 * Math.cos(longitude) * Math.sin(latitude), -1 * Math.sin(longitude) * Math.sin(latitude), Math.cos(latitude)],
        [Math.cos(longitude) * Math.cos(latitude), Math.sin(longitude) * Math.cos(latitude), Math.sin(latitude)]
    ]
    const phi = 0; // azimuth of sun
    const theta = Math.PI / 2 - elevationOfSun;
    const cartPosition = sphToCart(1, theta, phi);
    const ENU = matrixMultiply(R, cartPosition);
    const ENUSpherical = cartToSph(ENU[0], ENU[1], ENU[2]);
    const azimuth = ENUSpherical[2];
    const elevation = Math.PI / 2 - ENUSpherical[1];
    return [azimuth, elevation];
}

const generateElevationData = (elevationOfSun, latitudeOfLocation) => {
    const numOfPoints = (2 * 180) + 1;
    let phiDeg = -180;
    const hours = linespace(0, 24, numOfPoints);
    const data = [];
    data.push(['Time of the day in hours', 'Elevation of sun in degrees']);
    for (let i = 0; i < numOfPoints; i++, phiDeg++) {
        const elevation = getAzimuthAndElevationOfSun(degToRad(elevationOfSun), degToRad(latitudeOfLocation), degToRad(phiDeg))[1];
        data.push([hours[i], radToDeg(elevation)]);
    }
    return data;
}

const generateMaxElevationData = (latitudeOfLocation) => {
    const numOfPoints = 2 * (2 * 23.5 + 1);
    let thetaDeg = -23.5;
    const days = linespace(0, 365, numOfPoints);
    const data = [];
    const maxElevationData = [];
    data.push(['Day of the year', 'Max Elevation of sun in degrees']);
    for (let i = 0; i < numOfPoints / 2; i++, thetaDeg++) {
        let phiDeg = -180;
        const numOfPointsInDay = (2 * 180) + 1;
        let maxElevation = Number.MIN_VALUE;
        for (let j = 0; j < numOfPointsInDay; j++, phiDeg++) {
            const elevation = getAzimuthAndElevationOfSun(degToRad(thetaDeg), degToRad(latitudeOfLocation), degToRad(phiDeg))[1];
            maxElevation = Math.max(maxElevation, elevation);
        }
        maxElevationData.push(radToDeg(maxElevation));
        data.push([days[i], radToDeg(maxElevation)]);
    }
    for (let i = numOfPoints / 2; i < numOfPoints; i++) {
        data.push([days[i], maxElevationData[numOfPoints - i]]);
    }
    return data;
}

const daysDifference = (date) => {
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (date.month == 11) {
        return date.day - 21;
    }
    else if(date.month < 5) {
        let days = 10;
        for (let i = 0; i < date.month; i = (i + 1) % 12) {
            days += monthDays[i];
        }
        days += date.day;
        return days;
    }
    else {
        let days = 0;
        for (let i = 5; i < date.month; i = (i + 1) % 12) {
            days += monthDays[i];
        }
        days += date.day;
        days -= 21;
        return days;
    }
}

const getElevationOfSun = (date) => {
    const shift = 47 / 182;
    const maxNegativeElevation = -23.5;
    const maxPositiveElevation = 23.5;
    const days = daysDifference(date);
    if (date.month < 5 || date.month == 11) {
        return maxNegativeElevation + (days * shift);
    }
    else {
        return maxPositiveElevation - (days * shift);
    }
}
