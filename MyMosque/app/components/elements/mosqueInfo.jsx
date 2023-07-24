import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MosqueInfo = ({ imgPath, mosque, announcment }) => {
  return (
    <View style={styles.content}>
        <Text style={styles.mainText}> { mosque } </Text>
        <Text style={styles.subheadingText}> Announcments </Text>
        <Text style={styles.minorText}> { announcment } </Text>
      </View>
    )
};

const styles = StyleSheet.create({
mainText: {
  fontSize: 32,
  fontWeight: 'bold',
  color: '#FFF4D2',
  paddingVertical: '2%'
},
subheadingText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFF4D2',
},
minorText: {
  fontSize: 12,
  fontWeight: 'bold',
  color: '#FFF4D2',
},
    
content: {
    paddingVertical: '5%',
    width: '90%',
    height: '30%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 20,    
    backgroundColor: 'black',
    //blurRadius=100
},

})



export default MosqueInfo;
