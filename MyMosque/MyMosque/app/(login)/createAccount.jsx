import { useEffect, useState } from "react";
import {View, Text, TextInput, TouchableWithoutFeedback, TouchableOpacity, Keyboard, StyleSheet, Image} from 'react-native';
import Checkbox from 'expo-checkbox';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIRESTORE_DB } from '../../firebaseConfig';
import { doc, setDoc} from "firebase/firestore";
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function CreateAccount() {
    const router = useRouter();
    const { userEmail, userName } = useLocalSearchParams();
    const [email, setEmail] = useState(userEmail);
    const [username, setUsername]= useState(userName);
    const [password, setPassword] = useState();
    const [savePassword, setSavePassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(true);

     // dismisses keyboard when needed
    const dismissKeyboard = () => {
        Keyboard.dismiss();
    };

    // makes sure password is at least 7 characters long and includes a special character
    const checkPasswordValid = () => {
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>[\]\\/'`~;=_+\-]/g;
        return password.length >= 7 && specialCharRegex.test(password);
    };

    const createAccount = async() => {
        const isValid = checkPasswordValid();
        setPasswordValid(isValid);
        if(isValid) {
            try {
                const auth = getAuth();
                createUserWithEmailAndPassword(auth, email, password)
                    .then( async (userCredentials) => {
                        const user = userCredentials.user;
                        await addUserDB(user.uid)
                        router.replace({ pathname: '/(home)', params: { uid: uid } });
                    })
                    .catch((error) => {
                        console.error("Error creating user:", error);
                        alert(getErrorMessage(error.code));
                    });
            } catch (error) {
                console.error("Unexpected error:", error);
            }
        }
    }

    const addUserDB = async (uid) => {
        try {
            const userRef = doc(FIRESTORE_DB, "users", uid);
            await setDoc(userRef, {favMosques: [],});
            console.log(`User ${uid} added successfully with favMosques initialized as an empty array.`);          
        } catch (error) {
            console.error("Error adding user to Firestore: ", error);
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
                <Text style={styles.headerText}>Create password</Text>
                <Text style={styles.subHeaderText}>Make sure to remember it!</Text>
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Password"
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    placeholderTextColor={'rgba(194, 71, 71)'}
                    style={[
                        styles.input,
                        passwordValid ? styles.inputValid : styles.inputInvalid
                    ]}
                    returnKeyType="done"
                    onSubmitEditing={dismissKeyboard}
                    secureTextEntry={true}
                />
                {!passwordValid && (
                    <Text style={styles.errorText}>
                        Password must be 7 characters and include a special character
                    </Text>
                )}
                <TouchableOpacity
                    onPress={() => setSavePassword(!savePassword)}
                    style={styles.checkboxContainer}
                >
                    <Checkbox
                        value={savePassword}
                        onValueChange={setSavePassword}
                        color={savePassword ? '#699A51' : undefined}
                    />
                    <Text style={styles.checkboxText}> Save Password</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => createAccount()}
                    style={styles.createButton}
                >
                    <Text style={styles.createButtonText}>Create Account</Text>
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
        justifyContent: 'flex-start'
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
        fontWeight: '500'
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
        borderWidth: 2
    },
    inputValid: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)', 
        borderColor: 'rgba(0, 0, 0, 0.5)' 
    },
    inputInvalid: {
        backgroundColor: 'rgba(0, 0, 0, 0.05)', 
        borderColor: 'rgba(0, 0, 0, 0.25)',
        color: '#9A5151'
    },
    errorText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#9A5151', 
        textAlign: 'left',
        width: '91.66%' 
    },
    checkboxContainer: {
        flexDirection: 'row',
        width: '91.66%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 8,
        marginLeft: 4, 
        gap: 4
    },
    checkboxText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#000'
    },
    createButton: {
        width: '91.66%',
        height: 56, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#699A51', 
        borderRadius: 8, 
        marginTop: 16
    },
    createButtonText: {
        color: '#fff',
        fontSize: 20, 
        fontWeight: '500'
    }
});
