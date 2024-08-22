import { Alert, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect } from 'react'
import { theme } from '@/constants/theme'
import { hp, stripHtmlTags, wp } from '@/helpers/common'
import Avatar from './Avatar'
import moment from 'moment'
import Icon from '@/assets/icons'
import RenderHtml from 'react-native-render-html';
import { Image } from 'expo-image'
import { downloadFile, getSupabaseFileUrl } from '@/services/ImageService'
import { createPostLike, removePostLike } from '@/services/PostService'
import { Video } from "expo-av"
import Loading from './Loading'

const textStyle = {
    color: theme.colors.dark,
    fontSize: hp(1.75),
}

const tagsStyles = {
    div: textStyle,
    p: textStyle,
    ol: textStyle,
    h1: {
        color: theme.colors.dark,
    },
    h4: {
        color: theme.colors.dark,
    }
}

const PostCard = ({ item, currentUser, router, hasShadow = true }) => {

    const [likes, setLikes] = React.useState([])
    const [loading, setLoading] = React.useState(false)

    useEffect(() => {
        setLikes(item?.postLikes)
    }, [])

    const shadowStyle = {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 1,
    }

    const createdAt = moment(item?.created_at).format("MMM D")

    const openPostDetails = () => {
        router.push({pathname:"/post-details",params:{postId:item.id}})
    }

    const onLikePress = async () => {
        if (liked) {
            setLikes(likes.filter((like) => like.userId !== currentUser?.id))
            let res = await removePostLike(item.id, currentUser?.id)
            console.log("🚀 ~ onLikePress ~ res:", res)
            if (!res.success) {
                Alert.alert("Post", "Something went wrong, please try again later")
            }
        }
        else {
            let data = {
                userId: currentUser?.id,
                postId: item.id
            }
            setLikes([...likes, data])
            let res = await createPostLike(data)
            console.log("🚀 ~ onLikePress ~ res:", res)

            if (!res.success) {
                Alert.alert("Post", "Something went wrong, please try again later")
            }
        }
    }

    const onSharePress = async () => {
        let content = { message: stripHtmlTags(item?.body) }
        if (item?.file) {
            setLoading(true)
            // download and share url
            const url = await downloadFile(getSupabaseFileUrl(item?.file).uri)
            setLoading(false)
            content.url = url
        }
        let res = await Share.share(content)
    }

    const liked = likes.filter((like) => like.userId === currentUser?.id).length > 0;
    return (
        <View style={[styles.container, hasShadow && shadowStyle]}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Avatar uri={item?.user?.image} size={hp(4.5)} rounded={theme.radius.md} />

                    <View style={{ gap: 2 }}>
                        <Text style={styles.username}>{item?.user?.name}</Text>
                        <Text style={styles.postTime}>{createdAt}</Text>
                    </View>
                </View>

                <TouchableOpacity onPress={openPostDetails}>
                    <Icon name="threeDotsHorizontal" color={theme.colors.text} strokeWidth={3} size={hp(3.4)} />
                </TouchableOpacity>
            </View>

            {/* Post body */}
            <View style={styles.content}>
                <View style={styles.postBody}>
                    {item?.body
                        && <RenderHtml
                            contentWidth={wp(100)}
                            source={{
                                html: item?.body
                            }}
                            tagsStyles={tagsStyles}
                        />
                    }
                </View>

                {/* Post image */}
                {
                    item.file && item?.file?.includes('postImages') && (
                        <Image
                            source={getSupabaseFileUrl(item.file)}
                            transition={100}
                            contentFit='cover'
                            style={styles.postMedia} />
                    )
                }

                {/* Post video */}
                {
                    item.file && item?.file?.includes('postVideos') && (
                        <Video
                            source={getSupabaseFileUrl(item.file)}
                            transition={100}
                            contentFit='cover'
                            useNativeControls
                            isLooping
                            style={[styles.postMedia, { height: hp(30) }]} />
                    )
                }
            </View>

            {/* Like, comment, share */}
            <View style={styles.footer}>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={onLikePress}>
                        <Icon name="heart" fill={liked ? theme.colors.rose : "transparent"} color={liked ? theme.colors.rose : theme.colors.textLight} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.count}>{likes?.length}</Text>
                </View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={openPostDetails}>
                        <Icon name="comment" color={theme.colors.textLight} size={24} />
                    </TouchableOpacity>
                    <Text style={styles.count}>0</Text>
                </View>
                <View style={styles.footerButton}>
                    {loading ? (<Loading size='small' /> ):

                        (<TouchableOpacity onPress={onSharePress}>
                            <Icon name="share" color={theme.colors.textLight} size={24} />
                        </TouchableOpacity>)}
                </View>
            </View>
        </View>
    )
}

export default PostCard

const styles = StyleSheet.create({
    container: {
        gap: 10,
        marginBottom: 15,
        borderRadius: theme.radius.xxl * 1.1,
        borderCurve: "continuous",
        padding: 10,
        paddingVertical: 12,
        backgroundColor: "white",
        borderWidth: 0.5,
        borderColor: theme.colors.gray,
        shadowColor: "#000",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    username: {
        color: theme.colors.textDark,
        fontWeight: theme.fonts.medium,
        fontSize: hp(1.7)
    },
    postTime: {
        color: theme.colors.textLight,
        fontSize: hp(1.4),
        fontWeight: theme.fonts.medium,
    },
    content: {
        // marginBottom: 10,
        gap: 10
    },
    postMedia: {
        height: hp(40),
        width: "100%",
        borderRadius: theme.radius.xl,
        borderCurve: "continuous",
    },
    postBody: {
        marginLeft: 5,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15
    },
    footerButton: {
        marginLeft: 5,
        flexDirection: "row",
        alignItems: "center",
        gap: 4
    },
    actions: {
        flexDirection: "row",
        gap: 18,
        alignItems: "center",
    },
    count: {
        color: theme.colors.text,
        fontSize: hp(1.8)
    },
})