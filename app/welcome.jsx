import { View, Text, StyleSheet, Image, Pressable } from 'react-native'
import React from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import { StatusBar } from 'expo-status-bar'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Button from '../components/Button'
import { useRouter } from 'expo-router'

const Welcome = () => {
    const router = useRouter()
    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.conatainer}>
                {/* welcome image */}
                <Image source={require("../assets/images/welcome.png")} resizeMode='contain' style={styles.welcomeImage} />

                {/* Title */}
                <View style={{ gap: 20 }}>
                    <Text style={styles.title}>
                        Linkup!
                    </Text>
                    <Text style={styles.punchline}>
                        Where every thought finds a home and every image tells a story.
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Button title="Getting Started"
                        buttonStyle={{ marginHorizontal: wp(3) }}
                        onPress={() => router.push('/signup')} />

                    <View style={styles.bottomTextContainer}>
                        <Text style={styles.loginText}>Already have an account?</Text>
                        <Pressable onPress={() => router.push('/login')}>
                            <Text style={[styles.loginText, { color: theme.colors.primary,fontWeight:theme.fonts.semibold }]}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

const styles = StyleSheet.create({
    conatainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-around",
        backgroundColor: "white",
        paddingHorizontal: wp(4),

    },
    welcomeImage: {
        width: wp(100),
        height: hp(30),
        alignSelf: 'center'
    },
    title: {
        fontSize: hp(4),
        fontWeight: theme.fonts.extrabold,
        color: theme.colors.text,
        textAlign: 'center'
    },
    punchline: {
        color: theme.colors.text,
        fontSize: hp(1.7),
        textAlign: 'center',
        paddingHorizontal: wp(10)
    },
    footer: {
        gap: 30,
        width: wp(100),
    },
    bottomTextContainer: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    loginText: {
        textAlign:'center',
        color: theme.colors.text,
        fontSize: hp(1.6),
    }
})

export default Welcome