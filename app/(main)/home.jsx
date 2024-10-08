import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { hp, wp } from '@/helpers/common'
import { theme } from '@/constants/theme'
import Icon from '../../assets/icons'
import { useRouter } from 'expo-router'
import Avatar from '../../components/Avatar'
import { fetchPosts } from '../../services/PostService'
import PostCard from '../../components/PostCard'
import Loading from '../../components/Loading'
import { supabase } from '@/lib/supabase'
import { getUserData } from "../../services/UserService"

let limit = 0;
const Home = () => {
    const { setAuth, user } = useAuth()
    const router = useRouter()

    const [posts, setPosts] = React.useState([])
    const [hasMore, setHasMore] = React.useState(true)

    const handleNewComment = async (payload) => {
        console.log("🚀 ~ handleNewComment ~ payload:", payload)
        if (payload.new) {
            let newComment = { ...payload.new }

            let res = await getUserData(newComment?.userId)

            newComment.user = res.success ? res.data : {}

            setPosts((prev) => prev.find((post) => post.id === newComment.postId).comments[0].count += 1)
        }
    }

    const handlePostEvent = async (payload) => {
        console.log("🚀 ~ handlePostEvent ~ payload:", payload)
        if (payload.eventType === 'INSERT' && payload?.new?.id) {
            let newPost = { ...payload.new }
            let res = await getUserData(newPost?.userId)
            newPost.user = res.success ? res.data : {}
            newPost.comments = [{ count: 0 }]
            newPost.postLikes = []
            setPosts((prev) => [newPost, ...prev])
            getPosts()
        }
    }

    React.useEffect(() => {
        let postChannel = supabase
            .channel('posts')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handlePostEvent)
            .subscribe();
        
        let commentsChannel = supabase
            .channel('comments')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'comments'
            }, handleNewComment)
            .subscribe();
        
        // getPosts()

        return () => {
            supabase.removeAllChannels([postChannel, commentsChannel])
        }
    }, [])

    const getPosts = async () => {
        if (!hasMore) return null
        limit = limit + 4
        let res = await fetchPosts(limit)

        if (res.success) {
            if (posts.length === res.data.length) setHasMore(false)
            setPosts(res.data)
        }
    }

    return (
        <ScreenWrapper bg={"white"}>
            <View style={styles.container}>
                {/* header */}
                <View style={styles.header}>
                    <Text style={styles.title}>LinkUp</Text>
                    {/* <Button title="Logout" onPress={onLogout} /> */}
                    <View style={styles.icons}>
                        <Pressable onPress={() => router.push('/notifications')}>
                            <Icon name="heart" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                        <Pressable onPress={() => router.push('/new-post')}>
                            <Icon name="plus" size={hp(3.2)} strokeWidth={2} color={theme.colors.text} />
                        </Pressable>
                        <Pressable onPress={() => router.push('/profile')}>
                            <Avatar uri={user?.image} size={hp(4.3)} rounded={theme.radius.sm} style={{ borderWidth: 2 }} />
                        </Pressable>
                    </View>
                </View>

                <FlatList
                    data={posts}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.listStyle}
                    keyExtractor={item => item.id.toString()}
                    onEndReached={() => getPosts()}
                    onEndReachedThreshold={0}
                    renderItem={({ item }) => <PostCard item={item} currentUser={user} router={router} />}
                    ListFooterComponent={() => hasMore ? (
                        <View style={{ marginVertical: posts.length === 0 ? 200 : 30 }}>
                            <Loading />
                        </View>
                    ) :
                        (
                            <View style={{ marginVertical: 30 }}>
                                <Text style={styles.noPosts}>No more posts</Text>
                            </View>
                        )}
                />
            </View>
        </ScreenWrapper>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: wp(4),
        marginBottom: 10
    },
    title: {
        color: theme.colors.text,
        fontWeight: theme.fonts.bold,
        fontSize: hp(3.2)
    },
    avatarImage: {
        height: hp(4.3),
        width: hp(4.3),
        borderRadius: theme.radius.sm,
        borderCurve: "continuous",
        borderBottomColor: theme.colors.gray,
        borderWidth: 3
    },
    listStyle: {
        paddingTop: 20,
        paddingHorizontal: wp(4)
    },
    icons: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 18
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.text
    },
    pill: {
        position: "absolute",
        right: -10,
        top: -4,
        height: hp(2.2),
        width: hp(2.2),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 20,
        backgroundColor: theme.colors.roseLight
    },
    pillText: {
        color: "white",
        fontSize: hp(1.2),
        fontWeight: theme.fonts.bold
    }
})