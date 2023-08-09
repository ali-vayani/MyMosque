function getPrayerTimes(latitude, longitude, month, year, method) {
    const url = `http://api.aladhan.com/v1/calendar/${year}/${month}`;
    const params = {
        latitude: latitude,
        longitude: longitude,
        method: method,
        // Add any other required parameters here
    };
    const queryString = Object.keys(params)
        .map(key => key + '=' + params[key])
        .join('&');
    fetch(url + '?' + queryString)
        .then(response => response.json())
        .then(data => {
            console.log(data['data'][0]['timings']);
            const timings = data['data'][0]['timings'];
            const firstSevenTimings = Object.entries(timings).slice(0, 7);
            console.log(firstSevenTimings[0][0]);
        })
        .catch(error => {
        console.error(error);
    });
}
  // Example usage:
getPrayerTimes(32.508515, -97.1254872, 8, 2023, 2);  