export default getLocalPrayerTimes = (city, country) => {
    let today = new Date();
    const url = `https://api.aladhan.com/v1/timingsByCity/${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}?city=${city}&country=${country}&method=2&adjustment=1`
    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
}