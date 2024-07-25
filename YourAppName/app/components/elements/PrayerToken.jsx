import { View, Text } from "react-native"

export default PrayerToken = ({prayer, prayerTime, currentPrayer}) => {

    console.log(prayer)

    // if(prayer == "Sunrise" || prayer == "Sunset")
    //     return null;

    return (
        <>
            {currentPrayer && (
                <View className="flex items-center flex-row justify-between bg-purpleDark w-full px-4 py-5 rounded-lg">
                    <Text className="text-2xl text-background font-bold">{prayer}</Text>
                    <Text className="text-2xl text-background font-bold">{prayerTime}</Text>
                </View>
            )}
            {!currentPrayer && (
                <View className="flex items-center flex-row justify-between bg-purpleDark/75 w-full px-4 py-5 rounded-lg">
                    <Text className="text-2xl text-background/50 font-bold">{prayer}</Text>
                    <Text className="text-2xl text-background/50 font-bold">{prayerTime}</Text>
                </View>
            )}
        </>
    )
}