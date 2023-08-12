import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { doc, getDoc } from "firebase/firestore";

import MosqueInfo from '../elements/mosqueInfo';

const MyMosqueWidget = ({ navigation, masjidId }) => {
  console.log(masjidId)
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
        <ScrollView style={styles.scrollContainer}>
          <View style={styles.mosqueInfoContent}>
            {masjidId && <MosqueInfo masjidId={masjidId[0]} navigation={navigation}/>}
            {masjidId && <MosqueInfo masjidId={masjidId[1]} navigation={navigation}/>}
            <MosqueInfo masjidId={undefined} navigation={navigation}/>
          </View>
        </ScrollView>
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
    zIndex: -1
  },
  scrollContainer: {
    width: '100%',
    flex: 1,
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
    minHeight: '100%',
  },
});
