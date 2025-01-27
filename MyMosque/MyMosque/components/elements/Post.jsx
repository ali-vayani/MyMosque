import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, FlatList, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const Post = ({ masjidName, time, text, images, isText, color }) => {
    images = images || [];
    const [currentIndex, setCurrentIndex] = useState(0);
    color = color || '#ebfeea'; 

    const handleScroll = (event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / slideSize);
        setCurrentIndex(index);
    };

    const renderImage = ({ item }) => (
        <ImageBackground
            source={{ uri: item }}
            style={styles.postImage}
            imageStyle={styles.imageRounded}
        >
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                style={styles.gradient}
            >
                <Text style={styles.imageText}>{text}</Text>
            </LinearGradient>
        </ImageBackground>
    );

    if (isText) {
        return (
            <View style={styles.textContainer}>
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../../assets/icon.png')} 
                        style={{
                        width: 35,
                        height: 35,
                        borderRadius: 10000,
                        }}
                    />
                    <View style={{gap: 15, width: '90%'}}>
                        <View style={{gap: 2}}>
                            <Text style={[styles.nameText, { color: color }]}>{masjidName}</Text>
                            <Text style={[styles.timeText, { color: color }]}>{time}</Text>
                        </View>
                        <Text style={[styles.postText, { color: color }]}>{text}</Text>
                    </View>
                </View>
            </View>
        );
    } else {
        return (
            <View style={styles.imageContainer}>
                <View style={styles.headerContainer}>
                    <Image
                        source={require('../../assets/icon.png')} 
                        style={{
                        width: 35,
                        height: 35,
                        borderRadius: 10000,
                        }}
                    />
                    <View style={{gap: 2}}>
                        <Text style={[styles.nameText, { color: color }]}>{masjidName}</Text>
                        <Text style={[styles.timeText, { color: color }]}>{time}</Text>
                    </View>
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
    }
};

const styles = StyleSheet.create({
    imageContainer: {
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        gap: 15,
        marginVertical: 15,
    },
    textContainer: {
        width: '90%',
        display: 'flex',
        justifyContent: 'center',
        marginVertical: 15,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 28,
        gap: 15,
    },
    headerContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: 7,
    },
    post: {
        width: '100%',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    postImage: {
        width: width - 123, 
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
    },
    nameText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#ebfeea',
    },
    timeText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#ebfeea',
    },
    postText: {
        fontSize: 12,
        color: '#ffff',
        fontWeight: '500',
    },
    imageText: {
        fontSize: 12,
        color: '#ffff',
        fontWeight: 'bold',
        width: '87%',
        marginLeft: 10,
        marginBottom: 10
    },
    flatList: {
        borderRadius: 10,
        width: 270,
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

export default Post;