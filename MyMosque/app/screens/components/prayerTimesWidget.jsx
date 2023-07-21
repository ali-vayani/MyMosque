import {View, Text, Button, StyleSheet, TextInput, FlatList, TouchableOpacity} from 'react-native'
//import { useFonts, Lato_100Thin, Lato_100Thin_Italic, Lato_300Light, Lato_300Light_Italic, Lato_400Regular, Lato_400Regular_Italic, Lato_700Bold, Lato_700Bold_Italic, Lato_900Black, Lato_900Black_Italic} from '@expo-google-fonts/lato';

//let [fontsLoaded] = useFonts({ Lato_100Thin, Lato_100Thin_Italic, Lato_300Light, Lato_300Light_Italic, Lato_400Regular, Lato_400Regular_Italic, Lato_700Bold, Lato_700Bold_Italic, Lato_900Black, Lato_900Black_Italic, });
const PrayerTimesWidget = ({navigation}) => {
    return(
        <View style={styles.page}>
            <Text style={styles.mainText}> Prayer Times </Text>
        </View>
    )
}

export default PrayerTimesWidget;

const styles = StyleSheet.create({
    page: {
        width: '97%',
        height: '27%',
        backgroundColor: '#67519A',
    },
    mainText: {
        fontSize: 32,
        //fontFamily: 'Lato_700Bold'
    }

})