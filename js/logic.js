const setDayInput = () => {
    const month = Number(document.getElementById('month_sun_trajectory').value);
    const day = document.getElementById('day_sun_trajectory');
    const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    day.innerHTML = '';
    for (let i = 1; i <= monthDays[month]; i++) {
        day.innerHTML += `<option value="${i}">${i}</option>`;
    }
}

window.onload = () => {
    setDayInput();
}

const monthElement = document.getElementById('month_sun_trajectory');

monthElement.addEventListener('change', setDayInput);

/**
 * @param {Object} date - date object: {day:21,month:5}.
 * @param {number} elevationOfSun - Elevation of the sun in degrees.
 * @param {number} latitudeOfLocation - Latitude of the location in degrees.
 */
const renderSunTrajectory = (date, elevationOfSun, latitudeOfLocation) => {
    const data = google.visualization.arrayToDataTable(generateElevationData(elevationOfSun, latitudeOfLocation));
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const options = {
        title: `Observed Elevation of Sun at ${latitudeOfLocation} degrees latitude on ${date.day} ${months[date.month]}`,
        explorer: {
            actions: ["rightClickToReset", "dragToZoom"],
            maxZoomIn: 0.05
        },
        hAxis: {
            title: 'Time of the day in hours',
            titleTextStyle: {
                fontName: "Nunito",
                fontSize: 20,
                italic: false,
                color: "#990000"
            },
            viewWindow: {
                min: 0,
                max: 24
            },
            ticks: [0, 6, 12, 18, 24]
        },
        vAxis: {
            title: 'Elevation of sun in degrees',
            titleTextStyle: {
                fontName: "Nunito",
                fontSize: 20,
                italic: false,
                color: "#990000"
            },
            viewWindow: {
                min: 0,
                max: 90
            },
            ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
        },
        height: 500,
        width: 650,
        legend: 'none'
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart_sun_trajectory'));

    chart.draw(data, options);
}

/** 
 * @param {number} latitudeOfLocation - Latitude of the location in degrees.
*/
const renderMaxSunElevation = (latitudeOfLocation) => {
    const data = google.visualization.arrayToDataTable(generateMaxElevationData(latitudeOfLocation));

    const options = {
        title: `Max Elevation of Sun at ${latitudeOfLocation} degrees latitude`,
        explorer: {
            actions: ["rightClickToReset", "dragToZoom"],
            maxZoomIn: 0.05
        },
        hAxis: {
            title: 'Day of the year (0th day = 21st December)',
            titleTextStyle: {
                fontName: "Nunito",
                fontSize: 20,
                italic: false,
                color: "#990000"
            },
            viewWindow: {
                min: 0,
                max: 365
            },
            ticks: [0, 60, 120, 180, 240, 300, 360]
        },
        vAxis: {
            title: 'Max Elevation of sun in degrees',
            titleTextStyle: {
                fontName: "Nunito",
                fontSize: 20,
                italic: false,
                color: "#990000"
            },
            viewWindow: {
                min: 0,
                max: 90
            },
            ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
        },
        height: 500,
        width: 650,
        legend: 'none'
    };

    const chart = new google.visualization.LineChart(document.getElementById('chart_sun_max_elevation'));

    chart.draw(data, options);
}

const generateTrajectoryBtn = document.getElementById('generate_sun_trajectory');

generateTrajectoryBtn.addEventListener('click', () => {
    google.charts.load('current', { 'packages': ['corechart'] }).then(() => {
        const month = Number(document.getElementById('month_sun_trajectory').value);
        const day = Number(document.getElementById('day_sun_trajectory').value);
        const date = { day, month };
        const elevationOfSun = getElevationOfSun(date);
        const latitude = Number(document.getElementById('latitude_sun_trajectory').value);
        const isDegree = document.getElementById('deg_sun_trajectory').checked;
        if (!latitudeValidator(latitude, isDegree)) {
            if (isDegree) alert('Latitude must be between -90 and 90 degrees');
            else alert('Latitude must be between -1.57 and 1.57 radian');
            return;
        }
        if (isDegree) renderSunTrajectory(date, elevationOfSun, latitude);
        else renderSunTrajectory(date, elevationOfSun, radToDeg(latitude));
    });
})

const setCurrentLatitudeBtn = document.getElementById('set_current_latitude_sun_trajectory');

setCurrentLatitudeBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById('latitude_sun_trajectory').value = position.coords.latitude;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
})

const setCurrentDayBtn = document.getElementById('set_current_day_sun_trajectory');

setCurrentDayBtn.addEventListener('click', () => {
    const date = new Date();
    document.getElementById('month_sun_trajectory').value = date.getMonth();
    setDayInput();
    document.getElementById('day_sun_trajectory').value = date.getDate();
})

const generateMaxElevationBtn = document.getElementById('generate_sun_max_elevation');

generateMaxElevationBtn.addEventListener('click', () => {
    google.charts.load('current', { 'packages': ['corechart'] }).then(() => {
        const latitude = Number(document.getElementById('latitude_sun_max_elevation').value);
        const isDegree = document.getElementById('deg_sun_max_elevation').checked;
        if (!latitudeValidator(latitude, isDegree)) {
            if (isDegree) alert('Latitude must be between -90 and 90 degrees');
            else alert('Latitude must be between -1.57 and 1.57 radian');
            return;
        }
        if (isDegree) {
            renderMaxSunElevation(latitude);
        }
        else {
            renderMaxSunElevation(radToDeg(latitude));
        }
    });
})

const setCurrentLatitudeBtn2 = document.getElementById('set_current_latitude_sun_max_elevation');

setCurrentLatitudeBtn2.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            document.getElementById('latitude_sun_max_elevation').value = position.coords.latitude;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
})