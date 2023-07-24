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
  fontSize: 24,
  fontWeight: 'bold',
  color: '#FFF4D2',
  paddingVertical: '3%'
},
subheadingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF4D2',
},
minorText: {
  fontSize: 10,
  fontWeight: 'bold',
  color: '#FFF4D2',
},
    
content: {
    paddingVertical: '5%',
    paddingHorizontal: '3%',
    width: '100%',
    height: '33%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: 20,    
    backgroundColor: 'black',
    //blurRadius=100
},

})



export default MosqueInfo;
