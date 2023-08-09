import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { isBrowserExtension } from '@firebase/util';
const PrayerBar = ({ timeTillNext, size, prayerAndTime}) => {
    const [nextPrayer, setNextPrayer] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [percentage, setPercentage] = useState(0);
    
    useEffect(() => {
        const now = new Date();
        
        // Find the next prayer time
        let nextPrayerIndex = prayerAndTime.findIndex(([_, time]) => {
            const [hour, min] = time.split(':').map(Number);
            return hour * 60 + min > now.getHours() * 60 + now.getMinutes();
        });

        if (nextPrayerIndex === -1) nextPrayerIndex = 0; // If no next prayer found, loop back to the first one
        // console.log(prayerAndTime)
        // console.log(nextPrayerIndex)
        // console.log(prayerAndTime[nextPrayerIndex])
        if(prayerAndTime[nextPrayerIndex])
            setNextPrayer(prayerAndTime[nextPrayerIndex][0]);

        // Calculate time remaining until the next prayer
        if(prayerAndTime[nextPrayerIndex])
        {
            console.log(prayerAndTime[nextPrayerIndex][1].replace(/[^\d:]/g, '').split(':').map(Number))
            const [hour, min] = prayerAndTime[nextPrayerIndex][1].split(':').map(Number);
            console.log(hour)
            console.log(min)
            const nextPrayerDate = new Date();
            console.log(nextPrayerDate)
            nextPrayerDate.setHours(hour);
            nextPrayerDate.setMinutes(nextPrayerDate.setHours(prayerAndTime[nextPrayerIndex][1].replace(/[^\d:]/g, '').split(':').map(Number)[1]));
            console.log(nextPrayerDate)
            const remaining = (nextPrayerDate - now) / 1000;
            setTimeRemaining(remaining);
        }


        // // Calculate the percentage value
        // const prevPrayerTime = prayerAndTime[nextPrayerIndex === 0 ? prayerAndTime.length - 1 : nextPrayerIndex - 1][1];
        // const [prevHour, prevMin] = prevPrayerTime.split(':').map(Number);
        // const prevPrayerDate = new Date();
        // prevPrayerDate.setHours(prevHour);
        // prevPrayerDate.setMinutes(prevMin);
        // const totalDuration = (nextPrayerDate - prevPrayerDate) / 1000;
        // const percentageValue = ((totalDuration - remaining) / totalDuration) * 100;
        // setPercentage(percentageValue);

        // // Update the countdown every second
        // const intervalId = setInterval(() => {
        //     setTimeRemaining(timeRemaining - 1);
        // }, 1000);

        // return () => clearInterval(intervalId); // Clear interval when component unmounts
    }, [prayerAndTime]);

    useEffect(() => {
        console.log(percentage); // This will log the updated value
      }, [percentage]);
      
    // console.log(nextPrayer)
    // console.log(timeRemaining)
    // console.log(percentage)
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
            <Text style={styles.timeText}>{timeRemaining}</Text>
        </View>
        <View style={styles.progressBar}>
            <View style={styles.progressBarDone}></View>
        </View>
    </View>
  )
};





export default PrayerBar;
