import * as LocationExpo from 'expo-location';

const getUserLocation = async () => {
    let { status } = await LocationExpo.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        return;
    }
    let currentPosition = await LocationExpo.getCurrentPositionAsync({ accuracy: LocationExpo.Accuracy.High });
    const { latitude, longitude } = currentPosition.coords;
    return { latitude, longitude };
}

export default getUserLocation;