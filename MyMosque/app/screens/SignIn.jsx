import {View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity} from 'react-native'
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
            <View style={styles.content}>
                <Text>MyMosque</Text>
                <TextInput style={styles.input} placeholder="Email" onChangeText={(text) => setEmail(text)} value={email}/>
                <TextInput style={styles.input} textContentType="password" placeholder="Password" onChangeText={(text) => setPassword(text)} value={password}/>
                <Button onPress={() => signIn(email, password)} title="Sign In"></Button>
            </View>

        </View>
    )
}

export default SignIn;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        alignItems: 'center'

    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    },
    content: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        marginVertical: '2%',
    },
    input: {
        borderWidth: 3,
        color: "#f7f7f7",
        fontSize: 16,
        borderColor: "#f7f7f7",
        backgroundColor: 'rgba(118, 118, 128, .20)',
        height: 60,
        marginVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 10,
        marginHorizontal: 20
    }
})