import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Location = ({ setTime }) => {
  const [isOpen, setIsOpen] = useState(false);
  const locations = ["Location 1", "Location 2", "Location 3"]; // Sample list of locations
  const [text, setText] = useState('')
  useEffect(() => {
    setText('Keller, TX')
  }, [])

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.content} onPress={() => setIsOpen(!isOpen)}>
          <Ionicons name="navigate-outline" size={25} color={'#FFF4D2'}/>
          <Text style={styles.locationText}>{text}</Text>
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={locations}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.listItem} onPress={() => {
                setText(item)
                setTime('13 min 20 sec')
                setIsOpen(false);
                // Handle item selection here
              }}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    wrapper: {
        zIndex: 10,
    },
    locationText: {
        fontSize: 20,
        color: '#FFF4D2', 
        marginHorizontal: '1%'
    },    
    content: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    dropdownContainer: {
        position: 'absolute',
        top: 35, // Adjust based on the size of the icon and text
        left: 0,
        right: 0,
        backgroundColor: 'rgb(103, 81, 154)',
        borderRadius: 5,
        elevation: 5, // For shadow on Android
        shadowColor: '#000', // For shadow on iOS
        shadowOffset: { width: 0, height: 5 }, // For shadow on iOS
        shadowOpacity: 0.3, // For shadow on iOS
        shadowRadius: 5, // For shadow on iOS
        width: 150,
        paddingVertical: 3
    },
    listItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#FFF4D2',
    },
    dropdownText: {
        fontSize: 18,
        color: '#FFF4D2',
        padding: 10,
    }
});

export default Location;
