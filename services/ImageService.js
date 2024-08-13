import * as FileSystem from 'expo-file-system';
import { decode } from "base64-arraybuffer";
import { supabase } from '@/lib/supabase';

export const getUserImageSource = (imagePath) => {
    if (imagePath) {
        return getSupabaseFileUrl(imagePath)
    } else {
        return require('../assets/images/defaultUser.png')
    }
}

export const getSupabaseFileUrl = (path) => {
    if (path) { 
        return {uri: `${process.env.EXPO_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/${path}`}
    }

    return null
}

export const uploadFile = async (folderName, fileUri, isImage = true) => {
    try {
        let fileName = getFilePath(folderName, isImage)
        const fileBase64 = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 })
        let imageData = decode(fileBase64)

        const { data, error } = await supabase
            .storage
            .from("uploads")
            .upload(fileName, imageData, {
                contentType: isImage ? 'image/*' : 'video/*',
                cacheControl: '3600',
                upsert: false
            })
        if (error) {
            console.log("🚀 ~ uploadFile ~ error:", error)
            return { success: false, msg: "Could not upload media" }
        }

        return { success: true, data: data.path }

    } catch (error) {
        console.log("🚀 ~ uploadFile ~ error:", error)
        return { success: false, msg: "Could not upload media" }
    }
}

export const getFilePath = (folderName, isImage = true) => {
    return `${folderName}/${(new Date()).getTime()}${isImage ? ".png" : ".mp4"}`
}