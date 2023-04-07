/* eslint-disable prettier/prettier */
import React,{useState,useEffect} from 'react';
import {
    View,
    SafeAreaView,
    TextInput,
    TouchableOpacity,
    Image,
    Keyboard,
    Platform,
    StyleSheet
} from 'react-native';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';

const ChatInputGroup = (props) => {
    const [message, setMessage] = useState('')
    const onPressSend = () => {
        const { onPressSend } = props;
        onPressSend(message);
        Keyboard.dismiss();
        setMessage('');
    };
    const onEndEditing = () => {
        Keyboard.dismiss();
        const { onEndEditing } = props;
        onEndEditing();
    };

    const onFocus = () => {
        const { onFocus } = props;
        onFocus();
    };

    const onChangeMessageText = (text) => (setMessage(text));

    const renderContent = () => {
        return (
            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Comment input"
                    underlineColorAndroid="transparent"
                    onChangeText={onChangeMessageText}
                    value={message}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onEndEditing={onEndEditing}
                    onFocus={onFocus}
                />
                <TouchableOpacity
                    style={styles.wrapIconSend}
                    onPress={onPressSend}
                    activeOpacity={0.6}
                >
                    <Image source={require('../../assets/ico_send.png')} style={styles.iconSend} />
                </TouchableOpacity>
            </View>
        );
    }
    if (Platform.OS === 'android') {
        return <SafeAreaView style={styles.wrapper}>{renderContent()}</SafeAreaView>;
    }
    return (
        <SafeAreaView style={styles.wrapper}>
            <View style={styles.flex1}>
                <KeyboardAccessory backgroundColor="transparent">
                    {renderContent()}
                </KeyboardAccessory>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        marginHorizontal: 15,
    },
    flex1: {
        flex: 1,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
    },
    col: {
        flex: 1,
        flexDirection: 'column',
    },
    textInput: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 45,
    },
    wrapIconHeart: {
        width: 45,
        height: 45,
        borderRadius: 45,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
        zIndex: 2,
    },
    iconHeart: {
        width: 45,
        height: 45,
        zIndex: 2,
    },
    wrapIconSend: {
        width: 45,
        height: 45,
        borderRadius: 45,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    iconSend: {
        width: 33,
        height: 33,
    },
    iconCancel: {
        width: 20,
        height: 20,
        tintColor: 'white',
    },
});
export default ChatInputGroup