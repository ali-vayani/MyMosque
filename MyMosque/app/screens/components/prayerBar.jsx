import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrayerBar = ({nextPrayer, timeTillNext}) => {
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

const styles = StyleSheet.create({
    nextPrayerText:{
        fontSize: 24,
        color: '#FFF4D2', 
        fontWeight: 'bold'
    },
    timeText:{
        fontSize: 20,
        color: '#FFF4D2', 
        fontWeight: 'bold'
    },
    progressBar:{
        width: '100%',
        height: '13%',
        backgroundColor: 'rgba(255, 244, 210, .5)', 
        borderRadius: 15,
    },
    progressBarDone:{
        width: '70%',
        height: '100%',
        backgroundColor: '#FFF4D2', 
        borderRadius: 15,
    },
    content: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textArea: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    }

})



export default PrayerBar;
