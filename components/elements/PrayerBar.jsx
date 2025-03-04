import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const PrayerBar = ({ prayerAndTime, size, currentPrayer, height }) => {
    const [intervalId, setIntervalId] = useState(null);
    const [timeData, setTimeData] = useState({
        timeBetween: 0,
        timeTillNext: '',
        percentage: 0,
    });

    const prayerKey = useMemo(() => new Map([
        ['Fajr', 'Dhuhr'],
        ['Dhuhr', 'Asr'],
        ['Asr', 'Maghrib'],
        ['Maghrib', 'Isha'],
        ['Isha', 'Fajr']
    ]), []);

    const toMin = (time) => {
        const [hour, minute] = time.split(':').map(Number);
        return hour * 60 + minute;
    };

    const getPercentage = (currPrayerTime, nextPrayerTime, currentTimeInMinutes) => {
        if (currentPrayer !== 'Isha') {
            return (currentTimeInMinutes - currPrayerTime) / (nextPrayerTime - currPrayerTime);
        } else {
            const midnight = 24 * 60;
            const ishaToMidnight = midnight - currPrayerTime;
            const timeBetween = ishaToMidnight + nextPrayerTime;
            if(currentTimeInMinutes > 720)
                return (currentTimeInMinutes - currPrayerTime) / timeBetween;
            else
                return (ishaToMidnight + currentTimeInMinutes) / timeBetween;
        }
    };

    const calculateRemaining = (percentage, timeBetween) => {
        const timeInMin = (1 - percentage) * timeBetween;
        return formatTime(timeInMin);
    };

    const formatTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = Math.round(minutes % 60);

        if (hours > 0) {
            return `${hours} hr${hours > 1 ? 's' : ''}, ${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
        } else {
            return `${remainingMinutes} min${remainingMinutes > 1 ? 's' : ''}`;
        }
    };

    useEffect(() => {
        if (!prayerAndTime || !currentPrayer) return;

        const updateTimeData = () => {
            const currPrayerTime = toMin(prayerAndTime[currentPrayer]);
            const nextPrayerTime = toMin(prayerAndTime[prayerKey.get(currentPrayer)]);
            const now = new Date();
            const currentHour = now.getHours();
            const currentMinute = now.getMinutes();
            const currentTimeInMinutes = currentHour * 60 + currentMinute;

            const timeBetween = currentPrayer !== 'Isha'
                ? nextPrayerTime - currPrayerTime
                : (24 * 60 - currPrayerTime) + nextPrayerTime;

            let percentage = getPercentage(currPrayerTime, nextPrayerTime, currentTimeInMinutes);
            const timeTillNext = calculateRemaining(percentage, timeBetween);

            if(percentage < .1)
                percentage = .1;
            setTimeData({
                timeBetween,
                timeTillNext,
                percentage,
            });
        };

        // Initial update
        updateTimeData();

        // Calculate time until next minute
        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

        // Set up initial timeout to sync with minute boundary
        const initialTimeout = setTimeout(() => {
            updateTimeData();
            // Then set up interval to update every minute
            const intervalId = setInterval(updateTimeData, 60000);
            // Store interval ID for cleanup
            setIntervalId(intervalId);
        }, msUntilNextMinute);

        // Cleanup function
        return () => {
            clearTimeout(initialTimeout);
            if (intervalId) clearInterval(intervalId);
        };
    }, [prayerAndTime, currentPrayer]);

    const styles = StyleSheet.create({
        content: {
            width: '100%',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        },
        nextPrayerText: {
            fontSize: size,
            color: '#F2EFFB',
            fontWeight: 'bold',
        },
        timeText: {
            fontSize: 20,
            color: '#F2EFFB',
            fontWeight: 'bold'
        },
        progressBar: {
            width: '90%',
            height: height,
            backgroundColor: 'rgba(242, 239, 251, .5)',
            borderRadius: 15,
            marginVertical: 5
        },
        progressBarDone: {
            width: `${timeData.percentage * 100}%`,
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
    });

    return (
        <View style={styles.content}>
            <View style={styles.textArea}>
                <Text style={styles.nextPrayerText}>{prayerKey.get(currentPrayer)}</Text>
                <Text style={styles.timeText}>{timeData.timeTillNext}</Text>
            </View>
            <View style={styles.progressBar}>
                <View style={styles.progressBarDone}></View>
            </View>
        </View>
    );
};

export default PrayerBar;
