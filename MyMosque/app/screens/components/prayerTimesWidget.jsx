import React from 'react';
import { View, Text, StyleSheet, Image  } from 'react-native';
import PrayerBar from './prayerBar';
import { Dimensions } from 'react-native';

let widgetHeight = Dimensions.get('window').height*.32;
let widgetWidth = Dimensions.get('window').width*.95;
const existingDots = new Set();
let topVal;
let leftVal;
const PrayerTimesWidget = ({ navigation }) => {
  return (
    <View style={styles.widget}>
      {/* <View style={{backgroundImage: require('C:/Users/aliva/Desktop/MyMosquefr/MyMosque/assets/images/1.jpg'), position: 'absolute', top: 0, bottom: 0, left:0, right:0, borderRadius: 41.5}} /> */}
      <Image 
        source={require('C:/Users/aliva/Desktop/MyMosquefr/MyMosque/assets/images/Random3.png')} 
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
        
      </View>
    </View>
  );
};

export default PrayerTimesWidget;

const styles = StyleSheet.create({
  widget: {
    width: '97%',
    height: '33%',
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
    marginVertical: '15%',
    width: '90%',
  },
  dot: {
    position: 'absolute',
    backgroundColor:'white',
    opacity: .1,
    width: 5,
    height: 5,
    borderRadius: 3,
  },
});
