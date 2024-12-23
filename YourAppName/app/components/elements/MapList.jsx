import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { View, Text, Linking, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default MapList = ({ pageLink, directions, prayerLink, marker, onPress }) => {
    const [address, setAddress] = useState(marker.vicinity || marker.formatted_address);
    const [name, setName] = useState(marker.name);

    return (
        <TouchableOpacity style={styles.container} onPress={onPress}>
            <View style={styles.innerContainer}>
                <ScrollView
                    horizontal
                    contentContainerStyle={styles.scrollViewContent}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    <View style={styles.imagePlaceholder}></View>
                    <View style={styles.imagePlaceholder}></View>
                    <View style={styles.imagePlaceholder}></View>
                    <View style={styles.imagePlaceholder}></View>
                </ScrollView>

                <Text style={styles.nameText}>{name}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.viewPageButton}>
                        <Text style={styles.buttonText}>View Page</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.directionsButton}
                        onPress={() => {
                            const address = marker.vicinity || marker.formatted_address;
                            const url = `https://www.google.com/maps/place/${encodeURIComponent(address.replace(/\s/g, '+'))}`;
                            Linking.openURL(url);
                        }}
                    >
                        <Text style={styles.buttonText}>Directions</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.prayerTimesButton}>
                        <Text style={styles.buttonText}>Prayer Times</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '95%',
        marginVertical: 4,
        height: 192,
        backgroundColor: '#364866', // Equivalent to bg-darkBlue
        borderRadius: 20,
    },
    innerContainer: {
        height: '100%',
        marginHorizontal: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    scrollView: {
        marginTop: 8,
    },
    scrollViewContent: {
        flexDirection: 'row',
    },
    imagePlaceholder: {
        backgroundColor: 'rgba(166, 182, 209, 0.5)', // Equivalent to bg-lightBlue/50
        margin: 4,
        borderRadius: 4,
        width: 160,
    },
    nameText: {
        fontSize: 18,
        color: '#e6e8ec', // Equivalent to text-blueText
        fontWeight: 'bold',
        marginVertical: 8,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 12,
        flexDirection: 'row',
        gap: 8,
    },
    viewPageButton: {
        width: 112,
        height: 32,
        backgroundColor: '#699a51',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionsButton: {
        width: 112,
        height: 32,
        backgroundColor: '#516d9a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    prayerTimesButton: {
        width: 112,
        height: 32,
        backgroundColor: '#67519a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e6e8ec', 
        textAlign: 'center',
    },
});
