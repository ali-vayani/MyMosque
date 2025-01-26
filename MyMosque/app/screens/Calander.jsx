import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SectionList } from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';

const Calendar = ({route}) => {
    const {masjidId, uid} = route.params;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [events, setEvents] = useState({});
    const docRef = masjidId ? doc(FIRESTORE_DB, "mosques", masjidId.replace(/\s/g, '')) : null;

    useEffect(() => {
        const getInfo = async () => {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setEvents(data.events);
            } else {
                console.log("No such document!");
            }
        }
        getInfo()
    }, [])

    const formatDate = (date) => {
        const localDate = new Date(date.getTime());
        return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
    };

    const getSectionData = () => {
        const currentDate = new Date(selectedDate);
        const sections = [];
        
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentDate);
            date.setDate(date.getDate() + i);
            const formattedDate = formatDate(date);
            const isToday = formatDate(new Date()) === formattedDate;
            
            sections.push({
                title: isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
                data: events[formattedDate] || []
            });
        }

        return sections;
    };

    const renderItem = ({ item }) => {
        return (
        <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>{item.title}</Text>
            <Text style={styles.eventTime}>{item.time}</Text>
            {item.description && <Text style={styles.eventDescription}>{item.description}</Text>}
        </View>
    )};

    const renderEmptyComponent = () => (
        <View style={styles.noEventCard}>
            <Text style={styles.noEventText}>No Events Today</Text>
        </View>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={styles.sectionHeaderContainer}>
            <Text style={styles.dateHeader}>{title}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.calendarContainer}>
                <RNCalendar
                    style={styles.calendar}
                    current={currentMonth.toISOString()}
                    onDayPress={(day) => {
                        const selectedDate = new Date(day.dateString);
                        selectedDate.setDate(selectedDate.getDate() + 1);
                        setSelectedDate(selectedDate);
                    }}
                    markedDates={{
                        [formatDate(selectedDate)]: { selected: true, selectedColor: '#67519A', backgroundColor: '#000000'},
                        ...Object.keys(events).reduce((acc, date) => ({
                        ...acc,
                        [date]: { marked: true, dotColor: '#67519A',  }
                        }), {})
                    }}
                    theme={{
                        todayTextColor: '#67519A',
                        selectedDayBackgroundColor: '#67519A',
                        arrowColor: '#67519A',
                    }}
                />
            </View>
            <View style={styles.eventsContainer}>
                <SectionList
                    sections={getSectionData()}
                    keyExtractor={(item, index) => item.id + index-1}
                    renderItem={renderItem}
                    renderSectionHeader={renderSectionHeader}
                    renderSectionFooter={({ section }) => 
                        section.data.length === 0 ? renderEmptyComponent() : null
                    }
                    style={styles.eventsList}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 40
    },
    calendarContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 10
    },
    yearText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        marginBottom: 10
    },
    calendar: {
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        paddingBottom: 10
    },
    eventsContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        marginTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20
    },
    eventsHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333'
    },
    eventsList: {
        flex: 1
    },
    eventCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    eventTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333'
    },
    eventTime: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    eventDescription: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    dayEventsContainer: {
        marginBottom: 20
    },
    dateHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    noEventCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2
    },
    noEventText: {
        fontSize: 16,
        color: '#666'
    }, 
    sectionHeaderContainer: {
        backgroundColor: '#f5f5f5',
        marginBottom: 5
    }
});

export default Calendar;