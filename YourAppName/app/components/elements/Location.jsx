// 1 Firebase Function
// 1 Redesign

import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {IP_URL} from '@env'
import axios from "axios";

const Location = ({ setTime, userInfo, setMasjidPrayerTimes }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [favMasjidIds, setFavMasjidsIds] = useState([]);
    const [favMasjidsNames, setFavMasjidsNames] = useState([]);
    const [text, setText] = useState('Your Location')

    useEffect(() => {
        if(userInfo)
            setFavMasjidsIds(userInfo.mosquesFollowed)
    }, [userInfo]);

    useEffect(() => {
        for(let id of favMasjidIds)
            {
                const options = {
                    method: 'GET',
                url: `${IP_URL}/mosque/getMosque`,
                params: {mosqueId: id},
                headers: {'Content-Type': 'application/json'}
                }
                axios.request(options).then(function (response) {
                    console.log(response.data)
                    setFavMasjidsNames(prevState => [...prevState, response.data.mosqueName])
                }).catch(function (error) {
                    console.error(error);
                });
                
            }
    }, [favMasjidIds])

    console.log(favMasjidIds)
    // Gets Masjid Prayer Times & Sets flatlist to close
    const handlePress = async (masjidId) => {
        // try {
        //     let docRef = doc(FIRESTORE_DB, "masjids", masjidId.replace(/\s/g, ''));
        //     const docSnap = await getDoc(docRef);
        //     setMasjidPrayerTimes(docSnap.data()["prayerTimes"]);
        //     setIsOpen(false);
        // } catch (error) {
        //     console.error("Error fetching prayer times: ", error);
        //     setMasjidPrayerTimes(["n/a"])
        // }
    };

    return (
    <View style={styles.wrapper}>
        <TouchableOpacity style={styles.content} onPress={() => setIsOpen(!isOpen)}>
            <Ionicons name="navigate" size={25} color={'#F2EFFB'}/>
            <Text style={styles.locationText}> {text} </Text>
        </TouchableOpacity>

        {isOpen && (
                <View style={styles.dropdownContainer}>

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
        color: '#F2EFFB', 
        marginHorizontal: '1%'
    },    
    content: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    dropdownContainer: {
        position: 'absolute',
        top: -150, 
        left: 0,
        right: 0,
        backgroundColor: 'rgb(103, 81, 154)',
        borderRadius: 5,
        elevation: 5, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 5 }, 
        shadowOpacity: 0.3, 
        shadowRadius: 5, 
        width: 150,
        paddingVertical: 3
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#F2EFFB',
    },
    dropdownText: {
        fontSize: 18,
        color: '#F2EFFB',
        padding: 10,
    }
});

export default Location;