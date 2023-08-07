import React from 'react';
import { View, StyleSheet, Image, TextInput, Keyboard    } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const SearchWidget = ({ navigation }) => {

    const dismissKeyboard = () => {
        if(Keyboard !== undefined)
                Keyboard.dismiss();
                dismissKeyboard
    };
    return (
        <View style={styles.widget}>
        <Image 
            source={require('../../../assets/images/Random3.png')} 
            style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 41.5,
            opacity: .1,
            }}
        />
        <View style={styles.content}>
        <Ionicons name="search-outline" size={36} color={'#FFF4D2'}/>
        <TextInput
            style={styles.textarea}
            returnKeyType='done'
            onSubmitEditing={dismissKeyboard}
            placeholder={'Search for a Mosque'}
            placeholderTextColor="rgba(255, 244, 210, .5)" 
        />
        </View>
        </View>
    );
};

export default SearchWidget;

const styles = StyleSheet.create({
    widget: {
      width: '97%',
      height: '10%',
      backgroundColor: '#57658E',
      borderRadius: 50,
      alignItems: 'center',
      marginVertical: '2.5%',
      zIndex: -1,
    },
    content:{
      flexDirection: 'row',
      width: '100%',
      height: '100%',
      paddingHorizontal: '10%',
      alignItems: 'center'
    },
    textarea: {
      borderColor: 'rgba(0,0,0,0)',
      color: '#FFF4D2',
      fontSize: 24,
      marginHorizontal: '3%'
    }
  
  });
