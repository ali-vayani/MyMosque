import {View, Text, Button, StyleSheet, Image, ScrollView , KeyboardAvoidingView, Platform, TextInput} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import { FIRESTORE_DB, FIREBASE_STORAGE } from '../../firebaseConfig';
import { addDoc, collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { useState } from 'react';
import DatePicker from 'react-native-datepicker';
import * as ImagePicker from 'expo-image-picker';
import { TouchableOpacity } from 'react-native-gesture-handler';

const CreateMosque = ({navigation, route,}) => {
    const { uid, address, name } = route.params;
    const [annoucnment,   setMasjidAnnouncment] = useState('');
    const [masjidWebsite, setMasjidWebsite    ] = useState('');
    const [masjidEmail,   setMasjidEmail      ] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [prayerTimes, setPrayerTimes] = useState(["", "", "", "", ""])
    const [whatsAppInvite, setWhatsAppInvite] = useState('');
    const [facebookLink, setFacebookLink] = useState('');
    const [youTubeLink, setYouTubeLink] = useState('');
    const [image, setImage] = useState(null);

    const createMosque = async () => {
        const doc = await addDoc(collection(FIRESTORE_DB, 'masjids'), {name: name, address: address, annoucnment: annoucnment, website: masjidWebsite, email: masjidEmail, prayerTimes: prayerTimes, whatsAppInvite: whatsAppInvite, facebookLink: facebookLink, youTubeLink: youTubeLink})
        
        const storageRef = ref(FIREBASE_STORAGE, 'images/masjids/' + doc.id + "/" + Date.now())
        uploadBytes(storageRef, image).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
        setWhatsAppInvite('')
        setFacebookLink('')
        setYouTubeLink('')
        setMasjidAnnouncment('')
        setMasjidWebsite('')
        setMasjidEmail('')
        setPrayerTimes(["", "", "", "", ""])


        navigation.navigate('Mosque', {masjidId: doc.id, uid: uid})


    }

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);

            //Translates uri to blob
            const response = await fetch(result.assets[0].uri);
            const blob = await response.blob();
            console.log(blob.size, blob.type);
            //Uploads it to storage
            setImage(blob);
        }
        console.log('blob')
        console.log(image)
    };

    const handleInputChange = (index, newValue) => {
        const newPrayerTimes = [...prayerTimes];
        newPrayerTimes[index] = newValue;
        setPrayerTimes(newPrayerTimes);
    };
    const dismissKeyboard = () => {
        if(Keyboard !== undefined)
                Keyboard.dismiss();
                dismissKeyboard
    };

    return(
        <KeyboardAvoidingView  style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -500} // You may need to adjust this value
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
                    <TouchableOpacity style={styles.image} onPress={pickImage}>
                        <Text style={[styles.mainText, {position: 'absolute', top: 100, right: 100}]}> Tap To Add Image </Text>
                        <Text style={styles.mainText}>{ name }</Text>
                        <Text style={styles.minorText}> { address } </Text>
                    </TouchableOpacity>
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
                            {/* WhatsApp Input */}
                            <TextInput 
                                style={[styles.minorText, styles.input]} 
                                placeholder={"WhatsApp Invite"} 
                                placeholderTextColor={"rgba(255, 244, 210, .5)"} 
                                onChangeText={(text) => setWhatsAppInvite(text)} 
                                value={whatsAppInvite}
                            />
                            <View style={styles.divideBar}></View>

                            {/* Facebook Input */}
                            <TextInput 
                                style={[styles.minorText, styles.input]} 
                                placeholder={"Facebook Profile Link"} 
                                placeholderTextColor={"rgba(255, 244, 210, .5)"} 
                                onChangeText={(text) => setFacebookLink(text)} 
                                value={facebookLink}
                            />
                            <View style={styles.divideBar}></View>

                            {/* YouTube Input */}
                            <TextInput 
                                style={[styles.minorText, styles.input]} 
                                placeholder={"YouTube Channel Link"} 
                                placeholderTextColor={"rgba(255, 244, 210, .5)"} 
                                onChangeText={(text) => setYouTubeLink(text)} 
                                value={youTubeLink}
                            />
                            <View style={styles.divideBar}></View>
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
                    <Button title='Submit' onPress={() => createMosque()}/>
                </View>
            </ScrollView>                
        </KeyboardAvoidingView>
    )
}

export default CreateMosque;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        flex: 1,
        alignItems: 'center',
    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    content: {
        width: '100%',
        minHeight: '100%'
    },
    minorText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFF4D3',
    },
    mainText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#FFF4D2",
    },
    minorMinorText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#FFF4D2',
    },
    image: {
        width: '100%',
        height: 250,
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
        minHeight: 275,
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
        backgroundColor: 'rgb(255, 244, 210)',
        marginVertical: '7%'
    },
    info:{
        marginHorizontal: 15,
        marginVertical: 25,
        flexDirection: 'column',
    },
    input: {
        borderColor: "#FFF4D2",
        borderRadius: 10,
        borderWidth: 2,
        width: '90%',
        color: "#FFF4D2",
        paddingVertical: 3,
        paddingHorizontal: 5,
        marginVertical: 3
    },
    
})