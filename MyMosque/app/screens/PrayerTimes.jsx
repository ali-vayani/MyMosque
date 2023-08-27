import {View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import PrayerBar from '../components/elements/prayerBar';
import Location from '../components/elements/location';
const PrayerTimes = ({navigation, route}) => {
    const { prayerAndTime, militaryPrayerAndTime, uid } = route.params;
    const [masjidPrayerTimes, setMasjidPrayerTimes] = useState('LocalTime')
    console.log(masjidPrayerTimes)
    const prayersOrder = ['Fajr', 'Dhuhur', 'Asr', 'Maghrib', 'Isha'];


    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#A79A84']} style={styles.background}/>
            <Image 
            source={require('../../assets/images/Random3.png')} 
            style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 41.5,
            opacity: .1,
            }}/>
            <View style={styles.content}>
                <Text style={styles.mainText }>Mhrm. 1, 1445 AH</Text>
                <PrayerBar nextPrayer={"Magrib"} timeTillNext={'14 mins 20 sec'} size={32} prayerAndTime={militaryPrayerAndTime}/>
                <View style={styles.prayerArea}>
                    { masjidPrayerTimes === "LocalTime"  && prayerAndTime.map((specificPrayer, index) => (
                        <View key={index} style={styles.prayerAndTime}>
                            <Text style={styles.text}>{specificPrayer[0]}</Text>
                            <Text style={styles.text}>{specificPrayer[1]}</Text>
                        </View>
                    ))}
                    { masjidPrayerTimes !== undefined && (masjidPrayerTimes.length === 1 && prayersOrder.map((prayer, index) => (
                        <View key={index} style={styles.prayerAndTime}>
                            <Text style={styles.text}>{prayer}</Text>
                            <Text style={styles.text}>{masjidPrayerTimes[0][prayer]}</Text>
                        </View>
                    )))}
                </View>
                <Location location={'Keller, TX'} uid={uid} setMasjidPrayerTimes={setMasjidPrayerTimes}/>
            </View>
        </View>
    )
}

export default PrayerTimes;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    content: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        paddingVertical: '20%',
        flexDirection: 'column'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF4D2',
    },
    mainText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF4D2',
        marginVertical: '15%'

    },
    prayerAndTime:{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },
    prayerArea: {
        width: '100%',
        gap: 12,
        paddingHorizontal: 30,
        marginTop: '15%'
    },
})