const prayerAndTime = {
    "Asr": "16:58",
    "Dhuhr": "13:13",
    "Fajr": "05:11",
    "Firstthird": "23:27",
    "Imsak": "05:01",
    "Isha": "21:14",
    "Lastthird": "02:58",
    "Maghrib": "19:56",
    "Midnight": "01:13",
    "Sunrise": "06:29",
    "Sunset": "19:56"
};

const currentPrayer = "Dhuhr"

let timeBetween;
let timeTillNext;

const prayerKey = new Map();
    prayerKey.set('Fajr', 'Dhuhr')
    prayerKey.set('Dhuhr', 'Asr')
    prayerKey.set('Asr', 'Maghrib')
    prayerKey.set('Maghrib', 'Isha')
    prayerKey.set('Isha', 'Fajr')

    const getTotalIntervalMin = () => {
        console.log(prayerAndTime[currentPrayer])
        const currPrayerTime = toMin(prayerAndTime[currentPrayer])
        const nextPrayerTime = toMin(prayerAndTime[prayerKey.get(currentPrayer)])

        if(currentPrayer != "Isha")
        {
            timeBetween = nextPrayerTime - currPrayerTime;

            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            return 1 - (nextPrayerTime - currentTimeInMinutes) / timeBetween;
        } else {
            const midnight = 24 * 60;
            const ishaToMidnight = midnight - currPrayerTime;
            timeBetween = ishaToMidnight + nextPrayerTime;

            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();

            // means it's not past midnight
            if(currentHour > 20)
            {
                var currentTimeInMinutes = (currentHour * 60 + currentMinute) - currPrayerTime;
            } else {
                var currentTimeInMinutes = currentHour * 60 + currentMinute + ishaToMidnight;
            }

            return currentTimeInMinutes/timeBetween;
        }
    }

    const toMin = (time) => {
        const [hour, minute] = time.split(':').map(Number);
        const prayerTimeInMinutes = hour * 60 + minute;

        return prayerTimeInMinutes
    }

    percentage = getTotalIntervalMin();

    const calculateRemaining = () => {
        let timeInMin = (1-percentage) * timeBetween
        let formatedTime = formatTime(timeInMin)
        return formatedTime
    }

    function formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
    
        if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''}, ${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
        } else {
            return `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
        }
    }
    
    

console.log(calculateRemaining())