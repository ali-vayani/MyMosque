// make functionality where masjid id can be param and this page works

import {View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import PrayerBar from '../components/elements/PrayerBar';
import Location from '../components/elements/Location';
import PrayerToken from '../components/elements/PrayerToken';
import convertMilitaryTime from '../functions/convertMilitaryTime';

const PrayerTimes = ({navigation, route}) => {
    const { prayerAndTime, currentPrayer, uid } = route.params;
    const [masjidPrayerTimes, setMasjidPrayerTimes] = useState('LocalTime')
    const prayersOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    useEffect(() => {
        console.log('Received params:', route.params);
    }, []);

    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#67519A']} style={styles.background}/>
            <Image 
                source={require('../../assets/prayerBg.png')} 
                style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: 41.5,
                opacity: .5,
                }}
            />

            {prayerAndTime || currentPrayer ? (
                <View style={styles.content}>
                    <Text style={styles.mainText }>Mhrm. 1, 1445 AH</Text>
                    <View style={styles.prayerBar}>
                        <PrayerBar nextPrayer={"Magrib"} timeTillNext={'14 mins 20 sec'} size={32} prayerAndTime={prayerAndTime} height={20} currentPrayer={currentPrayer}/>
                    </View>
                    <View style={styles.prayerArea}>
                        { masjidPrayerTimes === "LocalTime"  && prayersOrder.map((prayer, index) => (
                            <View key={index} style={styles.prayerAndTime}>
                                {(prayer == currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(prayerAndTime[prayer])} currentPrayer={true}/> )}
                                {(prayer != currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(prayerAndTime[prayer])} currentPrayer={false}/> )}
                            </View>
                        ))}
                        { masjidPrayerTimes !== undefined && (masjidPrayerTimes.length === 1 && prayersOrder.map((prayer, index) => (
                            <View key={index} style={styles.prayerAndTime}>
                                <PrayerToken prayer={prayer} prayerTime={masjidPrayerTimes[0][prayer]}/>
                            </View>
                        )))}
                    </View>
                    <View style={styles.location}>
                        <Location location={'Your Location'} uid={uid} setMasjidPrayerTimes={setMasjidPrayerTimes}/>
                    </View>
                    
                </View>
            ) : <></>}
            
        </View>
    )
}

export default PrayerTimes;

const styles = StyleSheet.create({
    location: {
        position: 'absolute',
        bottom: 30,
        left: 21
    },
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
    prayerBar: {
        width: '95%'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#F2EFFB',
    },
    mainText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F2EFFB',
        marginTop: '7%',
        marginBottom: '7%'

    },
    prayerAndTime:{
        width: '100%',
        justifyContent: 'center',
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