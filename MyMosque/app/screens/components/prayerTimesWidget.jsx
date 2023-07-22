import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Dot from './dot';
import { Dimensions } from 'react-native';
import { useState } from 'react'

let topVal;
let leftVal;
const [dot, setDot] = useState([])
// function dotSetter()
// {
//     setDot(prevState => [])
// }
const PrayerTimesWidget = ({ navigation }) => {
  return (
    <View style={styles.widget}>
      <View style={styles.content}>
        <Text style={styles.mainText}> Prayer Times </Text>
      </View>
      {
        Array.from({length: 200}, (_, i) => {
            console.log(i)
            topVal = Math.random() * Dimensions.get('window').height*.33;
            leftVal = Math.random() * Dimensions.get('window').width*.97;
            console.log(topVal)
            console.log(leftVal)
            console.log(i)
            return <Dot key={i} style={styles.dot} /> 
        })
      }
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
    marginVertical: '10%',
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'white',
    width: 5,
    height: 5,
    borderRadius: 3,
    top: topVal, // Replace 'container height here' with the height of the widget container
    left: leftVal
    , // Replace 'container width here' with the width of the widget container
  },
});
