import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor'
import { theme } from '../constants/theme'

const RichTextEditor = ({ editorRef, onChangeText }) => {
    return (
        <View style={{ minHeight: 285 }}>
            <RichToolbar
                actions={[
                    actions.setStrikethrough,
                    actions.removeFormat,
                    actions.setBold,
                    actions.setItalic,
                    actions.insertOrderedList,
                    actions.blockquote,
                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,
                    actions.code,
                    actions.line,
                    actions.heading1,
                    actions.heading4,
                    actions.undo,
                    actions.redo,
                ]}
                iconMap={{
                    [actions.heading1]: ({ tintColor }) => (
                        <Text style={[{ color: tintColor }]}>H1</Text>
                    ),
                    [actions.heading4]: ({ tintColor }) => (
                        <Text style={[{ color: tintColor }]}>H4</Text>
                    ),
                }}
                style={styles.richBar}
                selectedIconTint={theme.colors.primary}
                flatContainerStyle={styles.flatStyle}
                editor={editorRef}
                disabled={false}
            />

            <RichEditor
                ref={editorRef}
                editorStyle={styles.contentStyle}
                containerStyle={styles.rich}
                placeholder="What's on your mind?"
                onChange={onChangeText}
            />
        </View>
    )
}

export default RichTextEditor

const styles = StyleSheet.create({
    richBar: {
        backgroundColor: theme.colors.gray,
        borderTopRightRadius: theme.radius.xl,
        borderTopLeftRadius: theme.radius.xl,
    },
    flatStyle: {
        paddingHorizontal: 8,
        gap: 3,
    },
    rich: {
        minHeight: 240,
        flex: 1,
        borderWidth: 1.5,
        borderTopWidth: 0,
        padding: 5,
        borderBottomLeftRadius: theme.radius.xl,
        borderBottomRightRadius: theme.radius.xl,
        borderColor: theme.colors.gray,
    },
    contentStyle: {
        color: theme.colors.text,
        placeholderColor:"gray"
    }
})