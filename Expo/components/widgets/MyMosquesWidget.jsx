import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import Post from '../elements/Post';
import { FIRESTORE_DB } from '../../firebaseConfig';
import { useRouter, useLocalSearchParams } from 'expo-router';


const MyMosqueWidget = ({ masjidId, uid, fullscreen }) => {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const getPosts = async () => {
        try {
            const newPosts = [];
            for (const id of masjidId) {
                const docRef = doc(FIRESTORE_DB, "mosques", id.replace(/\s/g, ''));
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const mosqueData = docSnap.data();
                    const mosquePosts = mosqueData.posts || [];
                    mosquePosts.forEach(post => {
                        newPosts.push({
                            ...post,
                            masjidId: id,
                            timeCreated: new Date(post.timeCreated.seconds * 1000),
                            uid: uid
                        });
                    });
                    const mosqueEvents = mosqueData.events || {};
                    Object.entries(mosqueEvents).forEach(([date, events]) => {
                        events.forEach(event => {
                            newPosts.push({
                                name: mosqueData.name,
                                title: event.title,
                                text: event.description,
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

    const reformatDate = (date) => {
        const year = date.slice(0, 4);
        const month = date.slice(5, 7);
        const day = date.slice(8);
        return month + "/" + day + "/" + year;
    }
    
    return (
        <View style={styles.widget}>
        <Image 
            source={require('../../assets/feedBg.png')} 
            style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 41.5,
            opacity: .25,
            }}
        />
        <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.mainText}>Your Feed</Text>
                {masjidId && !fullscreen ? (
                    <TouchableOpacity 
                        onPress={() => {
                            router.push({ 
                                pathname: '/feed',
                                params: { masjidId: JSON.stringify(masjidId), uid: uid, fullscreen: true}
                            });
                        }}>
                        <Ionicons name="chevron-forward-outline" size={32} color={'#EBFEEA'}/>
                    </TouchableOpacity>
                ) : <></>}
            </View>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.mosqueInfoContent}>
                    {posts.map((post, index) => (
                        <View key={index}>
                            <View style={styles.line}></View>
                            <Post post={post}/>
                        </View>
                    ))}
                    <View style={styles.line}></View>
                </View>
            </ScrollView>
        </View>

        </View>
    );
    
};

export default MyMosqueWidget;


const styles = StyleSheet.create({
    widget: {
        width: '97%',
        height: '56%',
        backgroundColor: '#679159',
        borderRadius: 41.5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
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
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    scrollContainer: {
        width: '100%',
        flex: 1,
    },
    mainText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#EBFEEA',
    },
    content: {
        paddingTop: '10%',
        paddingBottom: '5%',
        width: '90%',
        height: '100%',
        gap: 35
    },
    mosqueInfoContent: {
        gap: 15,
        width: '100%',
        minHeight: '100%',
    },
});