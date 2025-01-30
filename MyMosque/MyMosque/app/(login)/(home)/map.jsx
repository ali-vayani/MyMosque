import React, { useState, useEffect, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VirtualizedList } from 'react-native';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import SearchWidget from '../../../components/widgets/SearchWidget';
import MapList from '../../../components/elements/MapList';
import { useRouter, useLocalSearchParams } from 'expo-router';

const Map = ({ navigation, route }) => {
    const { uid } = useLocalSearchParams();
    const mapRef = useRef(null)
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [value, setValue] = useState();
    const [expanded, setExpanded] = useState(null);
    const [masjidId, setMasjidID] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const cacheKey = 'nearbyMosquesCache';
    const cacheDuration = 1000 * 60 * 15; // 15 minutes

    const fetchQueryMosque = async (query, lat, lng, nextPageToken = null) => {
        const apiKey = 'AIzaSyD8TOCKBJE00BR8yHhQC4PhN7Vu7AdM68c';
        const radius = 24000;
        let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&type=mosque&radius=${radius}&key=${apiKey}`;
        
        if (nextPageToken) {
            url += `&pagetoken=${nextPageToken}`;
        }
        
        try {
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
                setMarkers(resultsWithDistance);
                if (resultsWithDistance.length > 0) {
                    const nearestMarker = resultsWithDistance[0];
                    setLocation({
                        latitude: nearestMarker.geometry.location.lat,
                        longitude: nearestMarker.geometry.location.lng,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching mosques: ", error);
        }
    };

    const getItemCount = (data) => data.length;
    const getItem = (data, index) => data[index];

    const onMarkerPress = (latitude, longitude) => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude,
                    longitude,
                    latitudeDelta: 0.075,
                    longitudeDelta: 0.075,
                },
                500
            );
        }
    };

    const onListItemPress = (latitude, longitude) => {
        if (mapRef.current) {
            mapRef.current.animateToRegion(
                {
                    latitude,
                    longitude,
                    latitudeDelta: 0.025,
                    longitudeDelta: 0.025,
                },
                500
            );
        }
    };

    useEffect(() => {
        (async () => {
            const startTime = performance.now();
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
                latitudeDelta: 0.075,
                longitudeDelta: 0.075,
            });

            // Try to get cached data first
            const cachedData = await AsyncStorage.getItem(cacheKey);
            //console.log(cachedData)
            if (cachedData) {
                const { data, timestamp } = JSON.parse(cachedData);
                if (Date.now() - timestamp < cacheDuration) {
                    setMarkers(data);
                    const endTime = performance.now();
                    console.log(`API Response Time: ${endTime - startTime}ms`);
                    return;
                }
            }

            fetchNearbyMosques(latitude, longitude);
            console.log("tetststs")
        })();
    }, []);

    const fetchNearbyMosques = async (lat, lng, nextPageToken = null) => {
        setIsLoading(true);
        const radius = 24000;
        const apiKey = 'AIzaSyD8TOCKBJE00BR8yHhQC4PhN7Vu7AdM68c';
        let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=mosque&key=${apiKey}`;
        
        if (nextPageToken) {
            url += `&pagetoken=${nextPageToken}`;
        }

        try {
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
                setMarkers(resultsWithDistance);

                // Cache the results
                await AsyncStorage.setItem(cacheKey, JSON.stringify({
                    data: resultsWithDistance,
                    timestamp: Date.now()
                }));
            }
        } catch (error) {
            console.error("Error fetching: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Memoize markers to prevent unnecessary re-renders
    const memoizedMarkers = useMemo(() => markers, [markers]);

    return (
        <View style={styles.container}>
            {/* <LinearGradient colors={['#57658E', '#57658E']} style={styles.background} /> */}
            <Image 
                source={require('../../../assets/searchBg.png')} 
                style={styles.imageBg}
                loading="lazy"
            />
            <View style={styles.searchContainer}>
                <SearchWidget 
                    inputVersion={true} 
                    onSubmit={() => value ? fetchQueryMosque(value, location.latitude, location.longitude) : null} 
                    setValue={setValue} 
                    value={value} 
                />
            </View>
            
            <MapView
                style={styles.map}
                region={location}
                ref={mapRef}
            >
                {memoizedMarkers.map((marker, index) => (
                    <Marker
                        key={marker.place_id}
                        coordinate={{
                            latitude: marker.geometry.location.lat,
                            longitude: marker.geometry.location.lng,
                        }}
                        title={marker.name}
                        onPress={() => onMarkerPress(marker.geometry.location.lat, marker.geometry.location.lng)}
                        tracksViewChanges={false}
                    />
                ))}
            </MapView>
            {memoizedMarkers.length < 1 ? 
                <View style={[styles.list, { justifyContent: 'center', alignItems: 'center' }]}>
                    <ActivityIndicator size="large" color="#F2EFFB" /> 
                </View>
                : <VirtualizedList
                    style={styles.list}
                    contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
                    data={memoizedMarkers}
                    renderItem={({ item: marker, index }) => (
                        <MapList 
                            key={marker.place_id} 
                            marker={marker} 
                            name={index} 
                            onPress={() => onListItemPress(marker.geometry.location.lat, marker.geometry.location.lng)}
                            navigation={navigation}
                            uid={uid}
                        />
                    )}
                    keyExtractor={item => item.place_id}
                    getItemCount={getItemCount}
                    getItem={getItem}
                    initialNumToRender={5}
                    maxToRenderPerBatch={5}
                    windowSize={5}
                    removeClippedSubviews={true}
                />
            }
        </View>
    );
};




const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1.5,
    },
    list: {
        flex: 1,
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FFF4D2',
    },
    background: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    imageBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 41.5,
        opacity: 1,
    },
    nameText: {
        color: '#FFF4D2',
    },
    searchContainer: {
        position: 'absolute',
        top: 50, 
        left: 0, 
        right: 0, 
        zIndex: 10, 
        height: 90,
        alignItems: 'center',
    },
});

export default Map;
