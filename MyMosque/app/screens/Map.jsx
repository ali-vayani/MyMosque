import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';

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
    const radius = 24000;
    const apiKey = 'AIzaSyD8TOCKBJE00BR8yHhQC4PhN7Vu7AdM68c';
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&keyword=mosque&key=${apiKey}`;
    
    if (nextPageToken) {
        url += `&pagetoken=${nextPageToken}`;
    }

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results) {
            // Add distance property to each result
            const resultsWithDistance = data.results.map(result => ({
                ...result,
                distance: getDistance(
                    { latitude: lat, longitude: lng },
                    { latitude: result.geometry.location.lat, longitude: result.geometry.location.lng }
                ),
            }));

            // Sort by distance
            resultsWithDistance.sort((a, b) => a.distance - b.distance);

            setMarkers(prevMarkers => [...prevMarkers, ...resultsWithDistance]);
        }
        // ...
    } catch (error) {
        console.error("Error fetching mosques: ", error);
    }
};

    const onMarkerPress = (latitude, longitude) => {
        setLocation({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        });
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
            <TouchableOpacity key={index} style={styles.listItem} onPress={() => onMarkerPress(marker.geometry.location.lat, marker.geometry.location.lng)}>
                <Text>{marker.name}</Text>
                <Text>{marker.vicinity}</Text>
            </TouchableOpacity>
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
