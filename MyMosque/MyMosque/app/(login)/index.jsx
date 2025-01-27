import { useState } from "react";
import { TouchableWithoutFeedback, View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Keyboard} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { useRouter } from 'expo-router';

export default function SignIn() {
    const router = useRouter();
    const [email, setEmail] = useState('test2@gmail.com')
    const [password, setPassword] = useState('123123')

    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    const signIn = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
            const user = userCredential.user;
            const uid = user.uid;
            router.push({ pathname: '/(home)', params: { uid: uid } });
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error [${errorCode}]: ${errorMessage}`);
        }
    }

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
                <   Text style={styles.headerText}>MyMosque</Text>
                </View>
        
                <View style={styles.formContainer}>
                    <TextInput 
                        placeholder="Email or username" 
                        onChangeText={(text) => setEmail(text)} 
                        value={email} 
                        placeholderTextColor={'rgba(6, 3, 31)'} 
                        style={styles.input}
                        returnKeyType="done"
                        onSubmitEditing={dismissKeyboard}
                    />

                    <TextInput 
                        placeholder="Password" 
                        onChangeText={(text) => setPassword(text)} 
                        value={password} 
                        placeholderTextColor={'rgba(6, 3, 31)'} 
                        style={styles.input}
                        returnKeyType="done"
                        onSubmitEditing={dismissKeyboard}
                        secureTextEntry={true}
                    />
                    <Text style={[styles.subtext, { color: '#67519A' }]}>Forgot Password</Text>
                    <TouchableOpacity onPress={() => signIn()} style={styles.button}>
                        <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.signUpRedirect}>
                    <Text style={styles.subtext}>Don't have an account?</Text>
                    <TouchableOpacity onPress={() => router.push('/setup')}>
                        <Text style={[styles.subtext, { color: '#67519A', fontWeight: '600',}]}>Sign up!</Text>
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
    subtext: {
        fontSize: 14,
        fontWeight: '400',
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
        backgroundColor: '#67519A', 
        borderRadius: 8, 
        marginTop: 16
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: '500',
    }, 
    signUpRedirect : {
        display: 'flex',
        flexDirection: 'row',
        gap: 3,
        position: 'absolute',
        bottom: 40,
    }

});