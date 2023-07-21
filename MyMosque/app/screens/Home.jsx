import {View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from './components/prayerTimesWidget';
import { FlipInEasyX } from 'react-native-reanimated';

const Home = ({navigation}) => {
    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#57658E', '#679159']} style={styles.background}/>
            <Text> Home </Text>
            <PrayerTimesWidget/>
        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    page: {
        width: '100%',
        height: '100%',
        color: '#FFF4D2',

    },
    background:{
        width: '100%',
        height: '100%',
        position: 'absolute'
    }
})