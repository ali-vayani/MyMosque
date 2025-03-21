import * as LocationExpo from 'expo-location';
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import getUserLocation from './getUserLocation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default getLocalPrayerTimes = async (location, uid) => {
    try {
        const cachedData = await AsyncStorage.getItem('prayerTimesCache');

        if (!cachedData) {
            const { data, timestamp, cachedLocation, cachedSettings } = JSON.parse(cachedData);
            const today = new Date();
            const cachedDate = new Date(timestamp);
            const settings = await getTimeSettings(uid);
            // Check if the data is from today and settings haven't changed
            if (cachedDate.getDate() === today.getDate() && 
                cachedDate.getMonth() === today.getMonth() && 
                cachedDate.getFullYear() === today.getFullYear() &&
                JSON.stringify(settings[0].name) === JSON.stringify(cachedSettings[0].name) &&
                JSON.stringify(settings[1].name) === JSON.stringify(cachedSettings[1].name) &&
                (!location || (cachedLocation.city === location.city && cachedLocation.country === location.country))) {
                return {
                    ...data.data ,
                    located: 'AsyncStorage'
                }
            }
        }

        if(!location)  {
            location = await getUserLocation();
        }
        const cordinates = await getCityName(location.latitude, location.longitude);
        console.log(cordinates)
        const today = new Date();
        const settings = await getTimeSettings(uid);
        const url = `https://api.aladhan.com/v1/timingsByCity/${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}?city=${cordinates.city}&country=${cordinates.country}&method=${settings[0].id}&adjustment=1&school=${settings[1].id}`;
        const startTime = performance.now();
        const response = await fetch(url);
        const endTime = performance.now();
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const userLoc = cordinates.city || cordinates.town + ", " + cordinates.state;
        await AsyncStorage.setItem('prayerTimesCache', JSON.stringify({
            data,
            timestamp: new Date().toISOString(),
            cachedLocation: location,
            cachedSettings: settings,
            location: userLoc
        }));
        
        return {
            ...data.data,
            location: userLoc
        }
    } catch (error) {
        console.error('Error in getLocalPrayerTimes:', error);
        throw error;
    }
}

const getCityName = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    console.log(url)
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.address && (data.address.city || data.address.town)) {
                return data.address;
            } else {
                console.log("City not found.");
                return null;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

const getTimeSettings = async (uid) => {
    if(uid) {
        const docRef = doc(FIRESTORE_DB, "users", uid);
        try{
            const docSnap = await getDoc(docRef);
            if(docSnap.data()["prayerTimeSettings"].length > 0)
                return docSnap.data()["prayerTimeSettings"]
            else
                return [{id: 2, name: 'North America (ISNA)'},{id: 0, name: 'Shafi'}]
        } catch {
            return [{id: 2, name: 'North America (ISNA)'},{id: 0, name: 'Shafi'}]
        }
    }

    return [{id: 2, name: 'North America (ISNA)'},{id: 0, name: 'Shafi'}]
}
