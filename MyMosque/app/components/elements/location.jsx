import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Location = ({ setTime, uid, setMasjidPrayerTimes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [favMasjidsNames, setFavMasjidsNames] = useState([]);
    const [text, setText] = useState('Your Location')

    useEffect(() => {
    async function fetchFavMasjids() {
        try {
            let userRef = doc(FIRESTORE_DB, "users", uid.replace(/\s/g, ''));
            const userDocSnap = await getDoc(userRef);
            const favMasjids = userDocSnap.data()["favMasjids"];
            
            let names = [];
            for (let masjidId of favMasjids) {
                let docRef = doc(FIRESTORE_DB, "masjids", masjidId.replace(/\s/g, ''));
                const docSnap = await getDoc(docRef);
                names.push({ name: docSnap.data()["name"], id: masjidId });
            }
            setFavMasjidsNames(names);
        } catch (error) {
            console.error("Error fetching favorite Masjids: ", error);
        }
    }

    fetchFavMasjids();
    }, [uid]);
    const handlePress = async (masjidId) => {
        try {
            let docRef = doc(FIRESTORE_DB, "masjids", masjidId.replace(/\s/g, ''));
            const docSnap = await getDoc(docRef);
            setMasjidPrayerTimes(docSnap.data()["prayerTimes"]);
            setIsOpen(false);
        } catch (error) {
            console.error("Error fetching prayer times: ", error);
            setMasjidPrayerTimes(["n/a"])
        }
    };

    return (
    <View style={styles.wrapper}>
        <TouchableOpacity style={styles.content} onPress={() => setIsOpen(!isOpen)}>
            <Ionicons name="navigate-outline" size={25} color={'#FFF4D2'}/>
            <Text style={styles.locationText}> {text} </Text>
        </TouchableOpacity>

        {isOpen && (
                <View style={styles.dropdownContainer}>
                    <FlatList
                        data={['Your Location', ...favMasjidsNames]} // Add "Your Location" to the beginning of the list
                        keyExtractor={(item) => item.name || item}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.listItem} 
                                onPress={() => {
                                    if (item === 'Your Location') {
                                        setText('Your Location');
                                        setMasjidPrayerTimes('LocalTime');
                                    } else {
                                        setText(item.name);
                                        handlePress(item.id);
                                    }
                                    setIsOpen(false);
                                }}
                            >
                                <Text style={styles.dropdownText}>{item.name || item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}
        </View>
    );

};

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 10,
    },
    locationText: {
        fontSize: 20,
        color: '#FFF4D2', 
        marginHorizontal: '1%'
    },    
    content: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 35, // Adjust based on the size of the icon and text
        left: 0,
        right: 0,
        backgroundColor: 'rgb(103, 81, 154)',
        borderRadius: 5,
        elevation: 5, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 5 }, // For shadow on iOS
        shadowOpacity: 0.3, // For shadow on iOS
        shadowRadius: 5, // For shadow on iOS
        width: 150,
        paddingVertical: 3
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#FFF4D2',
    },
    dropdownText: {
        fontSize: 18,
        color: '#FFF4D2',
        padding: 10,
    }
});

export default Location;
