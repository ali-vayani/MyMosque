import {View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import PrayerBar from '../components/elements/PrayerBar';
import Location from '../components/elements/Location';
import PrayerToken from '../components/elements/PrayerToken';
import convertMilitaryTime from '../functions/convertMilitaryTime';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { BallIndicator } from 'react-native-indicators';

const PrayerTimes = ({navigation, route}) => {
    const { prayerAndTime, currentPrayer, uid } = route.params;
    const [favMasjids, setFavoriteMasjids] = useState([]);
    const [masjidPrayerTimes, setMasjidPrayerTimes] = useState(prayerAndTime)
    const [currPrayer, setCurrPrayer] = useState ("")
    const [isLoading, setIsLoading] = useState(true);
    const prayersOrder = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
    const docRef = doc(FIRESTORE_DB, "users", uid);

    useEffect(() => {
        const getMasjidId = async () => {
            setIsLoading(true)
            try{
                const docSnap = await getDoc(docRef);
                setFavoriteMasjids(docSnap.data()["favMasjids"]);
            } catch {
                setFavoriteMasjids([]);
            }
            setIsLoading(false);
        }
        getMasjidId();
    }, []);

    useEffect(() => {
        console.log(masjidPrayerTimes)
        //setIsLoading(false); 
    }, [masjidPrayerTimes])

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

            {(prayerAndTime || currentPrayer) && !isLoading ? (
                <View style={styles.content}>
                    <Text style={styles.mainText }>Mhrm. 1, 1445 AH</Text>
                    <View style={styles.prayerBar}>
                        <PrayerBar nextPrayer={"Magrib"} timeTillNext={'14 mins 20 sec'} size={32} prayerAndTime={masjidPrayerTimes} height={20} currentPrayer={currentPrayer}/>
                    </View>
                    <View style={styles.prayerArea}>
                        {masjidPrayerTimes && prayersOrder.map((prayer, index) => (
                            <View key={index} style={styles.prayerAndTime}>
                                {(prayer == currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(masjidPrayerTimes[prayer])} currentPrayer={true}/> )}
                                {(prayer != currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(masjidPrayerTimes[prayer])} currentPrayer={false}/> )}
                            </View>
                        ))}
                        {/* {masjidPrayerTimes !== 'LocalTime' && (prayersOrder.map((prayer, index) => (
                            <View key={index} style={styles.prayerAndTime}>
                                {(prayer == currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(masjidPrayerTimes[prayer])} currentPrayer={true}/> )}
                                {(prayer != currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(masjidPrayerTimes[prayer])} currentPrayer={false}/> )}
                            </View>
                        )))} */}
                    </View>
                    <View style={styles.location}>
                        <Location 
                            location={'Your Location'} 
                            uid={uid} 
                            setMasjidPrayerTimes={setMasjidPrayerTimes} 
                            favMasjids={favMasjids}
                            setCurrPrayer={setCurrPrayer}
                            setLoading={setIsLoading}
                        />
                    </View>
                    
                </View>
            ) : <BallIndicator color="#F2EFFB" />}
            
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