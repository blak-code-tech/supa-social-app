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
import { supabase } from '../lib/supabase'

const Login = () => {
    const router = useRouter()
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)

    const onSubmit = async () => {
        if (!emailRef.current || !passwordRef.current) {
            Alert.alert('Login', 'Please fill all the fields!')
            return
        }

        // trim fields
        let email = emailRef.current.trim()
        let password = passwordRef.current.trim()

        setLoading(true)

        const {error } = await supabase.auth.signInWithPassword({ email, password })
        console.log("🚀 ~ onSubmit ~ error:", error)

        setLoading(false)

        if(error) {
            Alert.alert('Login', error.message)
            return
        }
    }

    return (
        <ScreenWrapper bg={"white"}>
            <StatusBar style="dark" />
            <View style={styles.container}>
                <BackButton router={router} />

                {/* Welcome */}
                <View>
                    <Text style={styles.welcomeText}>Hey,</Text>
                    <Text style={styles.welcomeText}>Welcome back!</Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    <Text style={{ fontSize: hp(1.5), color: theme.colors.text }}>Please login to continue</Text>

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
                    <Button title="Login" loading={loading} onPress={onSubmit} />

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account?</Text>
                        <Pressable onPress={() => router.push('/signup')} >
                            <Text style={[styles.footerText, { color: theme.colors.primary, fontWeight: theme.fonts.semibold }]}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScreenWrapper>
    )
}

export default Login

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