import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { isBrowserExtension } from '@firebase/util';
const PrayerBar = ({ timeTillNext, size, prayerAndTime, height,}) => {
    const [nextPrayer, setNextPrayer] = useState('');
    const [timeRemaining, setTimeRemaining] = useState('');
    const [percentage, setPercentage] = useState(0);
    let nextPrayerDate;
    let differenceInMilliseconds;
    let differenceInHours;
    let differenceInMinutes;
    
    useEffect(() => {
        const chatGPTWantsThisFunctionSoYea = () => {
            const now = new Date();
            // Find the next prayer time
            let nextPrayerIndex = prayerAndTime.findIndex(([_, time]) => {
                const [hour, min] = time.replace(/[^\d:]/g, '').split(':').map(Number);
                return hour * 60 + min > now.getHours() * 60 + now.getMinutes();
            });
            nextPrayerIndex--;

            if (nextPrayerIndex === -2) 
                nextPrayerIndex = 6; // If no next prayer found, loop back to the first one
            if(prayerAndTime[nextPrayerIndex])
                setNextPrayer(prayerAndTime[nextPrayerIndex][0]);
                nextPrayerIndex++;
                if(nextPrayerIndex === 7)
                    nextPrayerIndex = 0;
            // Calculate time remaining until the next prayer
            if(prayerAndTime[nextPrayerIndex])
            {
                if(nextPrayerIndex !== 0)
                {
                    const [hour, min] = prayerAndTime[nextPrayerIndex][1].replace(/[^\d:]/g, '').split(':').map(Number);
                    nextPrayerDate = new Date();
                    nextPrayerDate.setMinutes(min);
                    nextPrayerDate.setHours(hour);
                    differenceInMilliseconds = (nextPrayerDate - now);
                    differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
                    differenceInMinutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                }
                else{
                    const [hour, min] = prayerAndTime[nextPrayerIndex][1].replace(/[^\d:]/g, '').split(':').map(Number);
                    nextPrayerDate = new Date();
                    nextPrayerDate.setMinutes(min);
                    nextPrayerDate.setHours(hour);
                    let iWroteBadCode = new Date();
                    iWroteBadCode.setMinutes(59);
                    iWroteBadCode.setHours(23);
                    iWroteBadCode.setSeconds(59);
                    differenceInMilliseconds = ((iWroteBadCode - now) + (((nextPrayerDate.getHours() * 60 * 1000)) + (nextPrayerDate.getMinutes() * 1000)));
                    differenceInHours = Math.floor(differenceInMilliseconds / (1000 * 60 * 60));
                    differenceInMinutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
                }
                let resultString = "";
                if (differenceInHours > 0) {
                    resultString += differenceInHours + (differenceInHours > 1 ? " hr" : " hr");
                }
                if (differenceInMinutes > 0) {
                    if (resultString.length > 0) {
                    resultString += ", ";
                }
                    resultString += differenceInMinutes + (differenceInMinutes > 1 ? " min left" : " min left");
                }
                setTimeRemaining(resultString);
                
            }

            if(prayerAndTime[nextPrayerIndex+1] || prayerAndTime[nextPrayerIndex-1])
            {
                if(nextPrayerIndex !== 0)
                {
                    let lastPrayerIndex = nextPrayerIndex-1;
                    const [hour, min] = prayerAndTime[lastPrayerIndex][1].replace(/[^\d:]/g, '').split(':').map(Number);
                    let lastPrayerTime = new Date();
                    lastPrayerTime.setMinutes(min)
                    lastPrayerTime.setHours(hour)
                    let currentDate = new Date();
                    //current time - last prayer time / next prayer time - last prayer time
                    setPercentage(((currentDate.getHours()* 60 + (currentDate.getMinutes())) -  (lastPrayerTime.getHours()* 60 + (lastPrayerTime.getMinutes()))) / ((nextPrayerDate.getHours()* 60 + (nextPrayerDate.getMinutes())) - (lastPrayerTime.getHours()* 60 + (lastPrayerTime.getMinutes()))));
                }
                else{
                    let lastPrayerIndex = 6;
                    nextPrayerIndex = 0;
                    const [hour, min] = prayerAndTime[lastPrayerIndex][1].replace(/[^\d:]/g, '').split(':').map(Number);
                    let lastPrayerTime = new Date();
                    lastPrayerTime.setMinutes(min)
                    lastPrayerTime.setHours(24-hour)
                    let currentDate = new Date();
                    //current time - last prayer time / next prayer time - last prayer time
                    setPercentage(
                        ((currentDate.getHours()* 60 + (currentDate.getMinutes())) -  (24-(lastPrayerTime.getHours()))* 60 + (lastPrayerTime.getMinutes())) 
                        / 
                        ((nextPrayerDate.getHours()* 60 + (nextPrayerDate.getMinutes())) + (lastPrayerTime.getHours()* 60 + (lastPrayerTime.getMinutes()))));
                }
                if(percentage < .14)
                    setPercentage(.14)
            }
        };

        chatGPTWantsThisFunctionSoYea();
        const intervalId = setInterval(chatGPTWantsThisFunctionSoYea, 30000);
        return () => clearInterval(intervalId);
    }, [prayerAndTime]);

    const styles = StyleSheet.create({
    content: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',   
    },
    nextPrayerText:{
        fontSize: size,
        color: '#F2EFFB', 
        fontWeight: 'bold',
    },
    timeText:{
        fontSize: 20,
        color: '#F2EFFB', 
        fontWeight: 'bold'
    },
    progressBar:{
        width: '90%',
        height: height,
        backgroundColor: 'rgba(242, 239, 251, .5)', 
        borderRadius: 15,
    },
    progressBarDone:{
        width: `${percentage*100}%`,
        height: '100%',
        backgroundColor: '#F2EFFB', 
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