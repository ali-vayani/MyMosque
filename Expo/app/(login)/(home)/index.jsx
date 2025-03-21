import {View, StyleSheet, Text, Animated, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from '../../../components/widgets/PrayerTimesWidget';
import SearchWidget from '../../../components/widgets/SearchWidget';
import MyMosqueWidget from '../../../components/widgets/MyMosquesWidget';
import { useState, useEffect, useRef } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { useLocalSearchParams } from 'expo-router';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import getLocalPrayerTimes from '../../../functions/getLocalPrayerTimes';
import getUserLocation from '../../../functions/getUserLocation';
import getLocalMosques from '../../../functions/getLocalMosques';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocationExpo from 'expo-location';
import LocationServicesWidget from '../../../components/widgets/LocationServicesWidget';

const Home = () => {
    const getAsyncData = async () => {
        const cachedPrayer = await AsyncStorage.getItem('prayerTimesCache');
        const cachedLoc = await AsyncStorage.getItem('nearbyMosques');
        return {prayer: cachedPrayer, loc: cachedLoc};
    }

    const { uid } = useLocalSearchParams();
    const [locationData, setLocationDate] = useState(getAsyncData());
    const [locMosques, setLocMosques] = useState(getAsyncData().loc);
    const docRef = uid ? doc(FIRESTORE_DB, "users", uid) : null;
    const [masjidId, setMasjidId] = useState(["OnfodEG98Qaa3GIYKNxW"])
    const [locAvalible, setLocAvalible] = useState(false);


    useEffect(() => {
        const initializeApp = async () => {
            await getAppData();
        };
        initializeApp();
    }, []);

    // gets info for app to run
    const getAppData = async () => {
        try {
            let { status } = await LocationExpo.requestForegroundPermissionsAsync();
            console.log(status)
            setLocAvalible(status === 'granted');
            
            if (status === 'granted') {
                const userLoc = await getUserLocation();
                const locData = await getLocalPrayerTimes(userLoc, uid);
                const mosques = await getLocalMosques(userLoc.latitude, userLoc.longitude);
                setLocMosques(mosques);
                setLocationDate(locData);
                
                if(docRef && uid) {
                    const docSnap = await getDoc(docRef);
                    const data = docSnap.data();
                    if (data && data.favMasjids && data.favMasjids.length > 0) {
                        setMasjidId(data.favMasjids);
                    } else {
                        setMasjidId(["OnfodEG98Qaa3GIYKNxW"]);
                    }
                } else {
                    setMasjidId(["OnfodEG98Qaa3GIYKNxW"]);
                }
            }
        } catch (error) {
            console.error('Error in getAppData:', error);
            setLocAvalible(false);
        }
    }
    
    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            <View style={styles.content}>
                {locAvalible ? <>
                    <PrayerTimesWidget uid={uid} favMasjids={masjidId} locationData={locationData}/>
                    <SearchWidget uid={uid} locMosques={locMosques}/>
                </> :
                <>
                    <LocationServicesWidget/>
                    <SearchWidget uid={uid} locMosques={locMosques} disabled={true}/>
                </>
                    
                    
                }
                {masjidId ? (
                <MyMosqueWidget masjidId={masjidId} uid={uid} fullscreen={false}/>
                ) : (
                    <></>                
                )}
            </View>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute',
        zIndex:-2,
    },
    content: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        marginVertical: '2%',
    },
    timeContainer: {
        position: 'absolute',
        top: '10%',
        left: 0,
        backgroundColor: 'rgba(103, 81, 154, 0.9)',
        padding: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        zIndex: 100,
    },
    metricsToggle: {
        position: 'absolute',
        top: '5%',
        left: '5%',
        zIndex: 101,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    timeText: {
        color: '#F2EFFB',
        fontSize: 16,
        fontWeight: 'bold',
    },
    fetchText: {
        color: '#F2EFFB',
        fontSize: 14,
        marginTop: 4,
    }
})