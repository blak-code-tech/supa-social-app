import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef, useState } from 'react'
import Header from '../../components/Header'
import ScreenWrapper from '../../components/ScreenWrapper'
import { hp, wp } from '../../helpers/common'
import Avatar from '../../components/Avatar'
import { theme } from '../../constants/theme'
import { useAuth } from '../../contexts/AuthContext'
import RichTextEditor from '../../components/RichTextEditor'
import { useRouter } from 'expo-router'
import Icon from '../../assets/icons'
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/Button'
import { Image } from 'expo-image'
import { getSupabaseFileUrl } from '../../services/ImageService'
import { Video } from 'expo-av';
import { createUpdatePost } from '../../services/PostService'

const NewPost = () => {
  const { user } = useAuth()
  const bodyRef = useRef("");
  const editorRef = useRef(null);
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [file, setFile] = useState(null)

  const onPick = async (isImage) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isImage ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setFile(result.assets[0])
    }
  }

  const onSubmit = async () => {
    if (!bodyRef.current && !file) {
      Alert.alert("New Post", "Please choose an media or write a body!")
      return
    }

    let data = {
      body: bodyRef.current,
      userId: user.id,
      file
    }

    setIsLoading(true)
    // Create or update post
    const res = await createUpdatePost(data)
    setIsLoading(false)
    if (res.success) {
      setFile(null)
      bodyRef.current = ""
      editorRef.current?.setContentHTML('')
      router.back()
    }
    else {
      Alert.alert("New Post", res.msg)
    }

  }

  const isLoacalFile = (file) => {
    if (!file) {
      return null
    }

    if (typeof file === "object") return true

    return false
  }


  const getFileType = (file) => {
    if (!file) {
      return null
    }

    if (isLoacalFile(file)) {
      return file.type
    }

    if (file?.type.includes("postImages")) {
      return "image"
    } else if (file?.type.includes("postVideos")) {
      return "video"
    }
  }

  const getFileURI = (file) => {
    if (!file) {
      return null
    }

    if (isLoacalFile(file)) {
      return file.uri
    }

    return getSupabaseFileUrl(file).uri
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScreenWrapper bg={"white"}>
        <View style={styles.container}>
          <Header title="New Post" />
          <ScrollView contentContainerStyle={{ gap: 20 }}>
            {/* avatar */}
            <View style={styles.header}>
              <Avatar uri={user?.image} size={hp(6.5)} rounded={theme.radius.xl} />

              <View style={{ gap: 2 }}>
                <Text style={styles.username}>{user?.name}</Text>
                <Text style={styles.publicText}>Public</Text>
              </View>
            </View>

            <View style={styles.textEditor}>
              <RichTextEditor editorRef={editorRef} onChangeText={(text) => (bodyRef.current = text)} />
            </View>

            {file && (
              <View style={styles.file}>
                {
                  getFileType(file) === "image" ? (
                    <Image source={{ uri: getFileURI(file) }} contentFit='cover' style={{ flex: 1 }} />
                  ) :
                    (
                      <Video
                        source={{ uri: getFileURI(file) }} style={{ flex: 1 }} useNativeControls resizeMode='cover' isLooping />
                    )
                }

                <Pressable onPress={() => setFile(null)} style={styles.closeIcon}>
                  <Icon name="delete" size={20} color={"white"} />
                </Pressable>
              </View>
            )}

            <View style={styles.media}>
              <Text style={styles.addImageText}>Add to your Post</Text>
              <View style={styles.mediaIcons}>
                <TouchableOpacity onPress={async () => onPick(true)}>
                  <Icon name="image" size={30} color={theme.colors.dark} />
                </TouchableOpacity>
                <TouchableOpacity onPress={async () => onPick(false)}>
                  <Icon name="video" size={33} color={theme.colors.dark} />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <Button
            title="Post"
            buttonStyle={{ height: hp(6.2) }}
            loading={isLoading}
            hasShadow={false}
            onPress={onSubmit} />
        </View>
      </ScreenWrapper>
    </KeyboardAvoidingView>
  )
}

export default NewPost

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 15,
    marginBottom: 30,
    paddingHorizontal: wp(4)
  },
  title: {
    // marginBottom: 10,
    fontSize: hp(2.5),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text,
    textAlign: "center"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12
  },
  username: {
    fontSize: hp(2.2),
    fontWeight: theme.fonts.semibold,
    color: theme.colors.text
  },
  avatar: {
    height: hp(6.5),
    width: hp(6.5),
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)"
  },
  publicText: {
    fontSize: hp(1.7),
    color: theme.colors.textLight,
    fontWeight: theme.fonts.medium
  },
  textEditor: {

  },
  media: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    borderCurve: "continuous"
  },
  mediaIcons: {
    gap: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  addImageText: {
    fontSize: hp(1.9),
    color: theme.colors.text,
    fontWeight: theme.fonts.semibold
  },
  imageIcon: {
    // backgroundColor: theme.colors.gray,
    borderRadius: theme.radius.md,
    // padding: 6,
  },
  file: {
    width: "100%",
    height: hp(30),
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderCurve: "continuous",
  },
  video: {

  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 7,
    borderRadius: 50,
    backgroundColor: "rgba(255,0,0,0.6)",
    // shadowColor: theme.colors.textLight,
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowOpacity: 0.6,
    // shadowRadius: 8,
    // elevation: 4
  }
})