import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ImagePost = ({ navigation, masjidId, uid }) => {
    const [name, setName] = useState("Masjid Name");
    const [post, setPost] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam...");
    const [currentIndex, setCurrentIndex] = useState(0);

    // Example images array
    const images = [
        { uri: 'https://images.unsplash.com/photo-1716396502668-26f0087e1c7d?q=80&w=3135&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
        { uri: 'https://images.unsplash.com/photo-1716222350384-763cc1ec344a?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8OXx8fGVufDB8fHx8fA%3D%3D' },
        { uri: 'https://images.unsplash.com/photo-1716339140080-be256d3270ce?q=80&w=2369&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
    ];

    const handleScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = Math.floor(event.nativeEvent.contentOffset.x / slideSize);
        setCurrentIndex(index);
    };

    const renderImage = ({ item }) => (
        <ImageBackground
            source={{ uri: item.uri }}
            style={styles.postImage}
            imageStyle={styles.imageRounded}
        >
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.75)']}
                style={styles.gradient}
            >
                <Text style={styles.postText}>{post}</Text>
            </LinearGradient>
        </ImageBackground>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.nameText}>{name}</Text>
                <Text style={styles.timeText}>1 day ago</Text>
            </View>
            <View style={styles.post}>
                <FlatList
                    data={images}
                    renderItem={renderImage}
                    keyExtractor={(item, index) => index.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    style={styles.flatList}
                />
                <View style={styles.pagination}>
                    {images.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.dotActive : styles.dotInactive,
                            ]}
                        />
                    ))}
                </View>
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
        borderColor: '#ebfeea80',
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
        width: width - 95.5, // Account for padding
        height: 250,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    imageRounded: {
        borderRadius: 10,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        borderRadius: 10,
        padding: 10,
    },
    nameText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ebfeea',
    },
    timeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#ebfeea',
    },
    postText: {
        fontSize: 12,
        color: '#ebfeea',
        fontWeight: 'bold',
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 5,
    },
    flatList: {
        borderRadius: 10,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    dotActive: {
        backgroundColor: '#ebfeea',
    },
    dotInactive: {
        backgroundColor: '#ebfeea80',
    },
});

export default ImagePost;
