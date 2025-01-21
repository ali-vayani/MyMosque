import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, Button, StyleSheet, Image, Linking, TouchableOpacity, ScrollView} from 'react-native'
import Post from '../components/elements/Post';
import { doc, getDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../firebaseConfig';
import convertMilitaryTime from '../functions/convertMilitaryTime';
import getMosquePrayerTimes from '../functions/getMosquePrayerTimes';
import { BallIndicator } from 'react-native-indicators';

const MosquePage = ({navigation, route}) => {
    const {masjidId, uid} = route.params;
    const [posts, setPosts] = useState();
    const [name, setName] = useState("Nueces Mosque");
    const [bio, setBio] = useState();
    const [members, setMembers] = useState();
    const [address, setAddress] = useState();
    const [prayers, setPrayers] = useState([]);
    const [currentPrayerTimes, setCurrentPrayerTimes] = useState();
    const [currentPrayer, setCurrentPrayer] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const docRef = masjidId ? doc(FIRESTORE_DB, "mosques", masjidId.replace(/\s/g, '')) : null;

    const nextPrayer = {
        "Fajr": "Dhuhr",
        "Dhuhr": "Asr",
        "Asr": "Maghrib",
        "Maghrib": "Isha",
        "Isha": "Fajr",
    };

    useEffect(() => {
        const getInfo = async () => {
            const docSnap = await getDoc(docRef);
            setPosts(docSnap.data()["posts"])
            setName(docSnap.data()["name"])
            setBio(docSnap.data()["bio"]);
            setMembers(docSnap.data()["members"])
            setAddress(docSnap.data()["address"])
            setPrayers(docSnap.data()["prayerTimes"])
            setIsLoading(false);
        }
        getInfo();
    },[])

    useEffect(() => {
        const fetchPrayerTimes = async () => {
            const info = await getMosquePrayerTimes(prayers, address)
            setCurrentPrayerTimes(info.mosquePrayerTimes);
            setCurrentPrayer(info.currentPrayer);
        }
        fetchPrayerTimes();
    }, [prayers]);


    const handleNavigate = useCallback(() => {
        navigation.navigate('PrayerTimes', {
            info: {
                prayer: currentPrayerTimes,
                name: name
            },
            currentPrayer: currentPrayer,
            uid: uid,
        });
    }, [currentPrayerTimes, currentPrayer, uid]);
    

    const images = [
        'https://images.unsplash.com/photo-1716396502668-26f0087e1c7d?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1716222350384-763cc1ec344a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1716339140080-be256d3270ce?q=80&w=2369&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1716396502668-26f0087e1c7d?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];
    
    // for testing
    const [post2, setPost] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...");

    return (
        <ScrollView style={styles.page} contentContainerStyle={{ flexGrow: 1 }}>
            <Image 
                source={require('../../assets/MosquePage.png')} 
                style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                }}
            />
            {isLoading ? <BallIndicator color="#F2EFFB" /> : (
            <>
                <View style={styles.mainInfo}>
                    <Text style={styles.mainText}>{name}</Text>
                    <View style={styles.info}>
                        <Image
                            source={require('../../assets/icon.png')} 
                            style={{
                            width: 100,
                            height: 100,
                            borderRadius: 10000,
                            }}
                        />
                        
                        <View style={styles.generalInfo}>
                            <View style={styles.infoSegment}>
                                <Text style={{fontSize:14, fontWeight: 600}}>{members}</Text>
                                <Text style={{fontSize:14}}>Members</Text>
                            </View>
                            <View style={styles.infoSegment}>
                                {currentPrayerTimes && currentPrayer ? (
                                    <>
                                        <Text style={{fontSize:14, fontWeight: 600}}>{convertMilitaryTime(currentPrayerTimes[nextPrayer[currentPrayer]])}</Text>
                                        <Text style={{fontSize:14}}>{nextPrayer[currentPrayer]}</Text>
                                    </>
                                    
                                ) : <>
                                        <Text style={{fontSize:14, fontWeight: 600}}>Loading...</Text>
                                        <Text style={{fontSize:14}}>Loading...</Text>
                                    </>
                                }
                                
                            </View>
                            <View style={styles.infoSegment}>
                                <Text style={{fontSize:14, fontWeight: 600}}>5</Text>
                                <Text style={{fontSize:14}}>Events</Text>
                            </View>
                        </View>
                    </View>
                    <Text 
                        style={{ marginLeft: 25, marginTop: 15, fontSize:11 }}>
                        {bio}
                    </Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity style={styles.viewPageButton}>
                            <Text style={styles.buttonText}>View Calander</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.directionsButton}
                            onPress={() => {
                                const url = `https://www.google.com/maps/place/${encodeURIComponent(address.replace(/\s/g, '+'))}`;
                                Linking.openURL(url);
                            }}
                        >
                            <Text style={styles.buttonText}>Directions</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.prayerTimesButton}
                            onPress={handleNavigate}
                            
                        >
                            <Text style={styles.buttonText}>Prayer Times</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.posts}>
                        {posts && posts.map((post, index) => (
                            <View style={styles.posts} key={index}>
                                <View style={styles.line}></View>
                                <Post isText={post["isText"]} time="1 day ago" text={post["text"]} masjidName={post["name"]} color={"#000000"} images={post["images"]}/>
                            </View>
                        ))}
                    <View style={styles.line}></View>
                    <Post isText={true} time="1 day ago" text={post2} masjidName={name} color={"#000000"}/>
                    <View style={styles.line}></View>
                    <Post isText={false} time="1 day ago" text={post2} masjidName={name}  images={images} color={"#000000"}/>
                </View>
            </>)}
        </ScrollView>
    )
}

export default MosquePage;

const styles = StyleSheet.create({
    page: {
        width: '100%',
    },
    posts: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    info: {
        height: 100,
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'center',
        gap: 25,
        marginTop: 15,
    },
    generalInfo: {
        display:'flex',
        flexDirection:'row',
        gap: 30,
        marginTop: 20,
    },
    infoSegment: {
        display: 'flex',
        alignItems: 'center'
    },
    mainInfo: {
        width: '100%',
        marginBottom: 20,
        display: 'flex',
        marginTop: 60,

    },
    mainText: {
        fontSize: 20,
        fontWeight: '600',
        textAlign:'center'
    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    buttons: {
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 4,
        marginTop: 10
    },
    line: {
        width: '100%',
        height: '1px',
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderColor: '#ebfeea80', 
        gap: '15px',
        position: 'sticky'
    },
    scrollContainer: {
        width: '100%',
        flex: 1,
    },
    mosqueInfoContent: {
        gap: 15,
        width: '100%',
        minHeight: '100%',
    },
    viewPageButton: {
        width: 110,
        height: 25,
        backgroundColor: '#699a51',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionsButton: {
        width: 110,
        height: 25,
        backgroundColor: '#516d9a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    prayerTimesButton: {
        width: 110,
        height: 25,
        backgroundColor: '#67519a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 12,
        color: '#e6e8ec', 
        fontWeight: '500',
        textAlign: 'center',
    },
})