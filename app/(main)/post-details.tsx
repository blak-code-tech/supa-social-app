import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams } from 'expo-router'

const PostDetails = () => {
    const { postId } = useLocalSearchParams()
    console.log("🚀 ~ PostDetails ~ postId:", postId)
    return (
        <ScreenWrapper bg={"white"}>
            <Text>PostDetails</Text>
        </ScreenWrapper>
    )
}

export default PostDetails

const styles = StyleSheet.create({})