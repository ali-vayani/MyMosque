import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import PrayerBar from '../elements/PrayerBar';
import Location from '../elements/Location';
import getCurrentPrayer from '../../functions/getCurrentPrayer';
import getLocalPrayerTimes from '../../functions/getLocalPrayerTimes';
import { BallIndicator } from 'react-native-indicators';

const PrayerTimesWidget = ({ navigation, uid, favMasjids }) => {
    const [time, setTime] = useState('14 min 20 sec')
    const [locationText, setLocText] = useState('Your Location')
    const [currentPrayer, setCurrentPrayer] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [mosqueInfo, setMosqueInfo] = useState({});
    const [date, setDate] = useState("")

    const handleNavigate = useCallback(() => {
        navigation.navigate('PrayerTimes', {
            info: mosqueInfo, 
            currentPrayer: currentPrayer, 
            uid: uid,
            date: date
        });
    }, [mosqueInfo, currentPrayer, uid]);

    useEffect(() => {
        if(mosqueInfo) {
            setIsLoading(false);
            setLocText(mosqueInfo.name)
        }
    }, [mosqueInfo])

    useEffect(() => {
        const getTime = async () => {
            setIsLoading(true);
            await getLocalPrayerTimes()
                .then((res) => {
                    const month = res.data.date.hijri.month.en;
                    const day = res.data.date.hijri.month.days;
                    const year = res.data.date.hijri.year;
                    const date = month + " " + day + ", " + year + " AH";
                    setDate(date);
                    const prayer = getCurrentPrayer(res.data.timings);
                    setMosqueInfo({
                        prayer: res.data.timings,
                        name: 'Your Location'
                    })
                    setCurrentPrayer(prayer); 
                })
                .catch((err) => console.error(err));
    
            setIsLoading(false);
        };
    
        getTime();
    }, []);
    
    return (
        <TouchableOpacity 
            style={styles.widget} 
            onPress={handleNavigate}>
            <Image 
                source={require('../../../assets/prayerBg.png')} 
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
            {!isLoading ? (
                <View style={styles.content}>
                    <Text style={styles.mainText}> Prayer Times </Text>
                    <PrayerBar timeTillNext={time} nextPrayer={'Maghrib'} size={28} prayerAndTime={mosqueInfo.prayer} currentPrayer={currentPrayer} height={30}/>
                    <Location 
                        favMasjids={favMasjids} 
                        setMosqueInfo={setMosqueInfo}
                        setCurrPrayer={setCurrentPrayer}
                        setLoading={setIsLoading}
                        name={locationText}
                    />
                </View>
            ) : 
            <View style={styles.loading}>
                <BallIndicator color="#F2EFFB" />
            </View>}
        
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