import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { createComment, fetchPostDetails, removeComment } from '@/services/PostService'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import PostCard from '@/components/PostCard'
import { useAuth } from '@/contexts/AuthContext'
import Loading from '@/components/Loading'
import Input from '@/components/Input'
import Icon from '@/assets/icons'
import CommentItem from '@/components/CommentItem'
import { supabase } from '@/lib/supabase'
import { getUserData } from '@/services/UserService'

const PostDetails = () => {
    const { postId } = useLocalSearchParams()
    const [post, setPost] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [startLoading, setStartLoading] = React.useState(true)
    const router = useRouter()
    const inputRef = useRef(null)
    const commentRef = useRef('')

    const { user } = useAuth();

    const handleNewComment = async (payload) => {

        if (payload.new) {
            let newComment = { ...payload.new }

            let res = await getUserData(newComment?.userId)

            newComment.user = res.success ? res.data : {}

            setPost((prev) => ({ ...prev, comments: [newComment, ...prev?.comments] }))
        }
    }

    useEffect(() => {
        let commentsChannel = supabase
            .channel('comments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments',
                fitler: `postId=eq.${postId}`
            }, handleNewComment)
            .subscribe();

        getPostDetails()

        return () => {
            supabase.removeChannel(commentsChannel)
        }
    }, [])

    const getPostDetails = async () => {
        const res = await fetchPostDetails(postId)

        if (res.success) setPost(res.data)
        setStartLoading(false)
    }

    const onNewCommnet = async (comment) => {
        if (!commentRef.current) return null

        let data = {
            userId: user.id,
            postId: post?.id,
            text: commentRef.current
        }

        setLoading(true)
        let res = await createComment(data)
        setLoading(false)
        if (res.success) {
            // Send notification later
            inputRef.current?.clear()
            commentRef.current = ''
            getPostDetails()
        }
        else {
            Alert.alert("Comment", res.msg)
        }
    }

    const onDeleteComment = async (comment) => {
        console.log("🚀 ~ onDeleteComment ~ comment:", comment)

        let res = await removeComment(comment.id)

        if (res.success) {
            setPost((prev) => ({ ...prev, comments: prev?.comments?.filter((c) => c.id !== comment.id) }))
        }
        else {
            Alert.alert("Comment", res.msg)
        }
    }

    if (startLoading) return (
        <View style={styles.center}>
            <Loading />
        </View>
    )

    if (!post) return (
        <View style={[styles.center, { justifyContent: "flex-start", marginTop: 100 }]}>
            <Text style={styles.notFound}>Post not found</Text>
        </View>
    )

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
            <View style={styles.container}>
                <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
                    <PostCard item={{ ...post, comments: [{ count: post?.comments?.length }] }} currentUser={user} router={router} hasShadow={false} showMoreIcon={false} />

                    <View style={styles.inputContainer}>
                        <Input placeholder="Write a comment..."
                            inputRef={inputRef}
                            onChangeText={(text) => commentRef.current = text}
                            placeholderTextColor={theme.colors.text}
                            containerStyle={{ flex: 1, height: hp(6.2), borderRadius: theme.radius.xl }} />

                        {loading ?
                            <View style={styles.loading}>
                                <Loading size='small' />
                            </View>
                            :
                            <TouchableOpacity style={styles.sendIcon} onPress={onNewCommnet}>
                                <Icon name="send" color={theme.colors.primaryDark} />
                            </TouchableOpacity>
                        }
                    </View>

                    <View style={{ marginVertical: 15, gap: 17 }}>
                        {
                            post?.comments?.map((comment, index) => (
                                <CommentItem
                                    key={comment.id.toString()}
                                    canDelete={user?.id === comment?.userId || user.id === post?.userId}
                                    onDelete={onDeleteComment}
                                    item={comment} />
                            ))
                        }
                        {
                            post?.comments.length === 0 && <Text style={{
                                color: theme.colors.text,
                                marginLeft: 5
                            }}>Be first to comment!</Text>
                        }
                    </View>
                </ScrollView >
            </View >
        </KeyboardAvoidingView>
    )
}

export default PostDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: wp(7)
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    list: {
        paddingHorizontal: wp(4)
    },
    sendIcon: {
        justifyContent: "center",
        alignItems: "center",
        height: hp(5.8),
        width: hp(5.8),
        borderCurve: "continuous",
        borderRadius: theme.radius.lg,
        borderColor: theme.colors.primary,
        borderWidth: 0.8,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    notFound: {
        fontSize: hp(2.5),
        color: theme.colors.text,
        fontWeight: theme.fonts.medium,
    },
    loading: {
        height: hp(5.8),
        width: hp(5.8),
        justifyContent: "center",
        alignItems: "center",
        transform: [{ scale: 1.3 }]
    }
})
