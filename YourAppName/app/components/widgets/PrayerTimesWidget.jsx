import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import PrayerBar from '../elements/PrayerBar';
import Location from '../elements/Location';
import getCurrentPrayer from '../../functions/getCurrentPrayer';
import * as LocationExpo from 'expo-location';
import getLocalPrayerTimes from '../../functions/getLocalPrayerTimes';

const PrayerTimesWidget = ({ navigation, uid }) => {
    const [time, setTime] = useState('14 min 20 sec')
    const [prayerAndTime, setPrayerAndTime] = useState({});
    const [currentPrayer, setCurrentPrayer] = useState();

    useEffect(() => {
        getUserLocation();
    }, [])

    const getUserLocation = async () => {
        let { status } = await LocationExpo.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access location was denied');
            return;
        }
        let currentPosition = await LocationExpo.getCurrentPositionAsync({ accuracy: LocationExpo.Accuracy.High });
        const { latitude, longitude } = currentPosition.coords;
        getCityName(latitude, longitude).then(location => {
            getLocalPrayerTimes(location.city, location.country)
            .then(data => {
                setPrayerAndTime(data.data.timings);
                const currentPrayer = getCurrentPrayer(data.data.timings);
                setCurrentPrayer(currentPrayer);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        });
        
    }

    const getCityName = (lat, lng) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
        return fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.address && data.address.city) {
                    return data.address;
                } else {
                    console.log("City not found.");
                    return null;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return null;
            });
    }
    
        
    return (
        <TouchableOpacity style={styles.widget} onPress={() => navigation.navigate('PrayerTimes', {prayerAndTime: prayerAndTime, currentPrayer: currentPrayer, uid: uid})}>
        {/* <View style={{backgroundImage: require('C:/Users/aliva/Desktop/MyMosquefr/MyMosque/assets/images/1.jpg'), position: 'absolute', top: 0, bottom: 0, left:0, right:0, borderRadius: 41.5}} /> */}
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
            {/* <Location location={'Keller, TX'} setTime={setTime} uid={uid}/> */}
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
        position: 'relative', // Add position relative to contain absolute-positioned dots
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