import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { doc, getDoc } from "firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import MosqueInfo from '../components/elements/MosqueInfo';
import TextPost from '../components/elements/TextPost';
import ImagePost from '../components/elements/ImagePost';

const Feed = ({masjidId, uid, navigation }) => {
    return (
        <View style={styles.widget}>
        <Image 
            source={require('../../assets/feedBg.png')} 
            style={{
            width: '100%',
            height: '150%',
            position: 'absolute',
            top: 0,
            left: 0,
            opacity: .25,
            }}
        />
        <View style={styles.content}>
            <View style={styles.header}>
                <Text style={styles.mainText}>Your Feed</Text>
                <Ionicons name="chevron-forward-outline" size={32} color={'#EBFEEA'}/>
            </View>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.mosqueInfoContent}>
                    <View style={styles.line}></View>
                    <TextPost/>
                    <View style={styles.line}></View>
                    <TextPost/>
                    <View style={styles.line}></View>
                    <ImagePost/>
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
    )
}

export default Feed;

const styles = StyleSheet.create({
    widget: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#679159',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: -1,
    },
    line: {
        width: '100%',
        height: '1px',
        borderTopWidth: 1,
        borderBottomWidth: 0,
        borderColor: '#ebfeea80', // Green with 50% opacity
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