import {View, Text, Button, StyleSheet, Image, ImageBackground, FlatList, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";

const Mosque = ({navigation, route}) => {
    const { masjidId } = route.params;
    const [name, setName] = useState('');
    const [announcments, setAnnouncments] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    let docRef = doc(FIRESTORE_DB, "masjids ", masjidId);
    console.log(masjidId)

    useEffect(() => {
        getInfo()
    }, [])

    
    const getInfo = async () => {
        const docSnap = await getDoc(docRef);
        setName(docSnap.data()["name"])
        setAnnouncments(docSnap.data()["announcement"])
        setAddress(docSnap.data()["address "])
        setWebsite(docSnap.data()["website"])
    }

    return(
        <View style={styles.page}>
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
            <View style={styles.content}>
                <View style={styles.image}>
                    <Text style={styles.mainText}>{ name }</Text>
                    <Text style={styles.minorText}> { address } </Text>
                </View>
                <View style={styles.contentBlock}>
                    <Text style={styles.mainText}> Announcments </Text>
                    <View style={styles.announcmentInfo}>
                        <View style={styles.userIcon}></View> 
                        <View style={styles.userInfo}>
                            <Text style={styles.minorText}>Name</Text>
                            <Text style={styles.minorMinorText}>July 20th</Text>
                        </View>
                    </View>
                        <Text style={styles.minorText}>{ announcments }</Text>
                </View>

                <View style={styles.contentBlock}>
                    <Text style={styles.mainText}>Info</Text>
                    <View style={styles.info}>
                        <Text style={styles.minorText}>{ website }</Text>
                        <View style={styles.divideBar}></View>

                        <Text style={styles.minorText}>{ website }</Text>
                        <View style={styles.divideBar}></View>

                        <Text style={styles.minorText}>{ website }</Text>
                    </View>
                </View>
            </View>

        </View>
    )
}

export default Mosque;

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

    }
    
})