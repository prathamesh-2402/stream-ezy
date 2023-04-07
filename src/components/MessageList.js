import React, { Component } from 'react';
import { View, FlatList, StyleSheet,Dimensions } from 'react-native';
import MessageItem from './MessageItem';
const { width: screenWidth } = Dimensions.get('window');

const MessagesList = (props) => {
    const renderItem = ({ item }) => <MessageItem data={item} />;
    const { messages } = props;

    return (
        <View style={styles.wrapListMessages}>
            <FlatList data={messages.reverse()} renderItem={renderItem} inverted />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapListMessages: {
        position: 'absolute',
        bottom: 100,
        left: 0,
        right: 0,
        height: screenWidth / 1.5,
        width: screenWidth,
        zIndex: 2,
    },
});

export default MessagesList;
