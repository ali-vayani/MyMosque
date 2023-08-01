import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

const MosqueInfo = ({ navigation, masjidId }) => {
  
  const [name, setName] = useState('')
  const [announcments, setAnnouncments] = useState('')
  let docRef;
  if (masjidId && masjidId.length > 0) {
    masjidId = masjidId.replace(/\s/g, '');
    docRef = doc(FIRESTORE_DB, "masjids ", masjidId);

  }
  useEffect(() => {
    getInfo()
  }, [])

  
  const getInfo = async () => {
    const docSnap = await getDoc(docRef);
    setName(docSnap.data()["name"])
    setAnnouncments(docSnap.data()["announcement"])
  }

  return (
    <TouchableOpacity style={styles.content} onPress={() => navigation.navigate('Mosque', {masjidId: masjidId})}>
        <Text style={styles.mainText}> { name } </Text>
        <Text style={styles.subheadingText}> Announcments </Text>
        <Text style={styles.minorText}> { announcments } </Text>
      </TouchableOpacity>
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
