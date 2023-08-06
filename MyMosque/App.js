import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import Home from './app/screens/Home';
import PrayerTimes from './app/screens/PrayerTimes'
import Mosque from './app/screens/Mosque';
import SignIn from './app/screens/SignIn';
import CreateMosque from './app/screens/CreateMosque';
import Map from './app/screens/Map';
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Map' component={Map} options={{headerShown: false}} />
        <Stack.Screen name='SignIn' component={SignIn} options={{headerShown: false}} />
        <Stack.Screen name='Home' component={Home} options={{headerShown: false}} />
        <Stack.Screen name='Mosque' component={Mosque} options={{headerShown: false}}/>
        <Stack.Screen name='PrayerTimes' component={PrayerTimes} options={{headerShown: false}}/>
        <Stack.Screen name='CreateMosque' component={CreateMosque} options={{headerShown: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
