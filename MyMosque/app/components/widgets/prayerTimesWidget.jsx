import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import PrayerBar from '../elements/prayerBar';
import Location from '../elements/location';
import * as LocationExpo from 'expo-location';

const PrayerTimesWidget = ({ navigation, uid }) => {
  const [time, setTime] = useState('14 min 20 sec')
  const [prayerAndTime, setPrayerAndTime] = useState([]);
  const [militaryPrayerAndTime, setMilitaryPrayerAndTime] = useState([])
    // useEffect(() => {
    //     getPrayerTimes(32.508515, -97.1254872, 8, 2023, 2);
    // }, [])

    useEffect(() => {
      ///setMarkers([])
      (async () => {
          let { status } = await LocationExpo.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Permission to access location was denied');
          return;
      }

      let currentPosition = await LocationExpo.getCurrentPositionAsync({ accuracy: LocationExpo.Accuracy.High });
      const { latitude, longitude } = currentPosition.coords;
      let date = new Date()
      getPrayerTimes(latitude, longitude, date.getMonth()+1, 2023, 2);

      })();
  }, []);
    


    //Useas the prayer time api to get prayer times based off of lat and lon
    const getPrayerTimes = async (latitude, longitude, month, year, method) => {
      const url = `http://api.aladhan.com/v1/calendar/${year}/${month}`;
      const params = {
        latitude: latitude,
        longitude: longitude,
        method: method,
      };
      const queryString = Object.keys(params)
        .map(key => key + '=' + params[key])
        .join('&');
      try {
        const response = await fetch(url + '?' + queryString);
        const data = await response.json();
        const timings = data['data'][0]['timings'];
        //translates the prayer times into the correct format and sets the prayer time
        setMilitaryPrayerAndTime(Object.entries(timings)
        .slice(0, 7).map(([key, value]) => {
          const militaryTime = value.replace(' (CDT)', '');
          return [key, militaryTime]
        }));
        setPrayerAndTime(Object.entries(timings)
          .slice(0, 7)
          .map(([key, value]) => {
            const militaryTime = value.replace(' (CDT)', '');
            const [hours, minutes] = militaryTime.split(':');
            const date = new Date();
            date.setHours(+hours);
            date.setMinutes(+minutes);
            let standardTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
            standardTime = standardTime.replace(/^0+/, ''); // removes leading zero
            return [key, standardTime];
          }));
      } catch (error) {
        console.error(error);
      }
    }
    
  return (
    <TouchableOpacity style={styles.widget} onPress={() => navigation.navigate('PrayerTimes', {prayerAndTime: prayerAndTime, militaryPrayerAndTime: militaryPrayerAndTime, uid: uid})}>
      {/* <View style={{backgroundImage: require('C:/Users/aliva/Desktop/MyMosquefr/MyMosque/assets/images/1.jpg'), position: 'absolute', top: 0, bottom: 0, left:0, right:0, borderRadius: 41.5}} /> */}
      <Image 
        source={require('../../../assets/images/Random3.png')} 
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: 41.5,
          opacity: .1,
        }}
      />
      <View style={styles.content}>
        <Text style={styles.mainText}> Prayer Times </Text>
          <PrayerBar timeTillNext={ time } nextPrayer={'Maghrib'} size={28} prayerAndTime={militaryPrayerAndTime}/>
          <Location location={'Keller, TX'} setTime={setTime} uid={uid}/>
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
    color: '#FFF4D2',
  },
  content: {
    paddingTop: '10%',
    paddingBottom: '5%',
    width: '90%',
    height: '100%',
    justifyContent: 'space-between',
  },
});
