import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useRouter } from 'expo-router';
import PrayerBar from '../elements/PrayerBar';
import Location from '../elements/Location';
import getCurrentPrayer from '../../functions/getCurrentPrayer';
import getLocalPrayerTimes from '../../functions/getLocalPrayerTimes';
import { AppState } from 'react-native';

const PrayerTimesWidget = ({ uid, favMasjids, locationData }) => {
    const router = useRouter();
    const [time, setTime] = useState('14 min 20 sec')
    const [locationText, setLocText] = useState('Your Location')
    const [currentPrayer, setCurrentPrayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [mosqueInfo, setMosqueInfo] = useState({});
    const [date, setDate] = useState("");
    const [timeSettings, setTimeSettings] = useState([]);

    const nextPrayer = {
        "Fajr": "Dhuhr",
        "Dhuhr": "Asr",
        "Asr": "Maghrib",
        "Maghrib": "Isha",
        "Isha": "Fajr",
    };

    const handleNavigate = useCallback(() => {
        if(!isLoading)
            router.push({
                pathname: '/prayer',
                params: {
                    info: JSON.stringify(mosqueInfo),
                    currentPrayer: currentPrayer,
                    uid: uid,
                    date: date,
                    timeSettings: JSON.stringify(timeSettings)
                }
            });
    }, [mosqueInfo, currentPrayer, uid, date, timeSettings]);

    useEffect(() => {
        if(mosqueInfo) {
            setIsLoading(false);
            setLocText(mosqueInfo.name)
        }
    }, [mosqueInfo])

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            if (nextAppState === 'active') {
                const refreshData = async () => {
                    setIsLoading(true);
                    const res = await getLocalPrayerTimes(null, uid);
                    parseLocaitonData(res);
                    setIsLoading(false);
                };
                refreshData();
            }
        });

        const getTime = async () => {
            setIsLoading(true);
            const res = locationData != null ? locationData : await getLocalPrayerTimes(null, uid);
            parseLocaitonData(res);
            setIsLoading(false);
        };
        if(uid)
            getTime();

        return () => {
            subscription.remove();
        };
    }, [uid]);

    const parseLocaitonData = async (res) => {
        const month = res.date.hijri.month.en;
        const day = res.date.hijri.month.days;
        const year = res.date.hijri.year;
        const date = month + " " + day + ", " + year + " AH";
        setDate(date);
        const prayer = getCurrentPrayer(res.timings);
        setMosqueInfo({
            prayer: res.timings,
            name: 'Your Location',
            located: res.located
        })
        setCurrentPrayer(prayer);
    };
    
    return (
        <TouchableOpacity 
            style={styles.widget} 
            onPress={handleNavigate}>
            <Image 
                source={require('../../assets/prayerBg.png')} 
                style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: 41.5,
                opacity: .2,
                }}
            />
            {isLoading ? (
                <View style={styles.loading} key="loading-view">
                    <ActivityIndicator size="large" color="#F2EFFB" />
                </View>
            ) : (
                <View style={styles.content} key="content-view">
                    <Text style={styles.mainText}> Prayer Times</Text>
                    {/* <Text>{mosqueInfo.located}</Text> */}
                    <PrayerBar timeTillNext={time} nextPrayer={'Maghrib'} size={28} prayerAndTime={mosqueInfo.prayer} currentPrayer={currentPrayer} height={30}/>
                    <Location 
                        favMasjids={favMasjids} 
                        setMosqueInfo={setMosqueInfo}
                        setCurrPrayer={setCurrentPrayer}
                        setLoading={setIsLoading}
                        name={locationText}
                        uid={uid}
                    />
                </View>
            )}
        
        </TouchableOpacity>
    );
};

export default PrayerTimesWidget;

const styles = StyleSheet.create({
    widget: {
        width: '97%',
        height: '30%',
        backgroundColor: '#67519A',
        borderRadius: 41.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    mainText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F2EFFB',
        marginTop: 10,
    },
    content: {
        paddingTop: '10%',
        paddingBottom: '5%',
        width: '90%',
        height: '100%',
        justifyContent: 'space-between',
    },
    loading : {
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent:'center',
        alignItems: 'center'
    }
});