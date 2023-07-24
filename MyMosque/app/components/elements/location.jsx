import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Location = ({location}) => {
  return (
    <TouchableOpacity style={styles.content}>
        <Ionicons name="navigate-outline" size={25} color={'#FFF4D2'}/>
        <Text style={styles.locationText}>{location}</Text>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
    locationText:{
        fontSize: 20,
        color: '#FFF4D2', 
        marginHorizontal: '1%'
    },    
    content: {
        alignItems: 'center',
        flexDirection: 'row',
    },
})



export default Location;
