import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import PrayerBar from '../elements/PrayerBar';
import Location from '../elements/Location';
import getCurrentPrayer from '../../functions/getCurrentPrayer';
import getLocalPrayerTimes from '../../functions/getLocalPrayerTimes';

const PrayerTimesWidget = ({ navigation, uid, favMasjids }) => {
    const [time, setTime] = useState('14 min 20 sec')
    const [prayerAndTime, setPrayerAndTime] = useState({});
    const [currentPrayer, setCurrentPrayer] = useState();

    useEffect(() => {
        const getTime = async () => {
            const data = await getLocalPrayerTimes();
            console.log(data)
            setPrayerAndTime(data.data.timings);
            const currentPrayer = getCurrentPrayer(data.data.timings);
            setCurrentPrayer(currentPrayer);
        }
        getTime();
    }, [])
    
        
    return (
        <TouchableOpacity 
            style={styles.widget} 
            onPress={() => navigation.navigate('PrayerTimes', {
                prayerAndTime: prayerAndTime, 
                currentPrayer: currentPrayer, 
                uid: uid,
            })}>
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
        <View style={styles.content}>
            <Text style={styles.mainText}> Prayer Times </Text>
            <PrayerBar timeTillNext={ time } nextPrayer={'Maghrib'} size={28} prayerAndTime={prayerAndTime} currentPrayer={currentPrayer} height={30}/>
            <Location 
                location={'Your Location'} 
                setTime={setTime} 
                uid={uid} 
                favMasjids={favMasjids} 
                setMasjidPrayerTimes={setPrayerAndTime}
                setCurrPrayer={setCurrentPrayer}
            />
        </View>
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
});