import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity  } from 'react-native';
import PrayerBar from '../elements/prayerBar';
import Location from '../elements/location';
const PrayerTimesWidget = ({ navigation }) => {
  return (
    <TouchableOpacity style={styles.widget} onPress={() => navigation.navigate('PrayerTimes')}>
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
          <PrayerBar timeTillNext={'14 min 20 sec'} nextPrayer={'Maghrib'}/>
          <Location location={'Keller, TX'}/>
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
