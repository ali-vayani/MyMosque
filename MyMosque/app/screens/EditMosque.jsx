import {View, Text, Button, StyleSheet, Image, ImageBackground, FlatList, TouchableOpacity, Modal, ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import ViewPager from '@react-native-community/viewpager';

const EditMosque = ({navigation, route}) => {
    let { masjidId } = route.params;
    console.log(uid)
    const [name, setName] = useState('');
    const [announcments, setAnnouncments] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [isFavorite, setFavorite] = useState(false)
    const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
    const [allAnnouncements, setAllAnnouncements] = useState([]);
    let docRef = doc(FIRESTORE_DB, "masjids", masjidId.replace(/\s/g, ''));

    useEffect(() => {
        getInfo()
    }, []);

    const editMosque = async () => {
        const doc = await addDoc(collection(FIRESTORE_DB, 'masjids'), {name: masjidName, address: masjidAddress, annoucnment: annoucnment, website: masjidWebsite, email: masjidEmail, prayerTimes: prayerTimes})
        setMasjidName('')
        setMasjidAddress('')
        setMasjidAnnouncment('')
        setMasjidWebsite('')
        setMasjidEmail('')
        setPrayerTimes(["", "", "", "", ""])
        navigation.navigate('Mosque', {masjidId: doc.id, uid: uid})
    }

    const getInfo = async () => {
        const docSnap = await getDoc(docRef);
        setName(docSnap.data()["name"])
        setAnnouncments(docSnap.data()["announcment"][docSnap.data()["announcment"].length-1])
        setAllAnnouncements(docSnap.data()["announcment"]);
        setAddress(docSnap.data()["address"])
        setWebsite(docSnap.data()["website"])
    }
    
    return (
        <KeyboardAvoidingView  style={styles.page}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500}
        >
            <LinearGradient colors={['#679159', '#A79A84']} style={styles.background}/>
            <Image 
            source={require('../../assets/images/Random3.png')} 
            style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 41.5,
            opacity: .1,
            }}/>
            <ScrollView style={{width: '100%', flex: 1,}}>
                <View style={styles.content}>
                    <View style={styles.image}>
                        <TextInput style={[styles.mainText, styles.input]} placeholder={"Masjid Name"} placeholderTextColor={"rgba(255, 244, 210, .5)"} onChangeText={(text) => setMasjidName(text)} value={masjidName}/>
                        <TextInput style={[styles.minorText, styles.input]} placeholder={"Address"} placeholderTextColor={"rgba(255, 244, 210, .5)"} onChangeText={(text) => setMasjidAddress(text)} value={masjidAddress}/>
                    </View>
                    <View style={styles.contentBlock}>
                        <Text style={styles.mainText}>Announcments</Text>
                        <View style={styles.announcmentInfo}>
                            <View style={styles.userIcon}></View> 
                            <View style={styles.userInfo}>
                                <Text style={styles.minorText}>Name</Text>
                                <Text style={styles.minorMinorText}>July 20th</Text>
                            </View>
                        </View>
                        <TextInput style={[styles.minorText, styles.input]} placeholder={"Create Announcement (Optional)"} placeholderTextColor={"rgba(255, 244, 210, .5)"} onChangeText={(text) => setMasjidAnnouncment(text)} value={annoucnment}/>
                    </View>

                    <View style={styles.contentBlock}>
                        <Text style={styles.mainText}>Info</Text>
                        <View style={styles.info}>
                            <TextInput style={[styles.minorText, styles.input]} placeholder={"Website Link"} placeholderTextColor={"rgba(255, 244, 210, .5)"} onChangeText={(text) => setMasjidWebsite(text)} value={masjidWebsite}/>
                            <View style={styles.divideBar}></View>

                            <TextInput style={[styles.minorText, styles.input]} placeholder={"Contact Email"} placeholderTextColor={"rgba(255, 244, 210, .5)"} onChangeText={(text) => setMasjidEmail(text)} value={masjidEmail}/>
                            <View style={styles.divideBar}></View>
                            <Text style={styles.minorText}>Website: wataugamasjid.com</Text>
                        </View>

                        
                    </View>
                    <View style={styles.contentBlock}>
                            <Text style={styles.mainText}>Prayer Times</Text>

                            <DatePicker
                                style={{ width: 200 }}
                                date={selectedDate}
                                mode="date"
                                placeholder="Select Date"
                                format="YYYY-MM-DD"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => setSelectedDate(date)}
                        
                            />

                            {["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"].map((prayer, index) => (
                                <TextInput
                                    key={index}
                                    style={[styles.minorText, styles.input]}
                                    placeholder={prayer + " prayer time"}
                                    placeholderTextColor={"rgba(255, 244, 210, .5)"}
                                    value={prayerTimes[index]}
                                    onChangeText={(text) => handleInputChange(index, text)}
                                    onSubmitEditing={dismissKeyboard && console.log(prayerTimes)}
                                />
                            ))}

                        </View>
                    <Button title='Submit' onPress={() => editMosque()}/>
                </View>
            </ScrollView>                
        </KeyboardAvoidingView>
    )
}

export default EditMosque;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    content: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        flexDirection: 'column'
    },
    minorText: {
        fontSize: 14,
        fontWeight: 500,
        color: '#FFF4D3',
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF4D2',
    },
    minorMinorText: {
        fontSize: 10,
        fontWeight: 500,
        color: '#FFF4D2',
    },
    image: {
        width: '100%',
        height: '25%',
        flexDirection: 'column',
        backgroundColor: 'black',
        justifyContent: 'flex-end',
        paddingBottom: 15,
        paddingLeft: 10,
        marginBottom: 25,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 10
    },
    contentBlock:{
        width: '100%',
        height: '27%',
        backgroundColor: 'rgba(255, 244, 210, .1)',
        flexDirection: 'column',
        marginBottom: 20,
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    userIcon: {
        backgroundColor: 'rgb(255, 244, 210)',
        borderRadius: 35,
        width: 35,
        height: 35, 
    },
    userInfo: {
        flexDirection: 'column',
        width: '15%',
        height: 35,
        //justifyContent:'center',
        marginHorizontal: 5,
    },
    announcmentInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,    
    },
    divideBar:{
        height: 1,
        wdith: '90%',
        backgroundColor: 'rgb(255, 244, 210)',
        marginVertical: '7%'
    },
    info:{
        marginHorizontal: 15,
        marginVertical: 25,
        flexDirection: 'column',
    },
    star: {
        position: 'absolute',
        top: 40,
        right: 10,  
        zIndex: 10,
        padding: 10,
    }, 
    imageBg: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        borderRadius: 41.5,
        opacity: .1,
    },
    modal:{
        width: '90%', 
        height: '70%', 
        backgroundColor: '#679159', 
        borderRadius: 10, 
        padding: 10,
        
    }
    
})