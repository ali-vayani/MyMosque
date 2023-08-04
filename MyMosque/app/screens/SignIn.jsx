import {View, Text, Button, StyleSheet, TextInput, Image, TouchableOpacity} from 'react-native'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';


const SignIn = ({navigation}) => {
    
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    
    const signIn = async (email, password) => {
        console.log(email + password);
        try {
            const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
    
            // Signed in
            const user = userCredential.user;
            const uid = user.uid;
            console.log(uid)
            const docRef = doc(FIRESTORE_DB, "users", uid);
            const docSnap = await getDoc(docRef);
            console.log(docSnap.data()["favMasjid1"])
            navigation.navigate('Home', {uid: uid});
        } catch (error) {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Error [${errorCode}]: ${errorMessage}`);
        }
    }


    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            <Image 
                source={require('../../assets/images/Random3.png')} 
                style={{
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                opacity: .05,
                }}
            />
            <View style={styles.content}>
                <Text style={styles.mainText}>MyMosque</Text>
                <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => setEmail(text)} value={email} placeholderTextColor={'rgba(255, 244, 210, .5)'}/>
                <TextInput style={styles.input} textContentType="password" placeholder="Password" onChangeText={(text) => setPassword(text)} value={password} placeholderTextColor={'rgba(255, 244, 210, .5)'}/>
                <TouchableOpacity style={styles.button} onPress={() => signIn(email, password)}>
                    <Text style={styles.buttonText}>Sign In</Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}

export default SignIn;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    content: {
        width: '100%',
        height: '90%',
        alignItems: 'center',
        paddingVertical: '20%',

    },
    input: {
        borderWidth: 3,
        color: "#fff4d2",
        fontSize: 20,
        borderColor: "#fff4d2",
        backgroundColor: 'rgba(255, 244, 210, .10)',
        height: 60,
        marginVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginHorizontal: 20,
        minWidth: 350
    },
    button: {
        backgroundColor: 'rgba(255, 244, 210, .15)',
        height: 40,
        width: 80,
        justifyContent: 'center', 
        alignItems: 'center', 
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "#fff4d2",
        marginTop: '7%'
    },
    buttonText: {
        color: 'rgba(255, 244, 210, 1)',
        fontSize: 16,
    },
    mainText: {
        color: '#fff4d2',
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: '10%'
    }
})