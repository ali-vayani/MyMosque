import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { doc, getDoc } from "firebase/firestore";

import MosqueInfo from '../elements/MosqueInfo';
import TextPost from '../elements/TextPost';
import ImagePost from '../elements/ImagePost';

const MyMosqueWidget = ({ navigation, masjidId, uid }) => {
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
            <Text style={styles.mainText}>Your Feed</Text>
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.mosqueInfoContent}>
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
        borderColor: '#ebfeea80', // Green with 50% opacity
        gap: '15px'
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