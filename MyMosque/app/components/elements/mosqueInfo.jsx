import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, TouchableWithoutFeedback  } from 'react-native';
import { FIRESTORE_DB } from '../../../firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons'
import { doc, getDoc } from "firebase/firestore";

const MosqueInfo = ({ navigation, masjidId, uid }) => {
  const [name, setName] = useState('');
  const [announcements, setAnnouncements] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  let docRef;
  if (masjidId && masjidId.length > 0) {
    masjidId = masjidId.replace(/\s/g, '');
    docRef = doc(FIRESTORE_DB, "masjids", masjidId);
  }

  useEffect(() => {
    if (docRef) { // Check if docRef is defined
      getInfo();
    }
  }, [docRef]);

  const getInfo = async () => {
    if (!docRef) return;
    const docSnap = await getDoc(docRef);
    setName(docSnap.data()["name"]);
    setAnnouncements(docSnap.data()["announcment"][(docSnap.data()["announcment"].length)-1]);
  }

  if(docRef) {
    return (
      <TouchableOpacity style={styles.content} onPress={() => navigation.navigate('Mosque', {masjidId: masjidId, uid: uid})}>
        <Text style={styles.mainText}> { name } </Text>
        <Text style={styles.subheadingText}> Announcements </Text>
        <Text style={styles.minorText}> { announcements.length > 200 ? announcements.substring(0, 200) + "..." : announcements} </Text>
      </TouchableOpacity>
    );
  } else {
    return(
      <View>
        <TouchableOpacity style={styles.undefined} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-outline" color="#FFF4D2" size={32}/>
        </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={[styles.modalText, {color: '#362921'}]}>Choose an option</Text>
                <Button title="Search or Create a Mosque" onPress={() => {navigation.navigate('Map', {uid: uid}); setModalVisible(false)}} color={'#596d91'}/>
                <Button title="Close" onPress={() => setModalVisible(false)} color={'#915959'}/>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
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
    marginBottom: 5
},
minorText: {
  fontSize: 10,
  fontWeight: 'bold',
  color: '#FFF4D2',
  marginHorizontal: 3
},
    
content: {
    paddingVertical: '5%',
    paddingHorizontal: '3%',
    width: '100%',
    height: 150,
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
  height: 150,
  flexDirection: 'column',
  justifyContent: 'center',
  borderRadius: 20,    
  backgroundColor: 'rgba(255, 244, 210, .3)',
  alignItems: 'center'
  //blurRadius=100
},
centeredView: {
  flex: 1,
  justifyContent: "flex-end",
  alignItems: "center",
},
modalView: {
  margin: 20,
  backgroundColor: "#FFF4D2",
  borderRadius: 20,
  padding: 25,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 2
  },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5
},
modalText: {
  marginBottom: 15,
  textAlign: "center"
},

})



export default MosqueInfo;
