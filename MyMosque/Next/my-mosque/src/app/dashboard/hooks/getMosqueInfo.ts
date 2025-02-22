import { doc, getDoc } from "firebase/firestore";
import { Post, FirestoreTimeStamp, MosqueInfo, PrayerTimes} from "../post.types";
import { FIRESTORE_DB } from "../../../../firebaseConfig";
import { start } from "repl";

export async function getMosqueInfo(masjidId: string) {
    const docRef = doc(FIRESTORE_DB, "mosques", masjidId);
    if(docRef) {
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()) {
            const data = docSnap.data() as MosqueInfo;
            if (data.prayerTimes && data.prayerTimes.length > 0) {
                const convertedTimes = convertTimes(data.prayerTimes);
                data.prayerTimes = data.prayerTimes.map(time => ({
                    ...time,
                    ...convertedTimes
                }));
            }
            return data;
        }
    }
}

export function convertDates(startDate: FirestoreTimeStamp, endDate: FirestoreTimeStamp) {
    if(startDate && endDate) {
        const start = new Date(startDate.seconds * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }); 
        const end = new Date(endDate.seconds * 1000).toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
        return `${start} - ${end}`;
    }

    return "No Date Found";
}

export function convertTimes(times: Omit<PrayerTimes, 'startDate' | 'endDate'>[]) {
    let res = {} as Record<string, string>;
    for(const time of times) {
        for(const [prayer, militaryTime] of Object.entries(time)) {
            if(typeof militaryTime === 'string' && prayer !== 'Maghrib') {
                let [hours, minutes] = militaryTime.split(':').map(Number);
                // am or pm
                const suffix = hours >= 12 ? 'PM' : 'AM';
                // hours to 12 hr format
                hours = hours % 12 || 12;
                if(res[prayer])
                    res[prayer] = `${hours}:${minutes.toString().padStart(2, '0')} ${suffix}`;
            } else {
                res[prayer] = militaryTime;
            }
        }
    }
    return res;
}