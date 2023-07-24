import {View, Text, Button, StyleSheet, Image, FlatList, TouchableOpacity} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient';
import PrayerTimesWidget from '../components/widgets/prayerTimesWidget';
import SearchWidget from '../components/widgets/SearchWidget';
import MyMosqueWidget from '../components/widgets/MyMosquesWidget';

const PrayerTimes = ({navigation}) => {
    return(
        <View style={styles.page}>
            <LinearGradient colors={['#67519A', '#A79A84']} style={styles.background}/>
            <Image 
            source={require('../../assets/images/Random3.png')} 
            style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: 41.5,
            opacity: .1,
            }}/>

        </View>
    )
}

export default PrayerTimes;

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
    }
})