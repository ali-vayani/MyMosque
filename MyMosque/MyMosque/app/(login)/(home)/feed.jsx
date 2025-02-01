import { useRouter, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Image, ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { doc, getDoc } from "firebase/firestore";
import { FIRESTORE_DB } from '../../../firebaseConfig';
import Post from "../../../components/elements/Post";
import { Ionicons } from "@expo/vector-icons";

export default function Feed () {
    const router = useRouter();
    const { masjidId, uid } = useLocalSearchParams();
    const parsedMasjidId = JSON.parse(masjidId);
    const [posts, setPosts] = useState([]);

    const getPosts = async () => {
        try {
            const newPosts = [];
            for (const id of parsedMasjidId) {
                const docRef = doc(FIRESTORE_DB, "mosques", id.replace(/\s/g, ''));
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const mosqueData = docSnap.data();
                    // Handle posts
                    const mosquePosts = mosqueData.posts || [];
                    mosquePosts.forEach(post => {
                        newPosts.push({
                            ...post,
                            timeCreated: new Date(post.timeCreated.seconds * 1000),
                            masjidId: id,
                            uid: uid
                        });
                    });
                    const mosqueEvents = mosqueData.events || {};
                    Object.entries(mosqueEvents).forEach(([date, events]) => {
                        events.forEach(event => {
                            newPosts.push({
                                name: mosqueData.name,
                                title: event.title,
                                text: `Event: ${event.title}\nTime: ${event.time}\nDate: ${date}`,
                                isText: false,
                                time: date,
                                masjidId: id,
                                uid: uid,
                                images: event.images,
                                timeCreated: new Date(event.timeCreated.seconds * 1000)
                            });
                        });
                    });
                } else {
                    console.log(`No document found for ID: ${id}`);
                }
            }
            setPosts(newPosts.sort((a, b) => {

                const timeA = a.timeCreated || 0;
                const timeB = b.timeCreated || 0;
                return timeB - timeA;
            }));
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    
    useEffect(() => {
        getPosts();
    }, [masjidId]);

    return (
        <ScrollView style={styles.page} contentContainerStyle={{ flexGrow: 1 }}>
            <Image
                source={require('../../../assets/feedBg.png')} 
                style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: .25,
                }}
            />
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity 
                            onPress={() => {
                                router.back()
                            }}
                    >
                        <Ionicons name="chevron-back-outline" size={25} color={'#EBFEEA'}/>
                    </TouchableOpacity>
                    <Text style={styles.mainText}>Your Feed</Text>
                </View>
                <View style={styles.posts}>
                        {posts && posts.map((post, index) => (
                            <View style={styles.posts} key={index}>
                                <View style={styles.line}></View>
                                <Post post={post} />
                            </View>
                        ))}
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    page: {
        width: '100%',
        backgroundColor: '#679159',
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
        fontSize: 32,
        fontWeight: 'bold',
        color: '#EBFEEA'
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
    },
    content: {
        paddingTop: '15%',
        width: '100%',
        height: '100%',
        gap: 35
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: "center",
        gap: 10,
        paddingLeft: '5%'
    }
})