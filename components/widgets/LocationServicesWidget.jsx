import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const LocationServicesWidget = ({ onLocationEnabled }) => {
    const handleEnableLocation = async () => {
        try {
            let { status } = await Location.getForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                status = (await Location.requestForegroundPermissionsAsync()).status;
            }

            if (status === 'granted') {
                onLocationEnabled && onLocationEnabled();
            }
        } catch (error) {
            console.error('Error requesting location permission:', error);
        }
    };

    return (
        <View style={styles.widget}>
            <Image 
                source={require('../../assets/prayerBg.png')} 
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 41.5,
                    opacity: .2,
                }}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.mainText}>Enable Location</Text>
                    <Ionicons name="location-outline" size={32} color={'#EBFEEA'}/>
                </View>
                <Text style={styles.descriptionText}>
                    To show you accurate prayer times and nearby mosques, we need access to your location.
                </Text>
                <TouchableOpacity 
                    style={styles.enableButton}
                    onPress={handleEnableLocation}
                >
                    <Text style={styles.buttonText}>Enable Location Services</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default LocationServicesWidget;

const styles = StyleSheet.create({
    widget: {
        width: '97%',
        height: '30%',
        backgroundColor: '#67519A',
        borderRadius: 41.5,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    mainText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#F2EFFB',
        marginTop: 10,
    },
    content: {
        paddingTop: '10%',
        paddingBottom: '5%',
        width: '90%',
        height: '100%',
        justifyContent: 'space-between',
    },
    header: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row'
    },
    descriptionText: {
        fontSize: 16,
        color: '#F2EFFB',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    enableButton: {
        backgroundColor: '#443666',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
        alignSelf: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#F2EFFB',
        fontSize: 16,
        fontWeight: 'bold',
    }
});