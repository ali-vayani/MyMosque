import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, Image, Linking  } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import SearchWidget from '../components/widgets/SearchWidget';
import { LinearGradient } from 'expo-linear-gradient';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { collection, query, where, getDocs } from "firebase/firestore";
import { async } from '@firebase/util';


const Map = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [value, setValue] = useState();
    const [expanded, setExpanded] = useState(null)
    const [masjidId, setMasjidID] = useState(null)
    //onst masjidsRef = FIRESTORE_DB.collection('masjids');


    useEffect(() => {
        ///setMarkers([])
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

    const masjidExistsInDatabase = async (address) => {
        try {
            console.log(address)
            const getMasjidWithAddress = query(collection(FIRESTORE_DB, "masjids"), where("address", "==", address));
            const querySnapshot = await getDocs(getMasjidWithAddress);
            console.log(querySnapshot.docs)
            querySnapshot.forEach((doc) => {
                setMasjidID(doc.id);
                console.log(doc.id, " => ", doc.data());
            });
        } catch (error) {
            console.error("An error occurred:", error);
        }

    }

    const fetchQueryMosque = async (query, lat, lng, nextPageToken = null) => {
        const apiKey = 'AIzaSyD8TOCKBJE00BR8yHhQC4PhN7Vu7AdM68c';
        const radius = 24000;
        let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query + "mosque")}&radius=${radius}&keyword=mosque&key=${apiKey}`;

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

                setMarkers(resultsWithDistance);
            }
            // ...
        } catch (error) {
            console.error("Error fetching mosques: ", error);
        }
    }

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
                setMarkers(resultsWithDistance);
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
            <LinearGradient colors={['#57658E', '#A79A84']} style={styles.background}/>
            <Image 
                source={require('../../assets/images/Random3.png')} 
                style={styles.imageBg}
            />
            <View style={styles.searchContainer}>
                <SearchWidget inputVersion={true} onSubmit={() => value ? fetchQueryMosque(value, location["latitude"], location["longitude"]) : null} setValue={setValue} value={value}/>
            </View>
            
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
            <LinearGradient colors={['#57658E', '#A79A84']} style={styles.background}/>
            <Image 
                source={require('../../assets/images/Random3.png')} 
                style={styles.imageBg}
            />
            {markers.map((marker, index) => (
                <TouchableOpacity 
                    key={index} 
                    style={styles.listItem} 
                    onPress={ async () => {
                    onMarkerPress(marker.geometry.location.lat, marker.geometry.location.lng);
                    setMasjidID(null)
                    setExpanded(expanded === index ? null : index); // Toggle expanded state
                    await masjidExistsInDatabase(marker.vicinity)
                    console.log(masjidId)
                    }}
                >
                    <Text style={[styles.nameText, {fontWeight: 'bold'}]}>{marker.name}</Text>
                    <Text style={styles.nameText}>{marker.vicinity}</Text>
                    {
                    expanded === index && 
                    <View style={{flexDirection: 'row', gap: 15, marginVertical: '3%'}}>
                        
                        {
                            masjidId !== null &&
                            <TouchableOpacity style={{padding: '5%', backgroundColor: '#679159', borderRadius: 20,}} onPress={() => navigation.navigate('Mosque', {masjidId: masjidId})}><Text style={styles.nameText}>Learn More</Text></TouchableOpacity>
                        }
                        {
                            masjidId === null &&
                            <TouchableOpacity style={{padding: '5%', backgroundColor: '#679159', borderRadius: 20,}} onPress={() => navigation.navigate('CreateMosque')}><Text style={styles.nameText}>Create this Mosque</Text></TouchableOpacity>
                        }
                        {
                            markers.length/2 >= index &&
                            <TouchableOpacity style={{padding: '5%', backgroundColor: '#A79A84', borderRadius: 20}} onPress={() => Linking.openURL('https://www.google.com/maps/place/'+marker.vicinity.replace(/ /g, "+"))}><Text style={styles.nameText}>Get Directions</Text></TouchableOpacity>
                        }
                        {
                            markers.length/2 < index &&
                            <TouchableOpacity style={{padding: '5%', backgroundColor: '#57658E', borderRadius: 20}} onPress={() => Linking.openURL('https://www.google.com/maps/place/'+marker.vicinity.replace(/ /g, "+"))}><Text style={styles.nameText}>Get Directions</Text></TouchableOpacity>
                        }
                    </View> 
                    }
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
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    imageBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 41.5,
        opacity: .05,
    },
    nameText: {
        color: '#FFF4D2',
    },
    searchContainer: {
        position: 'absolute',
        top: 30, 
        left: 0, 
        right: 0, 
        zIndex: 10, 
        height: 90,
        alignItems: 'center',
    },
    
});

export default Map;
