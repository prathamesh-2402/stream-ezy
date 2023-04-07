/* eslint-disable prettier/prettier */
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LIVE_STATUS } from '../utils/constants';

const LiveStreamActionButton = ({ currentLiveStatus, onPress }) => {
    let backgroundColor = '#9b59b6';
    let text = 'Start live video';
    if (Number(currentLiveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
        backgroundColor = '#e74c3c';
        text = 'Stop live stream';
    }
    return (
        <TouchableOpacity onPress={onPress} style={[styles.btnBeginLiveStream, { backgroundColor }]}>
            <Text style={styles.beginLiveStreamText}>{text}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btnBeginLiveStream: {
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        paddingVertical: 5,
    },
    beginLiveStreamText: {
        fontSize: 20,
        fontWeight: '600',
        color: 'white',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
export default LiveStreamActionButton;
