import { supabase } from "../lib/supabase"

export const getUserData = async (id) => {
    try {
        const { data, error } = await supabase
            .from("users")
            .select()
            .eq("id", id)
            .single()
        
        if (error) {
            console.log("🚀 ~ getUserData ~ error:", error)
            return { success: false, msg: error.message }
        }
        return { success: true, data }

    } catch (error) {
        console.log("🚀 ~ getUserData ~ error:", error)
        return { success: false, msg: error.message }
    }
}