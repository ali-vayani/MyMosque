import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, ActivityIndicator, StyleSheet, Image, Linking, TouchableOpacity, ScrollView} from 'react-native'
import Post from '../../../../components/elements/Post';
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../../../firebaseConfig';
import convertMilitaryTime from '../../../../functions/convertMilitaryTime';
import getMosquePrayerTimes from '../../../../functions/getMosquePrayerTimes';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

const MosquePage = () => {
    const router = useRouter()
    const {masjidId, uid} = useLocalSearchParams();
    const [posts, setPosts] = useState();
    const [name, setName] = useState("Nueces Mosque");
    const [bio, setBio] = useState();
    const [members, setMembers] = useState();
    const [address, setAddress] = useState();
    const [prayers, setPrayers] = useState([]);
    const [currentPrayerTimes, setCurrentPrayerTimes] = useState();
    const [currentPrayer, setCurrentPrayer] = useState("")
    const [isLoading, setIsLoading] = useState(true);
    const [joined, setJoined] = useState(false);
    const [numEvents, setNumEvents] = useState(0);
    const docRef = masjidId ? doc(FIRESTORE_DB, "mosques", masjidId.replace(/\s/g, '')) : null;
    const userRef = doc(FIRESTORE_DB, "users", uid);


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
            const userSnap = await getDoc(userRef)
            const dateFormatted = formatDate(new Date);
            const events = docSnap.data()['events'] || {};
            const todaysEvent = events[dateFormatted];
            const newPosts = [];
            const mosqueData = docSnap.data();
            const posts = mosqueData.posts || [];

            posts.forEach(post => {
                newPosts.push({
                    ...post,
                    timeCreated: new Date(post.timeCreated.seconds * 1000),
                    masjidId: null,
                    uid: null
                });
            });

            Object.entries(events).forEach(([date, events]) => {
                //console.log(new Date(event.timeCreated.seconds * 1000))
                events.forEach(event => {
                    //console.log(new Date(event.timeCreated.seconds * 1000).toLocaleDateString())
                    newPosts.push({
                        name: mosqueData.name,
                        title: event.title,
                        text: `Event: ${event.title}\nTime: ${event.time}\nDate: ${date}`,
                        isText: false,
                        time: date,
                        masjidId: masjidId,
                        uid: uid,
                        images: event.images,
                        timeCreated: new Date(event.timeCreated.seconds * 1000)
                    });
                });
            });

            setPosts(newPosts.sort((a, b) => {
                const timeA = a.timeCreated || 0;
                const timeB = b.timeCreated || 0;
                return timeB - timeA;
            }));

            setNumEvents(todaysEvent == undefined ? 0 : todaysEvent.length);
            setName(docSnap.data()["name"])
            setBio(docSnap.data()["bio"]);
            setMembers(docSnap.data()["members"])
            setAddress(docSnap.data()["address"])
            setPrayers(docSnap.data()["prayerTimes"])
            userSnap.data()["favMasjids"].map((mid) => {
                if(mid == masjidId)
                    setJoined(true);
            })
            setIsLoading(false);
        }
        getInfo();
    },[]);


    useEffect(() => {
        const fetchPrayerTimes = async () => {
            const info = await getMosquePrayerTimes(prayers, address)
            setCurrentPrayerTimes(info.mosquePrayerTimes);
            setCurrentPrayer(info.currentPrayer);
        }
        fetchPrayerTimes();
    }, [prayers]);

    const formatDate = (date) => {
        const localDate = new Date(date.getTime());
        return `${localDate.getFullYear()}-${String(localDate.getMonth() + 1).padStart(2, '0')}-${String(localDate.getDate()).padStart(2, '0')}`;
    };

    const handleBookmar = async () => {
        if (joined) {
            setJoined(false);
            try {
                const userSnap = await getDoc(userRef);
                let favMasjids = userSnap.data()?.favMasjids || [];
                favMasjids = favMasjids.filter(mid => mid !== masjidId);
                await updateDoc(userRef, { favMasjids });
            } catch (error) {
                console.error("Error updating favorites: ", error);
            }
        } else {
            setJoined(true);
            try {
                const userSnap = await getDoc(userRef);
                let favMasjids = userSnap.data()?.favMasjids || [];
                if (!favMasjids.includes(masjidId)) {
                    favMasjids = [...favMasjids, masjidId];
                }
                await updateDoc(userRef, { favMasjids });
            } catch (error) {
                console.error("Error updating favorites: ", error);
            }
        }
    };

    const handleNavigate = useCallback(() => {
        router.push({
            pathname: "(prayer)",
            params: {
                info: JSON.stringify({
                    prayer: currentPrayerTimes,
                    name: name
                }),
                currentPrayer: currentPrayer,
                uid: uid
            }
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
                source={require('../../../../assets/MosquePage.png')} 
                style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                }}
            />
            {isLoading ? 
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#000000" />     
            </View> : (
            <>
                <View style={styles.mainInfo}>
                    <TouchableOpacity
                        style={{
                            position: 'absolute',
                            right: 32,
                            zIndex: 10
                        }}
                        onPress={() => {
                            handleBookmar();
                        }}
                        
                    >
                        {joined ? <Ionicons name="bookmark" size={24} /> : <Ionicons name="bookmark-outline" size={24} />}
                    </TouchableOpacity>
                    <Text style={styles.mainText}>{name}</Text>
                    <View style={styles.info}>
                        <Image
                            source={require('../../../../assets/icon.png')} 
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
                                <Text style={{fontSize:14, fontWeight: 600}}>{numEvents}</Text>
                                <Text style={{fontSize:14}}>Event(s)</Text>
                            </View>
                        </View>
                    </View>
                    <Text 
                        style={{ marginLeft: 25, marginTop: 15, fontSize:11 }}>
                            
                        {bio}
                    </Text>
                    <View style={styles.buttons}>
                        <TouchableOpacity 
                            style={styles.viewPageButton}
                            onPress={() => router.push({
                                pathname: "calander",
                                params: { masjidId: masjidId, uid: uid }
                            })}
                        >
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
                                <Post post={post} color={"#000000"}/>
                            </View>
                        ))}
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
        pointerEvents: "box-none" 

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
        gap: 15,
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
    loading: {
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})