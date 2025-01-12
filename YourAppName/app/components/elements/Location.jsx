import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


const Location = ({ setTime, uid, setMasjidPrayerTimes, setCurrPrayer, favMasjids}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [favMasjidsNames, setFavMasjidsNames] = useState([]);
    const [text, setText] = useState('Your Location')
    const [prayers, setPrayers] = useState([]);
    const [address, setAddress] = useState("");
    const [currentPrayerTimes, setCurrentPrayerTimes] = useState(null);
    const [currentPrayer, setCurrentPrayer] = useState("")

    const fetchFavMasjids = async () => {

        try {
            let names = [];
            for (let masjidId of favMasjids) {
                let docRef = doc(FIRESTORE_DB, "mosques", masjidId.replace(/\s/g, ''));
                const docSnap = await getDoc(docRef);
                names.push({ name: docSnap.data()["name"], id: masjidId });
            }
            setFavMasjidsNames(names);
        } catch (error) {
            console.error("Error fetching favorite Masjids: ", error);
        }
    }

    useEffect(() => {
        fetchFavMasjids();
    }, [favMasjids]);

    useEffect(() => {
        if(setMasjidPrayerTimes !== null && currentPrayerTimes != null) {
            setMasjidPrayerTimes(currentPrayerTimes);
        }
    }, [currentPrayerTimes])

    useEffect(() => {
        if(currentPrayer !== null && setCurrPrayer != null) {
            setCurrPrayer(currentPrayer);
        }
    }, [setCurrPrayer])
    
    useEffect(() => {
        const fetchPrayers = async () => {
            const info = await getMosquePrayerTimes(prayers, address);
            setCurrentPrayerTimes(info.mosquePrayerTimes);
            setCurrentPrayer(info.currentPrayer);
        }
        fetchPrayers();
    }, [prayers])
    

    // Gets Masjid Prayer Times & Sets flatlist to close
    const handlePress = async (masjidId) => {
        try {
            let docRef = doc(FIRESTORE_DB, "mosques", masjidId.replace(/\s/g, ''));
            const docSnap = await getDoc(docRef);
            setAddress(docSnap.data()["address"])
            setPrayers(docSnap.data()["prayerTimes"]);
            setIsOpen(false);
        } catch (error) {
            console.error("Error fetching prayer times: ", error);
            setMasjidPrayerTimes(["n/a"])
        }
    };

    return (
    <View style={styles.wrapper}>
        {favMasjidsNames.length > 0 ? (
            <TouchableOpacity style={styles.content} onPress={() => setIsOpen(!isOpen)}>
                <Ionicons name="navigate" size={25} color={'#F2EFFB'}/>
                <Text style={styles.locationText}> {text} </Text>
            </TouchableOpacity>
        ) : <></>}

        {isOpen && (
                <View style={styles.dropdownContainer}>
                    <Image 
                        source={require('../../../assets/prayerBg.png')} 
                        style={{
                        width: '100%',
                        height: '100%',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        borderRadius: 8,
                        opacity: .2,
                        }}
                    />
                    {/* This Flatlist is very ugly, redesign and reimplement*/}

                    <FlatList
                        data={['Your Location', ...favMasjidsNames]}
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
                                <Text 
                                    style={styles.dropdownText}
                                    numberOfLines={1} 
                                    ellipsizeMode="tail" 
                                >
                                    {item.name || item}
                                </Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        ListFooterComponent={<View />} // Adds an empty view after the last item
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
        color: '#F2EFFB', 
        marginHorizontal: '1%'
    },    
    content: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    dropdownContainer: {
        position: 'absolute',
        left: 2,
        right: 0,
        backgroundColor: 'rgb(103, 81, 154)',
        borderRadius: 8,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 5, 
        width: 150,

    },
    dropdownText: {
        fontSize: 18,
        color: '#F2EFFB',
        padding: 10,
    }, 
    separator: {
        height: 1.5,
        backgroundColor: '#F2EFFB', 
    },
});

export default Location;