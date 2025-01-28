import * as LocationExpo from 'expo-location';
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default getLocalPrayerTimes = async (location, uid) => {
    try {
        // Check if we have cached data
        const cachedData = await AsyncStorage.getItem('prayerTimesCache');
        if (cachedData) {
            const { data, timestamp, cachedLocation, cachedSettings } = JSON.parse(cachedData);
            const today = new Date();
            const cachedDate = new Date(timestamp);
            const settings = await getTimeSettings(uid);
            
            // Check if the data is from today and settings haven't changed
            if (cachedDate.getDate() === today.getDate() && 
                cachedDate.getMonth() === today.getMonth() && 
                cachedDate.getFullYear() === today.getFullYear() &&
                JSON.stringify(cachedSettings) === JSON.stringify(settings) &&
                (!location || (cachedLocation.city === location.city && cachedLocation.country === location.country))) {
                return data.data;
            }
        }

        // If no cache or cache is invalid, fetch new data
        if(!location) 
            location = await getUserLocation();
        const today = new Date();
        const settings = await getTimeSettings(uid);
        const url = `https://api.aladhan.com/v1/timingsByCity/${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}?city=${location.city}&country=${location.country}&method=${settings[0].id}&adjustment=1&school=${settings[1].id}`;
        
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        
        // Cache the new data
        await AsyncStorage.setItem('prayerTimesCache', JSON.stringify({
            data,
            timestamp: new Date().toISOString(),
            cachedLocation: location,
            cachedSettings: settings
        }));
        
        return data.data;
    } catch (error) {
        console.error('Error in getLocalPrayerTimes:', error);
        throw error;
    }
}

const getUserLocation = async () => {
    let { status } = await LocationExpo.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
    }
    let currentPosition = await LocationExpo.getCurrentPositionAsync({ accuracy: LocationExpo.Accuracy.High });
    const { latitude, longitude } = currentPosition.coords;
    return await getCityName(latitude, longitude)
}

const getCityName = async (lat, lng) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.address && data.address.city) {
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
