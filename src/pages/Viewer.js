/* eslint-disable prettier/prettier */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View, Image, TouchableOpacity, Text, SafeAreaView, Animated, Alert, StyleSheet, Dimensions } from 'react-native';
import get from 'lodash/get';
import { NodePlayerView } from 'react-native-nodemediaclient';
import moment from 'moment';
import SocketManager from '../socketManager';

import ChatInputGroup from '../components/ChatInputGroup';
import MessagesList from '../components/MessageList';
import { LIVE_STATUS } from '../utils/constants';

import { RTMP_SERVER } from '../config'

const Viewer = (props) => {
    const { route } = props;
    let nodePlayerView = null;
    const data = get(route, 'params.data');
    const userName = get(route, 'params.userName', '');
    const roomName = get(data, 'roomName');
    const liveStatus = get(data, 'liveStatus', LIVE_STATUS.PREPARE);
    let timeout = null;

    const [state, setState] = useState({
        messages: [],
        // countHeart: 0,
        isVisibleMessages: true,
        inputUrl: null,
    });
    const [url,setUrl ] = useState(null)

    useEffect(() => {
        const { navigation } = props;

        setState({
            ...state,
            inputUrl: `${RTMP_SERVER}/live/${roomName}`,
            messages: state.messages,
        });
        setUrl(`${RTMP_SERVER}/live/${roomName}`)
        SocketManager.instance.emitJoinRoom({
            userName: userName,
            roomName: roomName,
        });
        SocketManager.instance.listenSendMessage((data) => {
            const messages = get(data, 'messages', []);
            setState({ ...state, messages });
        });
        SocketManager.instance.listenFinishLiveStream(() => {
            Alert.alert(
                'Alert ',
                'Thanks for watching live stream',
                [
                    {
                        text: 'Okay',
                        onPress: () => navigation.goBack(),
                    },
                ],
                { cancelable: false }
            );
        });


        return () => {
            if (nodePlayerView) nodePlayerView.stop();
            SocketManager.instance.emitLeaveRoom({
                userName: userName,
                roomName: roomName,
            });
            setState({
                messages: [],
                countHeart: 0,
                isVisibleMessages: true,
                inputUrl: null,
            });
            clearTimeout(timeout);
        }
    }, [])

    console.log('Input URL ->', state?.inputUrl)

    const onPressSend = (message) => {
        SocketManager.instance.emitSendMessage({
            roomName: roomName,
            userName: userName,
            message,
        });
        setState(prevState => { return { ...prevState, inputUrl: `${RTMP_SERVER}/live/${roomName}`, isVisibleMessages: true }; });
    };

    const onEndEditing = () => setState({ ...state, isVisibleMessages: true });

    const onFocusChatGroup = () => {
        setState({ ...state, isVisibleMessages: false });
    };

    const onPressClose = () => {
        const { navigation } = props;
        navigation.goBack();
    };

    const renderBackgroundColors = () => {

        if (liveStatus === LIVE_STATUS.FINISH) return null;
        return (
            <Animated.View style={[styles.backgroundContainer]}>
                <SafeAreaView style={styles.wrapperCenterTitle}>
                    <Text style={styles.titleText}>
                        Stay here and wait until start live stream
                    </Text>
                </SafeAreaView>
            </Animated.View>
        );
    };

    const renderNodePlayerView = () => {
        // const { inputUrl } = state;
        if (!url) return null;
        return (
            <NodePlayerView
                style={styles.playerView}
                ref={(vb) => {
                    nodePlayerView = vb;
                }}
                inputUrl={url}
                scaleMode="ScaleAspectFit"
                bufferTime={300}
                maxBufferTime={1000}
                autoplay
            />
        );
    };
    const renderChatGroup = () => {
        return (
            <ChatInputGroup
                // onPressHeart={onPressHeart}
                onPressSend={(e) => onPressSend(e)}
                onFocus={() => onFocusChatGroup()}
                onEndEditing={() => onEndEditing()}
            />
        );
    };
    const renderListMessages = () => {
        const { messages, isVisibleMessages } = state;
        if (!isVisibleMessages) return null;
        return <MessagesList messages={messages} />;
    };

    return <View style={styles.container}>
        {renderBackgroundColors()}
        {renderNodePlayerView()}
        {renderChatGroup()}
        {renderListMessages()}
        <TouchableOpacity style={styles.btnClose} onPress={this.onPressClose}>
            <Image
                style={styles.icoClose}
                source={require('../../assets/close.png')}
                tintColor="white"
            />
        </TouchableOpacity>
        {/* <FloatingHearts count={countHeart} /> */}
    </View>;
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db',
    },
    blackContainer: {
        flex: 1,
        backgroundColor: 'black',
    },
    backgroundContainer: {
        flex: 1,
    },
    playerView: {
        position: 'absolute',
        top: 0,
        left: 0,
        height,
        width,
    },
    wrapperCenterTitle: {
        flex: 1,
        marginHorizontal: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        color: 'white',
        fontSize: 28,
        textAlign: 'center',
        fontWeight: '400',
    },
    btnClose: {
        position: 'absolute',
        top: 55,
        left: 15,
    },
    icoClose: {
        width: 30,
        height: 30,
    },
});

export default Viewer;