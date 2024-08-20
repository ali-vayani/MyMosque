import React, { useState, useRef } from 'react';
import { View, ScrollView, Animated, PanResponder, Dimensions, Text, Image } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const INITIAL_HEIGHT = SCREEN_HEIGHT * 0.6;
const THRESHOLD = 50;

const Feed = ({navigation}) => {
    const [expanded, setExpanded] = useState(false);
    const animation = useRef(new Animated.Value(INITIAL_HEIGHT)).current;

    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
        },
        onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy < -THRESHOLD && !expanded) {
            expandWidget();
        } else if (gestureState.dy > THRESHOLD && expanded) {
            collapseWidget();
        }
        },
    });

    const expandWidget = () => {
        setExpanded(true);
        Animated.spring(animation, {
        toValue: SCREEN_HEIGHT,
        useNativeDriver: false,
        }).start();
    };

    const collapseWidget = () => {
        setExpanded(false);
        Animated.spring(animation, {
        toValue: INITIAL_HEIGHT,
        useNativeDriver: false,
        }).start();
    };

    return (
        <Animated.View
            style={{
                height: animation,
                width: '100%',
                backgroundColor: '#f0f0f0',
                overflow: 'hidden',
            }}
            {...panResponder.panHandlers}
        >
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
            <ScrollView>
                {/* Your feed content goes here */}
                <View style={{ height: 1000, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Feed Content</Text>
                </View>
            </ScrollView>
        </Animated.View>
    );
};

export default Feed;