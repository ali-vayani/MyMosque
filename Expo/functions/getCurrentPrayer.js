export default function getCurrentPrayer(prayerTimes) {
    const prayerKeys = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
    
    // Get current time in hours and minutes
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    // Find the closest upcoming or current prayer time
    let currentPrayer = null;

    for (let key of prayerKeys) {
        const [hour, minute] = prayerTimes[key].split(':').map(Number);
        const prayerTimeInMinutes = hour * 60 + minute;

        if (currentTimeInMinutes >= prayerTimeInMinutes) {
            currentPrayer = key;
        }
    }
    return currentPrayer || "Isha";
}