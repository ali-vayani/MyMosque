import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import getLocalPrayerTimes from '../../functions/getLocalPrayerTimes';

const Location = ({setMosqueInfo, setCurrPrayer, favMasjids, setLoading, name}) => {
    useEffect(() => {
        console.log("loading func", setLoading);
    }, [setLoading])
    if(name == undefined)
        name = 'Your Location'
    const [isOpen, setIsOpen] = useState(false);
    const [favMasjidsNames, setFavMasjidsNames] = useState([]);
    const [text, setText] = useState(name)

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
        if(favMasjids)
            fetchFavMasjids();
    }, [favMasjids]);

    const handlePress = async (item) => {
        try {
            let docRef = doc(FIRESTORE_DB, "mosques", item.id.replace(/\s/g, ''));
            const docSnap = await getDoc(docRef);
            const prayers = docSnap.data()["prayerTimes"];
            const address = docSnap.data()["address"]
            const info = await getMosquePrayerTimes(prayers, address);
            
            if(setMosqueInfo !== null && info != null) {
                const mosqueInfo = {
                    prayer: info.mosquePrayerTimes,
                    name: item.name,
                }
                setMosqueInfo(mosqueInfo);
            }

            if(info.currentPrayer && setCurrPrayer) {
                setCurrPrayer(info.currentPrayer);
            }
            setIsOpen(false);
        } catch (error) {
            console.error("Error fetching prayer times: ", error);
            setMosqueInfo({
                prayers: {},
                name: 'Error'
            })
        }
    };

    return (
    <View style={styles.wrapper}>
        <TouchableOpacity style={styles.content} onPress={() => setIsOpen(!isOpen)}>
            <Ionicons name="navigate" size={25} color={'#F2EFFB'}/>
            <Text style={styles.locationText}> {text} </Text>
        </TouchableOpacity>

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

                    <FlatList
                        data={['Your Location', ...favMasjidsNames]}
                        keyExtractor={(item) => item.name || item}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                style={styles.listItem} 
                                onPress={ async () => {
                                    if (item === 'Your Location') {
                                        if(text !== 'Your Location') {
                                            setText('Your Location');
                                            setLoading(true);
                                            if(setMosqueInfo !== null) {
                                                const prayers = await getLocalPrayerTimes()
                                                setMosqueInfo({
                                                    prayer: prayers.data.timings,
                                                    name: 'Your Location'
                                                });
                                                setLoading(false)
                                            }
                                        }
                                    } else {
                                        setText(item.name);
                                        setLoading(true)
                                        await handlePress(item);
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
                        ListFooterComponent={<View />} 
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
        top: -100,
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