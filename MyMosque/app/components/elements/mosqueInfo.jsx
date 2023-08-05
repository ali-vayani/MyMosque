import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons'
import { doc, getDoc } from "firebase/firestore";

const MosqueInfo = ({ navigation, masjidId }) => {

  const [name, setName] = useState('')
  const [announcments, setAnnouncments] = useState('')
  let docRef;
  if (masjidId && masjidId.length > 0) {
    masjidId = masjidId.replace(/\s/g, '');
    docRef = doc(FIRESTORE_DB, "masjids", masjidId);
  }

  useEffect(() => {
    getInfo()
  }, [])

  
  const getInfo = async () => {
    const docSnap = await getDoc(docRef);
    setName(docSnap.data()["name"])
    setAnnouncments(docSnap.data()["announcement"])
  }
  //docRef will be initialized if masjidId isn't unfined. If docRef is a thing then it displays masjid otherwise it displays add.
  if(docRef)
  {

    return (
        <TouchableOpacity style={styles.content} onPress={() => navigation.navigate('Mosque', {masjidId: masjidId})}>
          <Text style={styles.mainText}> { name } </Text>
          <Text style={styles.subheadingText}> Announcments </Text>
          <Text style={styles.minorText}> { announcments } </Text>
        </TouchableOpacity>
      )
  } else {
    return(
        <TouchableOpacity style={styles.undefined} onPress={() => console.log("Idek")}>
          <Ionicons name="add-outline" color="#FFF4D2" size={32}/>
        </TouchableOpacity>
    )
  }
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
undefined: {
  paddingVertical: '5%',
  paddingHorizontal: '3%',
  width: '100%',
  height: '33%',
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: 20,    
  backgroundColor: 'rgba(255, 244, 210, .3)',
  alignItems: 'center'
  //blurRadius=100
},

})



export default MosqueInfo;
