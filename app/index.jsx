import { Button, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { router } from 'expo-router'
import ScreenWrapper from '../components/ScreenWrapper'

const index = () => {
    return (
        <ScreenWrapper>
            <Text>index</Text>
            <Button title='Welcome screen' onPress={() => router.push('/welcome')} />
        </ScreenWrapper>
    )
}

export default index

const styles = StyleSheet.create({})