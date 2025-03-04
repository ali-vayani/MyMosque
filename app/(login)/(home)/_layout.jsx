import { Stack } from 'expo-router';

export default function HomeLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false
        }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="feed" />
            <Stack.Screen name="map" />
            <Stack.Screen name="prayer" />
            <Stack.Screen name="app" />
            <Stack.Screen name="(mosque)" />
        </Stack>
    );
}