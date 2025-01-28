import getCurrentPrayer from "./getCurrentPrayer";
import getLocalPrayerTimes from "./getLocalPrayerTimes";

export default getMosquePrayerTimes = async (listOfTimes, address) => {
    let currentPrayer;
    let mosquePrayerTimes;
    for(const times of listOfTimes) {
        const now = new Date();
        const endDate = new Date(times["endDate"].seconds * 1000 + times["endDate"].nanoseconds / 1e6);
        const startDate = new Date(times["startDate"].seconds * 1000 + times["endDate"].nanoseconds / 1e6);
        if(now < endDate && now > startDate) {
            let updatedPrayerTimes = { ...times };
            mosquePrayerTimes = await updateMaghribTime(updatedPrayerTimes, address);
            currentPrayer = getCurrentPrayer(updatedPrayerTimes)
            break;
        }
    }
    return {mosquePrayerTimes: mosquePrayerTimes, currentPrayer: currentPrayer};
}

const updateMaghribTime = async (prayerTimes, address) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const localPrayerTimes = await getLocalPrayerTimes(data[0].address, null);
    const maghribTime = localPrayerTimes.timings.Maghrib;

    let [hour, minute] = maghribTime.split(':').map(Number);
    const maghribAddition = parseInt(prayerTimes.Maghrib);
    minute += maghribAddition;
    if (minute > 59) {
        hour++;
        minute -= 60;
    }
    let newMaghrib = hour.toString().padStart(2, '0') + ":" + minute.toString().padStart(2, '0');
    prayerTimes.Maghrib = newMaghrib;
    return prayerTimes;
};