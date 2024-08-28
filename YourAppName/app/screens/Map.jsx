import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import SearchWidget from '../components/widgets/SearchWidget';
import { LinearGradient } from 'expo-linear-gradient';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import MapList from '../components/elements/MapList';

const Map = ({ navigation, route }) => {
    const { uid } = route.params;
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [value, setValue] = useState();
    const [expanded, setExpanded] = useState(null);
    const [masjidId, setMasjidID] = useState(null);

    console.log(markers);

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
                latitudeDelta: 0.075,
                longitudeDelta: 0.075,
            });

            fetchNearbyMosques(latitude, longitude)
            //fetchQueryMosque("San Francisco", latitude, longitude);
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
                const resultsWithDistance = data.results.map(result => ({
                    ...result,
                    distance: getDistance(
                        { latitude: lat, longitude: lng },
                        { latitude: result.geometry.location.lat, longitude: result.geometry.location.lng }
                    ),
                }));

                resultsWithDistance.sort((a, b) => a.distance - b.distance);
                setMarkers(resultsWithDistance);
            }
        } catch (error) {
            console.error("Error fetching mosques: ", error);
        }
    };

    const onMarkerPress = (latitude, longitude) => {
        setLocation({
            latitude,
            longitude,
            latitudeDelta: 0.075,
            longitudeDelta: 0.075,
        });
    };

    const onListItemPress = (latitude, longitude) => {
        setLocation({
            latitude,
            longitude,
            latitudeDelta: 0.075,
            longitudeDelta: 0.075,
        });
    };

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

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#57658E', '#A79A84']} style={styles.background} />
            <Image 
                source={require('../../assets/Random3.png')} 
                style={styles.imageBg} 
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
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={marker.place_id}
                        coordinate={{
                            latitude: marker.geometry.location.lat,
                            longitude: marker.geometry.location.lng,
                        }}
                        title={marker.name}
                        onPress={() => onMarkerPress(marker.geometry.location.lat, marker.geometry.location.lng)}
                    />
                ))}
            </MapView>

            <ScrollView 
                style={styles.list}
                contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }}
            >
                <LinearGradient colors={['#57658E', '#A79A84']} style={styles.background} />
                {markers.map((marker, index) => (
                    <MapList 
                        key={marker.place_id} 
                        marker={marker} 
                        name={index} 
                        onPress={() => onListItemPress(marker.geometry.location.lat, marker.geometry.location.lng)}
                    />
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
        opacity: 0.05,
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
