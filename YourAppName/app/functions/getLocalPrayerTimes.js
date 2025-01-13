import * as LocationExpo from 'expo-location';

export default getLocalPrayerTimes = async (location) => {
    if(!location)
        location = await getUserLocation();
    let today = new Date();
    const url = `https://api.aladhan.com/v1/timingsByCity/${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}?city=${location.city}&country=${location.country}&method=2&adjustment=1`
    return fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
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