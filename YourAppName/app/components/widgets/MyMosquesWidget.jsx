import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import MosqueInfo from '../elements/MosqueInfo';
import TextPost from '../elements/TextPost';
import ImagePost from '../elements/ImagePost';
import Post from '../elements/Post';


const MyMosqueWidget = ({ navigation, masjidId, uid }) => {
    // for testing
    const [name, setName] = useState("Masjid Name");
    const [post, setPost] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...");
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
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Feed', 
                    {masjidId: masjidId, uid: uid, navigation: navigation})}>

                    <Ionicons name="chevron-forward-outline" size={32} color={'#EBFEEA'}/>
                </TouchableOpacity>
            </View>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.mosqueInfoContent}>
                    <View style={styles.line}></View>
                    <Post isText={true} time="1 Day Ago" text={post} masjidName={name}/>
                    <View style={styles.line}></View>
                    <Post isText={false} time="1 Day Ago" text={post} masjidName={name}  images={images}/>
                    {masjidId && masjidId.map((id, index) => (
                        <React.Fragment key={index}>
                            <View style={styles.line}></View>
                            <MosqueInfo masjidId={id} navigation={navigation} uid={uid}/>
                        </React.Fragment>
                    ))}
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