import React from 'react';
import { Text, View, Image, StyleSheet } from 'react-native';

const MessageItem = ({ data }) => {
    const { userName, message } = data;
    return (
        <View style={styles.chatItem}>
            <View>
                <Image source={require('../../assets/avatar_1.png')} style={styles.avatar} />
            </View>
            <View style={styles.messageItem}>
                <Text style={styles.name}>{userName}</Text>
                <Text style={styles.content}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    chatItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        marginVertical: 5,
    },
    messageItem: {
        flexDirection: 'column',
        marginHorizontal: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    avatar: {
        width: 45,
        height: 45,
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
    },
    content: {
        fontSize: 14,
        fontWeight: '500',
        marginTop: 3,
    },
});

export default MessageItem;
