import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import MosqueInfo from '../elements/MosqueInfo';
import Post from '../elements/Post';
import { FIRESTORE_DB } from '../../../firebaseConfig';


const MyMosqueWidget = ({ navigation, masjidId, uid }) => {
    const [posts, setPosts] = useState();
    const getPosts = async () => {
        try {
            for (const id of masjidId) {
                const docRef = doc(FIRESTORE_DB, "mosques", id.replace(/\s/g, ''));
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log(`Data for ${id}:`, docSnap.data()["posts"][0]["timeCreated"]);
                    setPosts(docSnap.data()["posts"]);
                } else {
                    console.log(`No document found for ID: ${id}`);
                }
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };
    
    useEffect(() => {
        getPosts();
    }, []);
    // for testing
    const images = [
        { uri: 'https://images.unsplash.com/photo-1716396502668-26f0087e1c7d?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { uri: 'https://images.unsplash.com/photo-1716222350384-763cc1ec344a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D' },
        { uri: 'https://images.unsplash.com/photo-1716339140080-be256d3270ce?q=80&w=2369&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { uri: 'https://images.unsplash.com/photo-1716396502668-26f0087e1c7d?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ];

    return (
        <View style={styles.widget}>
        <Image 
            source={require('../../../assets/feedBg.png')} 
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
                {masjidId && masjidId.length > 0 ? (
                    <TouchableOpacity 
                        onPress={() => {
                            console.log("pressed", masjidId[0])
                            if (masjidId[0]) {  
                                navigation.navigate('MosquePage', 
                                { masjidId: masjidId[0], uid: uid, navigation: navigation });
                            } else {
                                console.error("masjidId[0] is undefined");
                            }
                        }}>
                        <Ionicons name="chevron-forward-outline" size={32} color={'#EBFEEA'}/>
                    </TouchableOpacity>
                ) : <></>}
            </View>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.mosqueInfoContent}>
                    {posts && posts.map((post, index) => (
                        <>
                            <View style={styles.line}></View>
                            <Post isText={post["isText"]} time="1 day ago" text={post["text"]} masjidName={post["name"]}/>
                        </>
                    ))}
                    {/* <View style={styles.line}></View>
                    <Post isText={true} time="1 Day Ago" text={post} masjidName={name}/> */}
                    <View style={styles.line}></View>
                    <Post isText={false} time="1 Day Ago" text={"post"} masjidName={"name"}  images={images}/>
                    {/* {masjidId && masjidId.map((id, index) => (
                        <React.Fragment key={index}>
                            <View style={styles.line}></View>
                            <MosqueInfo masjidId={id} navigation={navigation} uid={uid}/>
                        </React.Fragment>
                    ))} */}
                    <MosqueInfo masjidId={undefined} navigation={navigation}/>
                </View>
            </ScrollView>
        </View>

        </View>
    );
};

export default MyMosqueWidget;

const styles = StyleSheet.create({
    widget: {
        width: '100%',
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
        gap: '15px',
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