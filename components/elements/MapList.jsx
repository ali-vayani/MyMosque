import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { FIREBASE_STORAGE, FIRESTORE_DB } from '../../firebaseConfig';
import { View, Text, Linking, TouchableOpacity, ScrollView, StyleSheet, ImageBackground, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { listAll, ref, getDownloadURL } from 'firebase/storage';
import { LinearGradient } from 'expo-linear-gradient';

export default MapList = ({ uid, marker, onPress, navigation}) => {
    const router = useRouter();
    const [address, setAddress] = useState(marker.vicinity || marker.formatted_address);
    const [name, setName] = useState(marker.name);
    const [images, setImages] = useState([]);
    const [masjidInfo, setMasjidInfo] = useState();
    const [masjidId, setMasjidId] = useState();

    useEffect(() => {
        const getMasjidInfo = async () => {
            try {
                const getMosqueWithAddress = query(collection(FIRESTORE_DB, "mosques"), where("address", "==", address));
                const querySnapshot = await getDocs(getMosqueWithAddress);
                if (querySnapshot.docs.length > 0) {
                    setMasjidInfo(querySnapshot.docs[0]);
                    const masjidId = querySnapshot.docs[0].id.replace(/\s/g, '');
                    const storageRef = ref(FIREBASE_STORAGE, `images/mosques/${masjidId}`);
                    try {
                        const result = await listAll(storageRef);
                        const urls = await Promise.all(
                            result.items.map(async (item) => {
                                const url = await getDownloadURL(item);
                                return url;
                            })
                        );
                        setImages(urls);
                    } catch (error) {
                        console.error('Error fetching images:', error);
                    }
                }
            } catch (error) {
                console.error('Error fetching mosque info:', error);
            }
        };

        getMasjidInfo();
    }, []);

    const handleNavigate = async (navigateTo) => {
        try {

            if(navigateTo == "MosquePage")
                router.push({pathname: '(mosque)', params: {masjidId: masjidInfo.id, uid: uid}})
            else if(navigateTo == "PrayerTimes") {
                const prayers = masjidInfo.data().prayerTimes;
                const info = await getMosquePrayerTimes(prayers, address);
                const name = masjidInfo.data().name;

                router.push({
                    pathname: "/prayer",
                    params: {
                        info: JSON.stringify({
                            prayer: info.mosquePrayerTimes,
                            name: name
                        }),
                        currentPrayer: info.currentPrayer,
                        uid: uid
                    }
                });
            }
        } catch (error){
            console.error("an error occured: ", error)
        }
    }

    return (
        <View style={styles.container}>
            <ScrollView
                    horizontal
                    contentContainerStyle={styles.scrollViewContent}
                    showsHorizontalScrollIndicator={false}
                    style={styles.scrollView}
                >
                    {images.length > 0 ? (
                        images.map((imageUrl, index) => (
                            <ImageBackground
                            source={{ uri: imageUrl }}
                            style={styles.image}
                            imageStyle={styles.imageRounded}
                            key={index}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                style={styles.gradient}
                            >
                            </LinearGradient>
                        </ImageBackground>
                        ))
                    ) : marker.photoUrl ? (
                        <ImageBackground
                            source={{ uri: marker.photoUrl }}
                            style={styles.image}
                            imageStyle={styles.imageRounded}
                        >
                            <LinearGradient
                                colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                                style={styles.gradient}
                            >
                                <Text style={styles.imageText}>{post.text}</Text>
                            </LinearGradient>
                        </ImageBackground>
                    ) : (
                        <>
                            <View style={styles.imagePlaceholder}></View>
                            <View style={styles.imagePlaceholder}></View>
                            <View style={styles.imagePlaceholder}></View>
                        </>
                    )}
                </ScrollView>
            <TouchableOpacity style={styles.innerContainer} onPress={onPress}>

                <Text style={styles.nameText}>{name}</Text>

                <View style={styles.buttonContainer}>
                    {masjidInfo ? (
                        <TouchableOpacity 
                            style={styles.viewPageButton}
                            onPress={() => handleNavigate("MosquePage")}
                        >
                            <Text style={styles.buttonText}>View Page</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.viewPageButton, styles.disabledButton]}>
                            <Text style={[styles.buttonText, styles.disabledButtonText]}>View Page</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.directionsButton}
                        onPress={() => {
                            const encodedAddress = encodeURIComponent(address.replace(/\s/g, '+'));
                            const appleUrl = `maps://maps.apple.com/?address=${encodedAddress}`;
                            const googleUrl = `https://www.google.com/maps/place/${encodedAddress}`;
                            const url = Platform.OS === 'ios' ? appleUrl : googleUrl;
                            Linking.openURL(url);
                        }}
                    >
                        <Text style={styles.buttonText}>Directions</Text>
                    </TouchableOpacity>

                    {masjidInfo ? (
                        <TouchableOpacity 
                            style={styles.prayerTimesButton}
                            onPress={() => handleNavigate("PrayerTimes")}
                        >
                            <Text style={styles.buttonText}>Prayer Times</Text>
                        </TouchableOpacity>
                    ) : (
                        <View style={[styles.prayerTimesButton, styles.disabledButton]}>
                            <Text style={[styles.buttonText, styles.disabledButtonText]}>Prayer Times</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '95%',
        marginVertical: 4,
        height: 192,
        backgroundColor: '#364866',
        borderRadius: 15,
    },
    innerContainer: {
        // height: '100%',
        marginHorizontal: 8,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    scrollView: {
        marginTop: 8,
        zIndex: 100
    },
    scrollViewContent: {
        flexDirection: 'row',
    },
    image: {
        width: 160,
        height: 100,
        margin: 4,
        borderRadius: 4,
        backgroundColor: 'rgba(166, 182, 209, 0.5)',
        marginTop: 5,
    },
    imagePlaceholder: {
        backgroundColor: 'rgba(166, 182, 209, 0.5)', 
        margin: 4,
        borderRadius: 4,
        width: 160,
    },
    nameText: {
        fontSize: 18,
        color: '#e6e8ec',
        fontWeight: 'bold',
        marginVertical: 8,
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 12,
        flexDirection: 'row',
        gap: 8,
    },
    viewPageButton: {
        width: 112,
        height: 32,
        backgroundColor: '#699a51',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    directionsButton: {
        width: 112,
        height: 32,
        backgroundColor: '#516d9a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    prayerTimesButton: {
        width: 112,
        height: 32,
        backgroundColor: '#67519a', 
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#e6e8ec', 
        textAlign: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    disabledButtonText: {
        opacity: 0.75,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
    },
    imageRounded: {
        borderRadius: 4,
    },
});
