import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { hp } from '../helpers/common'
import { theme } from '../constants/theme'

const Input = (props) => {
    return (
        <View style={[styles.container, props.containerStyle && props.containerStyle]}>
            {
                props.icon && props.icon
            }

            <TextInput
                style={[styles.input, props.inputStyles && props.inputStyles]}
                placeholderTextColor={theme.colors.textLight}
                ref={props.inputRef && props.inputRef}
                {...props} />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: hp(7.2),
        borderWidth: 0.4,
        borderRadius: theme.radius.xxl,
        borderCurve: "continuous",
        borderColor: theme.colors.text,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 18,
        flexDirection: "row",
        gap:12,
    },
    input: {
        flex: 1,
    }
})