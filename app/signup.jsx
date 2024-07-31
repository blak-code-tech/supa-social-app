import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useRef, useState } from 'react'
import ScreenWrapper from '../components/ScreenWrapper'
import BackButton from '../components/BackButton'
import { StatusBar } from 'expo-status-bar'
import { useRouter } from 'expo-router'
import { hp, wp } from '../helpers/common'
import { theme } from '../constants/theme'
import Input from '../components/Input'
import Icon from '../assets/icons'
import Button from '../components/Button'

const SignUp = () => {
    const router = useRouter()
    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)

    const onSubmit = () => {
        if (!emailRef.current || !passwordRef.current || !nameRef.current) {
            Alert.alert('Sign Up', 'Please fill all the fields!')
            return
        }
        setLoading(true)

        setTimeout(() => {
            setLoading(false)
            router.push('/home')
        }, 2000)
    }

    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                {/* Welcome */}
                <View>
                    <Text style={styles.welcomeText}>Let's</Text>
                    <Text style={styles.welcomeText}>Get Started!</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>Please enter the details to create a new account</Text>

                    <Input
                        placeholder="Enter your name"
                        onChangeText={(value) => emailRef.current = value}
                        icon={<Icon name={'mail'} size={26} strokeWidth={1.6} />} />
                    
                    <Input
                        placeholder="Enter your email"
                        onChangeText={(value) => emailRef.current = value}
                        icon={<Icon name={'mail'} size={26} strokeWidth={1.6} />} />

                    <Input
                        placeholder="Enter your password"
                        onChangeText={(value) => passwordRef.current = value}
                        secureTextEntry
                        icon={<Icon name={'lock'} size={26} strokeWidth={1.6} />} />

                    <Text style={styles.forgotPassword}>Forgot Password?</Text>

                    {/* Button */}
                    <Button title="Sign up" loading={loading} onPress={onSubmit} />

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account?</Text>
                        <Pressable onPress={() => router.push('/login')} >
                            <Text style={[styles.footerText, { color: theme.colors.primary, fontWeight: theme.fonts.semibold }]}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default SignUp

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 45,
        paddingHorizontal: wp(5)
    },
    welcomeText: {
        fontSize: hp(4),
        fontWeight: theme.fonts.bold,
        color: theme.colors.text,
    },
    form: {
        gap: 25
    },
    forgotPassword: {
        textAlign: "right",
        color: theme.colors.text,
        fontWeight: theme.fonts.semibold
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5
    },
    footerText: {
        textAlign: "center",
        color: theme.colors.text,
        fontSize: hp(1.6),
    }
})