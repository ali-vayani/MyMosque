import React from 'react';
import { View, StyleSheet, Image, TextInput, Keyboard, Text, TouchableOpacity    } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { TouchableOpacity } from 'react-native-gesture-handler';
const SearchWidget = ({ navigation, inputVersion, onSubmit, setValue, value, uid}) => {

    let height;
    if(!inputVersion)
        height = '10%'
    else height = '75%'
    const styles = StyleSheet.create({
        widget: {
            width: '97%',
            height: height,
            backgroundColor: '#57658E',
            borderRadius: 50,
            alignItems: 'center',
            marginVertical: '2.5%',
            zIndex: -1,
            justifyContent: 'center'
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
            color: '#E6E8EC',
            fontSize: 24,
            marginHorizontal: '3%',
            fontWeight: '600',
        }
    });
        const dismissKeyboard = () => {
            if(Keyboard !== undefined)
                    Keyboard.dismiss();
                    dismissKeyboard
        };
        return (
            <View style={[styles.widget]} >
                <Image 
                    source={require('../../../assets/searchBg.png')} 
                    style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    borderRadius: 41.5,
                    opacity: .15,
                    }}
                />
            {
            !inputVersion && 
                <TouchableOpacity style={{width:'100%', height:'100%', margin: 0}} onPress={() => navigation.navigate('Map', {uid: uid})}>

                <View style={[styles.content]}>
                    <Ionicons name="search-sharp" size={36} color={'#E6E8EC'} />
                    <Text style={styles.textarea} >Find a Mosque</Text>
                </View>
                </TouchableOpacity>
            }
            {
                inputVersion && 
                <View style={[styles.content]}>
                <TouchableOpacity onPress={ dismissKeyboard && onSubmit }>
                    <Ionicons name="search-sharp" size={36} color={'#E6E8EC'} />
                </TouchableOpacity>
                <TextInput
                    style={styles.textarea}
                    returnKeyType='done'
                    onSubmitEditing={dismissKeyboard && onSubmit}
                    placeholder={'Search for a Mosque'}
                    placeholderTextColor={"rgba(230, 232, 236, .5)"}
                    onChangeText={text => setValue(text)}
                    value={value} 
                />
                </View>
            }
        </View>
        
    );
};

export default SearchWidget;