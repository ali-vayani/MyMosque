import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

const ImagePost = ({ navigation, masjidId, uid }) => {
    const [name, setName] = useState("Masjid Name");
    const [post, setPost] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...");

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.timeText}>1 day ago</Text>
            </View>
            <View style={styles.post}>
                <ImageBackground 
                    source={{ uri: 'https://images.unsplash.com/photo-1716396502668-26f0087e1c7d?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }} // Replace with your image URL or local file
                    style={styles.postImage}
                    imageStyle={styles.imageRounded}
                >
                    <LinearGradient
                        colors={['transparent', 'rgba(0, 0, 0, .7)']} // Gradient from transparent to 75% black
                        style={styles.gradient}
                    >
                        <Text style={styles.postText}>{post}</Text>
                    </LinearGradient>
                </ImageBackground>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: 28,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        borderColor: '#ebfeea80', // Green with 50% opacity
        gap: 15,
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 2,
    },
    post: {
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postImage: {
        width: 300,
        height: 250,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imageRounded: {
        borderRadius: 10,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject, // Fills entire image
        justifyContent: 'flex-end',
        borderRadius: 10, // Match the image's border radius
        padding: 10,
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ebfeea', // Dark green text color for the name
    },
    timeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ebfeea', // Dark green text color for the time
    },
    postText: {
        fontSize: 12,
        color: '#ebfeea', // White text color for visibility on the image
        fontWeight: 'bold',
    },
});

export default ImagePost;
