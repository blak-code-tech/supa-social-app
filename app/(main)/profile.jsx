import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import ScreenWrapper from '../../components/ScreenWrapper'
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from 'expo-router'
import Header from '../../components/Header'
import { hp, wp } from '../../helpers/common'
import Icon from '../../assets/icons'
import { theme } from '../../constants/theme'
import { supabase } from '../../lib/supabase'
import Avatar from "../../components/Avatar"

const Profile = () => {
    const { user, setAuth } = useAuth()

    const router = useRouter()
    const handleLogout = () => {
        Alert.alert("Sign Out", "Are you sure you want to sign out?", [
            {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
            },
            {
                text: "Logout",
                style: "destructive",
                onPress: async () => {
                    const { error } = await supabase.auth.signOut()

                    if (error) {
                        console.log("🚀 ~ onLogout ~ error:", error)
                        Alert.alert("Sign Out", "Failed to sign out")
                    }
                },
            },
        ])

    }

    return (
        <ScreenWrapper bg={"white"}>
            <UserHeader user={user} router={router} handleLogout={handleLogout} />
        </ScreenWrapper>
    )
}

const UserHeader = ({ user, router, handleLogout }) => {

    return (
        <View style={styles.userHeader}>
            <View>
                <Header title="Profile" showBackButton mb={30} />
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Icon name="logout" color={theme.colors.rose} />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={{ gap: 15 }}>
                    <View style={styles.avatarContainer}>
                        <Avatar uri={user?.image} size={hp(12)} rounded={theme.radius.xxl * 1.4} />

                        <Pressable style={styles.editIcon} onPress={() => router.push('/edit-profile')}>
                            <Icon name="edit" color={theme.colors.textLight} strokeWidth={2.5} size={20} />
                        </Pressable>
                    </View>

                    {/* username and address */}
                    <View style={{ alignItems: "center", gap: 4 }}>
                        <Text style={styles.userName}>{user && user?.name}</Text>
                        <Text style={styles.infoText}>{user && user?.address}</Text>
                    </View>

                    {/* email and bio */}
                    <View style={{ gap: 10 }}>
                        <View style={styles.info}>
                            <Icon name={"mail"} color={theme.colors.textLight} size={20} />
                            <Text style={styles.infoText}>{user && user?.email}</Text>
                        </View>
                        {(user && user?.phoneNumber) &&
                            <View style={styles.info}>
                                <Icon name={"call"} color={theme.colors.textLight} size={20} />
                                <Text style={styles.infoText}>{user && user?.phoneNumber}</Text>
                            </View>
                        }
                        {(user && user?.bio) &&
                            <Text style={styles.infoText}>{user && user?.bio}</Text>
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    userHeader: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: wp(4),
    },
    container: {
        flex: 1
    },
    headerContainer: {
        marginHorizontal: wp(4),
        marginBottom: 20
    },
    headerShape: {
        width: wp(100),
        height: hp(20),
    },
    avatarContainer: {
        height: hp(12),
        width: hp(12),
        alignSelf: "center",
    },
    editIcon: {
        position: "absolute",
        bottom: 0,
        right: -12,
        padding: 7,
        borderRadius: 50,
        backgroundColor: 'white',
        shadowColor: theme.colors.textLight,
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 7,
    },
    userName: {
        fontSize: hp(3),
        fontWeight: theme.fonts.medium,
        color: theme.colors.text
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10
    },
    infoText: {
        fontSize: hp(1.6),
        fontWeight: '500',
        color: theme.colors.textLight
    },
    logoutButton: {
        position: "absolute",
        right: 0,
        padding: 5,
        borderRadius: theme.radius.sm,
        backgroundColor: "#fee2e2",
    },
    listStyle: {
        paddingHorizontal: wp(4),
        paddingBottom: 30
    },
    noPosts: {
        fontSize: hp(2),
        textAlign: "center",
        color: theme.colors.text
    }

})