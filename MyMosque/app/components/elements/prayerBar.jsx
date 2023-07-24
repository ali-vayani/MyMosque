import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrayerBar = ({nextPrayer, timeTillNext, size}) => {

    const styles = StyleSheet.create({
    content: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',   
    },
    nextPrayerText:{
        fontSize: size,
        color: '#FFF4D2', 
        fontWeight: 'bold'
    },
    timeText:{
        fontSize: 20,
        color: '#FFF4D2', 
        fontWeight: 'bold'
    },
    progressBar:{
        width: '90%',
        height: 30,
        backgroundColor: 'rgba(255, 244, 210, .5)', 
        borderRadius: 15,
    },
    progressBarDone:{
        width: '70%',
        height: '100%',
        backgroundColor: '#FFF4D2', 
        borderRadius: 15,
    },
    textArea: {
        flexDirection: 'row',
        width: '90%',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})

  return (
    <View style={styles.content}>
        <View style={styles.textArea}>
            <Text style={styles.nextPrayerText}>{nextPrayer}</Text>
            <Text style={styles.timeText}>{timeTillNext}</Text>
        </View>
        <View style={styles.progressBar}>
            <View style={styles.progressBarDone}></View>
        </View>
    </View>
  )
};





export default PrayerBar;
