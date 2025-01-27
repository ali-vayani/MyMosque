import { Redirect } from 'expo-router';
import { FIREBASE_AUTH } from '../firebaseConfig';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((currentUser) => {
        setUser(currentUser);
        setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (isLoading) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#67519A" />
        </View>
        );
    }

    if (!user) {
        return <Redirect href="/(login)" />;
    }

    return <Redirect href={{
        pathname: "/(home)",
        params: { uid: user.uid }
    }} />;
}