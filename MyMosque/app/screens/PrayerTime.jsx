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
import { Ionicons } from '@expo/vector-icons';
import SettingsModal from '../components/elements/SettingsModal';

const PrayerTimes = ({navigation, route}) => {
    const { info, currentPrayer, uid, name, date, setTimeSettings, timeSettings} = route.params;
    const [locationText, setLocText] = useState('Your Location')
    const [favMasjids, setFavoriteMasjids] = useState([]);
    const [mosqueInfo, setMosqueInfo] = useState(info) // idk why i named it this way, {prayerTimes & name}
    const [currPrayer, setCurrPrayer] = useState ("")
    const [isLoading, setIsLoading] = useState(true);
    const [displayModal, setDisplayModal] = useState(false);
    const [islamicDate, setIslamicDate] = useState(date);
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

        const getDate = async () => {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = `${day}-${month}-${year}`;
        
            const url = `https://api.aladhan.com/v1/gToH/${formattedDate}`;
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const month = data.data.hijri.month.en
                const day = data.data.hijri.month.days
                const year = data.data.hijri.year;
                const date = month + " " + day + ", " + year + " AH";
                setIslamicDate(date);
            } catch (error) {
                console.error('Error fetching data:', error);
                return null;
            }
        };
        
        getMasjidId();
        if(!islamicDate)
            getDate();
    }, []);

    useEffect(() => {
        if(mosqueInfo) {
            setIsLoading(false);
            setLocText(mosqueInfo.name)
        }
    }, [mosqueInfo])

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

            {(info || currentPrayer) && !isLoading ? (
                <View style={styles.content}>
                    <Text style={styles.mainText }>{islamicDate}</Text>
                    <View style={styles.prayerBar}>
                        <PrayerBar nextPrayer={"Magrib"} timeTillNext={'14 mins 20 sec'} size={32} prayerAndTime={mosqueInfo.prayer} height={20} currentPrayer={currentPrayer}/>
                    </View>
                    <View style={styles.prayerArea}>
                        {mosqueInfo.prayer && prayersOrder.map((prayer, index) => (
                            <View key={index} style={styles.prayerAndTime}>
                                {(prayer == currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(mosqueInfo.prayer[prayer])} currentPrayer={true}/> )}
                                {(prayer != currentPrayer) &&
                                    (<PrayerToken prayer={prayer} prayerTime={convertMilitaryTime(mosqueInfo.prayer[prayer])} currentPrayer={false}/> )}
                            </View>
                        ))}
                    </View>
                    <View style={styles.location}>
                        <Location 
                            location={'Your Location'} 
                            uid={uid} 
                            setMosqueInfo={setMosqueInfo} 
                            favMasjids={favMasjids}
                            setCurrPrayer={setCurrPrayer}
                            setLoading={setIsLoading}
                            name={name || locationText}
                        />
                        <TouchableOpacity onPress={() => setDisplayModal(true)}>
                            <Ionicons name="cog-outline" size={25} color={'#F2EFFB'}/>
                        </TouchableOpacity>
                    </View>
                    {displayModal ? <SettingsModal 
                                        setDisplayModal={setDisplayModal} 
                                        displayModal={displayModal} 
                                        uid={uid}
                                        setPrayerInfo={setMosqueInfo}
                                    /> : <></>}
                </View>
            ) : <BallIndicator color="#F2EFFB" />}
            
        </View>
    )
}

export default PrayerTimes;

const styles = StyleSheet.create({
    location: {
        position: 'absolute',
        width: '85%',
        bottom: 30,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
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