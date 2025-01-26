import { useState } from "react";
import { TouchableWithoutFeedback, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard} from 'react-native';

export default function SetUp({navigation}) {
    const [email, setEmail] = useState('test@gmail.com')
    const [username, setUsername] = useState('ali')

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    return (
        <TouchableWithoutFeedback onPress={dismissKeyboard}>
            <View style={styles.container}>
                <Image 
                    source={require('../../assets/MMBackground.png')} 
                    style={{
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    opacity: .5
                    }}
                />
                <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Email</Text>
                <Text style={styles.subHeaderText}>Don't worry! We don't spam!</Text>
                </View>
        
                <View style={styles.formContainer}>
                <TextInput 
                    placeholder="Username" 
                    onChangeText={(text) => setUsername(text)} 
                    value={username} 
                    placeholderTextColor={'rgba(6, 3, 31)'} 
                    style={styles.input}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                />
        
                <TextInput 
                    placeholder="Email" 
                    onChangeText={(text) => setEmail(text)} 
                    value={email} 
                    placeholderTextColor={'rgba(6, 3, 31)'} 
                    style={styles.input}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                />
                
                <TouchableOpacity onPress={() => navigation.navigate('CreateAccount', {userEmail: email, userName: username})} style={styles.button}>
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
                </View>
            </View>
            </TouchableWithoutFeedback>
        );
    };
    
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            justifyContent: 'flex-start',
        },
        headerContainer: {
            height: '33%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingBottom: 16,
            gap: 3
        },
        headerText: {
            fontSize: 40,
            fontWeight: '500',
        },
        subHeaderText: {
            fontSize: 20,
            fontWeight: '500',
            color: 'rgba(0, 0, 0, 0.5)'
        },
        formContainer: {
            height: '33%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start'
        },
        input: {
            width: '91.66%',
            height: 64, 
            paddingHorizontal: 16,
            marginVertical: 8, 
            borderRadius: 8,
            borderWidth: 2,
            backgroundColor: 'rgba(0, 0, 0, 0.05)', 
            borderColor: 'rgba(0, 0, 0, 0.25)' 
        },
        button: {
            width: '91.66%',
            height: 56, 
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#516D9A', 
            borderRadius: 8, 
            marginTop: 16
        },
        buttonText: {
            color: 'white',
            fontSize: 20,
            fontWeight: '500',
        },
    });