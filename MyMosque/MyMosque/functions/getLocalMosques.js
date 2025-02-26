import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDistance } from 'geolib';
const cacheDuration = 1000 * 60 * 60;

const getLocalMosques = async (lat, lng, nextPageToken = null) => {
    const radius = 10000;
    const apiKey = 'AIzaSyD8TOCKBJE00BR8yHhQC4PhN7Vu7AdM68c';
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=mosque&key=${apiKey}`;

    try {
        // Check cache first with location-based key
        const cacheKey = `nearbyMosques_${lat.toFixed(3)}_${lng.toFixed(3)}`;
        const cachedData = await AsyncStorage.getItem(cacheKey);
        
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < cacheDuration) {
                return data;
            }
        }

        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
            const resultsWithDistance = data.results.map(result => ({
                ...result,
                distance: getDistance(
                    { latitude: lat, longitude: lng },
                    { latitude: result.geometry.location.lat, longitude: result.geometry.location.lng }
                ),
            }));

            resultsWithDistance.sort((a, b) => a.distance - b.distance);
            
            // Cache the results with location-based key
            await AsyncStorage.setItem(cacheKey, JSON.stringify({
                data: resultsWithDistance,
                timestamp: Date.now()
            }));

            return resultsWithDistance;
        }
    } catch (error) {
        console.error("Error fetching: ", error);
    }
};

export default getLocalMosques;