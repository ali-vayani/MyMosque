import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Calander ({ startDate, endDate })  {
    const generateDates = () => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dates = [19, 20, 21, 22, 23, 24, 25];
        
        return days.map((day, index) => ({
        day,
        date: dates[index],
        events: index % 2 === 0 ? 1 : 2 
        }));
    };

    const calendar = generateDates();

    const EventBox = () => (
        <View style={styles.eventBox}>
            <Text style={styles.eventText}>Event</Text>
            <Text style={styles.eventTimeText}>7:30pm</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>Nueces Mosque Calendar</Text>
            <Text style={styles.dateRange}>1/19 - 1/25</Text>
        </View>

        {calendar.map((item, index) => (
            <View key={index} style={styles.dayContainer}>
            <View style={styles.dateHeader}>
                <Text style={styles.dateText}>
                {item.day}. Jan {item.date}th
                </Text>
            </View>
            
            <View style={styles.eventsContainer}>
                <EventBox />
                {item.events === 2 && <EventBox />}
            </View>
            </View>
        ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateRange: {
        fontSize: 16,
        color: '#666',
    },
    dayContainer: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    dateHeader: {
        backgroundColor: '#e8f5e9',
        padding: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    dateText: {
        fontSize: 16,
        fontWeight: '500',
    },
    eventsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    eventBox: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 12,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    eventText: {
        fontSize: 14,
        fontWeight: '500',
    },
    eventTimeText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
});