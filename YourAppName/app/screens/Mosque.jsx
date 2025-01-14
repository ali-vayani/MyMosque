import {View, Text, Button, StyleSheet, Image, ImageBackground, FlatList, TouchableOpacity, Modal, ScrollView} from 'react-native';
import React, { useEffect, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { FIRESTORE_DB, FIREBASE_STORAGE } from '../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import ViewPager from '@react-native-community/viewpager';

const Mosque = ({navigation, route}) => {
    let { masjidId, uid } = route.params;
    const [name, setName] = useState('');
    const [announcments, setAnnouncements] = useState('');
    const [address, setAddress] = useState('');
    const [website, setWebsite] = useState('');
    const [isFavorite, setFavorite] = useState(false)
    const [isAdmin, setAdmin] = useState(false)
    const [showAnnouncementsModal, setShowAnnouncementsModal] = useState(false);
    const [allAnnouncements, setAllAnnouncements] = useState([]);
    const [imageUrl, setImageUrl] = useState()
    let docRef = doc(FIRESTORE_DB, "masjids", masjidId.replace(/\s/g, ''));
    let userRef = doc(FIRESTORE_DB, "users", uid.replace(/\s/g, ''));
    const listRef = ref(FIREBASE_STORAGE, 'images/masjids/' + masjidId)

    useEffect(() => {
        getInfo()
    }, []);

    const getInfo = async () => {
        const docSnap = await getDoc(docRef);
        const userDocSnap = await getDoc(userRef);
        if(userDocSnap.data()["favMasjids"].length > 0)
        {
            for(let i = 0; i < userDocSnap.data()["favMasjids"].length; i++)
            {
                if(userDocSnap.data()["favMasjids"][i].replace(/\s/g, '') === masjidId)
                    setFavorite(true)
            }
        }
        if(docSnap.data()["adminUid"] === uid)
            setAdmin(true);
        setName(docSnap.data()["name"])
        setAnnouncements(docSnap.data()["announcement"][docSnap.data()["announcement"].length - 1]);
        setAllAnnouncements(docSnap.data()["announcement"])
        setAddress(docSnap.data()["address"])
        setWebsite(docSnap.data()["website"])

        listAll(listRef)
            .then((res) => {
                res.items.forEach( async (itemRef) => {
                const itemRefPath =  itemRef._location.path_;
                    getDownloadURL(ref(FIREBASE_STORAGE, itemRefPath)).then((url) => {
                        setImageUrl(url)
                    })
                });
            
            }).catch((error) => {
                console.log(error)
            });
    }
    const toggleFavorite = async () => {
        // Get current favMasjids of the user
        const userDocSnap = await getDoc(userRef);
    
        // Check if masjidId is in favMasjids
        const currentFavMasjids = userDocSnap.data()["favMasjids"] || [];
        const isCurrentlyFavorite = currentFavMasjids.includes(masjidId);
    
        let updatedFavMasjids;
        if (isCurrentlyFavorite) {
            updatedFavMasjids = currentFavMasjids.filter(id => id !== masjidId);
        } else {
            updatedFavMasjids = [...currentFavMasjids, masjidId];
        }
    
        await updateDoc(userRef, {
            favMasjids: updatedFavMasjids
        });
    
        setFavorite(!isCurrentlyFavorite);
    };
    
    //...
    

    return (
        <View style={styles.page}>
            <LinearGradient colors={['#679159', '#A79A84']} style={styles.background}/>
            <Image 
                source={require('../../assets/Random3.png')} 
                style={styles.imageBg}
            />
            <View style={styles.content}>
                {!isAdmin &&
                    <TouchableOpacity style={styles.star} onPress={() => toggleFavorite()}>
                        {!isFavorite && <Ionicons name="star-outline" size={25} color={'#C8C079'}/>}
                        {isFavorite && <Ionicons name="star" size={25} color={'#C8C079'}/>}
                    </TouchableOpacity>  
                }
                {isAdmin &&
                    <TouchableOpacity style={styles.star} onPress={() => navigation.navigate('EditMosque', {masjidId: masjidId})}>
                        <Ionicons name="create" size={25} color={'#C8C079'}/>
                    </TouchableOpacity>  
                }

                
                <View style={styles.image}>
                    <Image 
                        source={{ uri: imageUrl }} 
                        style={styles.masjidImage}
                        resizeMode="cover"
                    />
                    <View style={{paddingBottom: 15,paddingLeft: 10}}>
                        <Text style={[styles.mainText, {textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3,}]}>{name}</Text>
                        <Text style={[styles.minorText, {textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 3,}]}>{address}</Text>
                    </View>

                </View>
                
                <TouchableOpacity style={styles.contentBlock} onPress={() => setShowAnnouncementsModal(true)}>
                    <Text style={styles.mainText}> Announcments </Text>
                    <View style={styles.announcmentInfo}>
                        <View style={styles.userIcon}></View> 
                        <View style={styles.userInfo}>
                            <Text style={styles.minorText}>Name</Text>
                            <Text style={styles.minorMinorText}>July 20th</Text>
                        </View>
                    </View>
                    <Text style={styles.minorText}>{ announcments }</Text>
                </TouchableOpacity>

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
                
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={showAnnouncementsModal}
                    onRequestClose={() => setShowAnnouncementsModal(false)}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <View style={styles.modal}>
                            <Text style={styles.mainText}>All Announcements</Text>
                            <ScrollView style={{ flex: 1 }}>
                                {allAnnouncements.map((announcement, index) => (
                                    <View key={index} style={{ padding: 10 }}>
                                        <View style={styles.announcmentInfo}>
                                            <View style={styles.userIcon}></View> 
                                            <View style={styles.userInfo}>
                                                <Text style={styles.minorText}>Name</Text>
                                                <Text style={styles.minorMinorText}>July 20th</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.minorText}>{announcement}</Text>
                                        <View style={{  
                                            height: 1,
                                            backgroundColor: 'rgb(255, 244, 210)',
                                            marginVertical: '3%'
                                        }}/>
                                            
                                    </View>
                                ))}
                            </ScrollView>
                            <Button title="Close" onPress={() => setShowAnnouncementsModal(false)} color={"rgb(255, 244, 210)"}/>
                        </View>
                    </View>
                </Modal>
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
        marginBottom: 25,
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 10
    },
    contentBlock:{
        width: '100%',
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
    masjidImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        flex: 1,
    },    
    modal:{
        width: '90%', 
        height: '70%', 
        backgroundColor: '#679159', 
        borderRadius: 10, 
        padding: 10,
        
    }
    
})