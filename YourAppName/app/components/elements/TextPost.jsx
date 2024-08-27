import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TextPost = ({ navigation, masjidId, uid }) => {
    const [name, setName] = useState("Masjid Name");
    const [post, setPost] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...");

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.timeText}>1 day ago</Text>
            </View>
            <Text style={styles.postText}>{post}</Text>
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
        gap: '15px'
    },
    headerContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: '2px'
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
        color: '#ebfeea', // Dark green text color for the post content
        fontWeight: 'bold',
    },
});

export default TextPost;
