import React from 'react';
import { View, Text, StyleSheet, Image  } from 'react-native';
import MosqueInfo from '../elements/mosqueInfo';
const MyMosqueWidget = ({ navigation }) => {
  return (
    <View style={styles.widget}>
      <Image 
        source={require('../../../assets/images/Random3.png')} 
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          borderRadius: 41.5,
          opacity: .1,
        }}
      />
      <View style={styles.content}>
        <Text style={styles.mainText}>My Mosques</Text>
        <View style={styles.mosqueInfoContent}>
          <MosqueInfo mosque={'Watauga Masjid'} announcment={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...'}/>
          <MosqueInfo mosque={'Watauga Masjid'} announcment={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...'}/>
        </View>
      </View>
    </View>
  );
};

export default MyMosqueWidget;

const styles = StyleSheet.create({
  widget: {
    width: '97%',
    height: '56%',
    backgroundColor: '#679159',
    borderRadius: 41.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF4D2',
  },
  content: {
    paddingTop: '10%',
    paddingBottom: '5%',
    width: '90%',
    height: '100%',
    gap: 35
  },
  mosqueInfoContent: {
    gap: 15,
    width: '100%',
    height: '100%'
  }
});
