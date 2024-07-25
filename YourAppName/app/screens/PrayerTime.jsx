import {View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import PrayerBar from '../components/elements/PrayerBar';
import Location from '../components/elements/Location';
import PrayerToken from '../components/elements/PrayerToken';

const PrayerTimes = ({navigation, route}) => {
    const { prayerAndTime, militaryPrayerAndTime, uid } = route.params;
    const [masjidPrayerTimes, setMasjidPrayerTimes] = useState('LocalTime')
    const prayersOrder = ['Fajr', 'Dhuhur', 'Asr', 'Maghrib', 'Isha'];


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

            
            <View style={styles.content}>
                <Text style={styles.mainText }>Mhrm. 1, 1445 AH</Text>
                <View style={styles.prayerBar}>
                    <PrayerBar nextPrayer={"Magrib"} timeTillNext={'14 mins 20 sec'} size={32} prayerAndTime={militaryPrayerAndTime} height={20}/>
                </View>
                <View style={styles.prayerArea}>
                    { masjidPrayerTimes === "LocalTime"  && prayerAndTime.map((specificPrayer, index) => (

                        (specificPrayer[0] != "Sunset" && specificPrayer[0] != "Sunrise") && 

                        <View key={index} style={styles.prayerAndTime}>
                            {(specificPrayer[0] == "Maghrib") &&
                                (<PrayerToken prayer={specificPrayer[0]} prayerTime={specificPrayer[1]} currentPrayer={true}/> )}
                            {(specificPrayer[0] != "Maghrib") &&
                                (<PrayerToken prayer={specificPrayer[0]} prayerTime={specificPrayer[1]} currentPrayer={false}/> )}
                        </View>
                    ))}
                    { masjidPrayerTimes !== undefined && (masjidPrayerTimes.length === 1 && prayersOrder.map((prayer, index) => (
                        <View key={index} style={styles.prayerAndTime}>
                            {/* <Text style={styles.text}>{prayer}</Text>
                            <Text style={styles.text}>{masjidPrayerTimes[0][prayer]}</Text> */}
                            <PrayerToken prayer={prayer} prayerTime={masjidPrayerTimes[0][prayer]}/>
                        </View>
                    )))}
                </View>
                <View className="absolute bottom-10 left-7">
                    <Location location={'Keller, TX'} uid={uid} setMasjidPrayerTimes={setMasjidPrayerTimes}/>
                </View>
                
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