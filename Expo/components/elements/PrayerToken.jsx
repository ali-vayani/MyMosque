import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default PrayerToken = ({ prayer, prayerTime, currentPrayer }) => {

    return (
        <>
            {currentPrayer && (
                <View style={styles.currentPrayerContainer}>
                    <Text style={styles.currentPrayerText}>{prayer}</Text>
                    <Text style={styles.currentPrayerText}>{prayerTime}</Text>
                </View>
            )}
            {!currentPrayer && (
                <View style={styles.nonCurrentPrayerContainer}>
                    <Text style={styles.nonCurrentPrayerText}>{prayer}</Text>
                    <Text style={styles.nonCurrentPrayerText}>{prayerTime}</Text>
                </View>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    currentPrayerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#443666", // Dark purple hex color
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    nonCurrentPrayerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#443666CC", // Dark purple with 75% opacity
        width: "100%",
        paddingVertical: 16,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    currentPrayerText: {
        fontSize: 24,
        color: "#FFFFFF", // Fully opaque white text
        fontWeight: "bold",
    },
    nonCurrentPrayerText: {
        fontSize: 24,
        color: "#FFFFFF80", // White text with 50% opacity
        fontWeight: "bold",
    },
});
