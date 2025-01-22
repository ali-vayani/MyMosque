import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { View, Text, Linking, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default MapList = ({ uid, marker, onPress, navigation}) => {
    const [address, setAddress] = useState(marker.vicinity || marker.formatted_address);
    const [name, setName] = useState(marker.name);
    console.log(address)
    const handleNavigate = async (navigateTo) => {
        try {
            const getMosqueWithAddress = query(collection(FIRESTORE_DB, "mosques"), where("address", "==", address));
            const querySnapshot = await getDocs(getMosqueWithAddress);
            if(navigateTo == "MosquePage")
                navigation.navigate("MosquePage", {masjidId: querySnapshot.docs[0].id, uid: uid})
            else if(navigateTo == "PrayerTimes") {
                const prayers = querySnapshot.docs[0].data().prayerTimes;
                const info = await getMosquePrayerTimes(prayers, address);
                const name = querySnapshot.docs[0].data().name;

                navigation.navigate('PrayerTimes', {
                    info: {
                        prayer: info.mosquePrayerTimes,
                        name: name
                    },
                    currentPrayer: info.currentPrayer,
                    uid: uid,
                });
            }
        } catch (error){
            console.error("an error occured: ", error)
        }
    }

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.innerContainer}>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.scrollViewContent}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    <View style={styles.imagePlaceholder}></View>
                    <View style={styles.imagePlaceholder}></View>
                    <View style={styles.imagePlaceholder}></View>
                    <View style={styles.imagePlaceholder}></View>
                </ScrollView>

                <Text style={styles.nameText}>{name}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.viewPageButton}
                        onPress={() => handleNavigate("MosquePage")}
                    >
                        <Text style={styles.buttonText}>View Page</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.directionsButton}
                        onPress={() => {
                            const address = marker.vicinity || marker.formatted_address;
                            const url = `https://www.google.com/maps/place/${encodeURIComponent(address.replace(/\s/g, '+'))}`;
                            Linking.openURL(url);
                        }}
                    >
                        <Text style={styles.buttonText}>Directions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.prayerTimesButton}
                        onPress={() => handleNavigate("PrayerTimes")}
                    >
                        <Text style={styles.buttonText}>Prayer Times</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '95%',
        marginVertical: 4,
        height: 192,
        backgroundColor: '#364866', // Equivalent to bg-darkBlue
        borderRadius: 20,
    },
    innerContainer: {
        height: '100%',
        marginHorizontal: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    scrollView: {
        marginTop: 8,
    },
    scrollViewContent: {
        flexDirection: 'row',
    },
    imagePlaceholder: {
        backgroundColor: 'rgba(166, 182, 209, 0.5)', // Equivalent to bg-lightBlue/50
        margin: 4,
        borderRadius: 4,
        width: 160,
    },
    nameText: {
        fontSize: 18,
        color: '#e6e8ec', // Equivalent to text-blueText
        fontWeight: 'bold',
        marginVertical: 8,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 12,
        flexDirection: 'row',
        gap: 8,
    },
    viewPageButton: {
        width: 112,
        height: 32,
        backgroundColor: '#699a51',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionsButton: {
        width: 112,
        height: 32,
        backgroundColor: '#516d9a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    prayerTimesButton: {
        width: 112,
        height: 32,
        backgroundColor: '#67519a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e6e8ec', 
        textAlign: 'center',
    },
});
