import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const Map = () => {
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Permission to access location was denied');
                return;
            }

            let currentPosition = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude, longitude } = currentPosition.coords;

            setLocation({
                latitude,
                longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });

            fetchNearbyMosques(latitude, longitude);
        })();
    }, []);

    const fetchNearbyMosques = async (lat, lng, nextPageToken = null) => {
        const radius = 24000; // 10 miles in meters
        const apiKey = 'YOUR_GOOGLE_PLACES_API_KEY';
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=mosque&key=${apiKey}`;
        
        if (nextPageToken) {
            url += `&pagetoken=${nextPageToken}`;
        }
    
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results) {
                setMarkers(prevMarkers => [...prevMarkers, ...data.results]);
            }
            if (data.next_page_token) {
                // Wait for a short delay as recommended by Google before fetching the next page
                setTimeout(() => {
                    fetchNearbyMosques(lat, lng, data.next_page_token);
                }, 2000);
            }
        } catch (error) {
            console.error("Error fetching mosques: ", error);
        }
    };
    

    return (
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={location}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: marker.geometry.location.lat,
                            longitude: marker.geometry.location.lng,
                        }}
                        title={marker.name}
                    />
                ))}
            </MapView>
            <ScrollView style={styles.list}>
                {markers.map((marker, index) => (
                    <View key={index} style={styles.listItem}>
                        <Text>{marker.name}</Text>
                        <Text>{marker.vicinity}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    list: {
        flex: 1,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
});

export default Map;
