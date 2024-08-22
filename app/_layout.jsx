import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { getUserData } from '../services/UserService'
import { LogBox } from 'react-native'


LogBox.ignoreLogs(['Warning: TNodeChildrenRenderer:', 'Warning: MemoizedTNodeRenderer:', 'Warning: TRenderEngineProvider:']);

const _layout = () => {
    return (
        <AuthProvider>
            <MainLayout />
        </AuthProvider>
    )
}

const MainLayout = () => {
    const { setAuth,setUserData } = useAuth();
    const router = useRouter()
    useEffect(() => {
        // supabase.auth.getSession().then(({ data: { session } }) => {
        //     setAuth(session)
        // })

        supabase.auth.onAuthStateChange((_event, session) => {
            console.log("user session: ", session?.user?.id)
            
            if (session) {
                setAuth(session.user)
                updateUserData(session.user)
                router.replace('/home')
            }
            else {
                setAuth(null)
                router.replace('/welcome')
            }
        })
    }, [])

    const updateUserData = async (user) => {
        let res = await getUserData(user?.id)
        if (res.success) setUserData(res.data)
     }

    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >

            <Stack.Screen name="(main)/post-details" options={{presentation: 'modal'}}/>

        </Stack>
    )
}

export default _layout