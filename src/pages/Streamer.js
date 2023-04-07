/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    PermissionsAndroid,
    StyleSheet
} from 'react-native';
import { NodeCameraView } from 'react-native-nodemediaclient';
import get from 'lodash/get';
import { LIVE_STATUS, videoConfig, audioConfig } from '../utils/constants';
import SocketManager from '../socketManager';
import LiveStreamActionButton from '../components/LiveStreamActionButton';
import ChatInputGroup from '../components/ChatInputGroup';
import MessagesList from '../components/MessageList';
import * as Utility from '../utils/utility';
import {RTMP_SERVER} from '../config'
import Logger from '../utils/logger';

const Streamer = (props) => {
    var nodeCameraViewRef = null;

    const { route } = props;
    const roomName = get(route, 'params.roomName');
    const userName = get(route, 'params.userName', '');

    const [state, setState] = useState({
        currentLiveStatus: LIVE_STATUS.PREPARE,
        messages: [],
        // countHeart: 0,
        isVisibleMessages: true,
    });
    const setCameraRef = (ref) => {
        nodeCameraViewRef = ref;
    };

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.requestMultiple(
                [PermissionsAndroid.PERMISSIONS.CAMERA, PermissionsAndroid.PERMISSIONS.RECORD_AUDIO],
                {
                    title: 'LiveStreamExample need Camera And Microphone Permission',
                    message:
                        'LiveStreamExample needs access to your camera so you can take awesome pictures.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (
                granted['android.permission.CAMERA'] === PermissionsAndroid.RESULTS.GRANTED &&
                granted['android.permission.RECORD_AUDIO'] === PermissionsAndroid.RESULTS.GRANTED
            ) {
                if (this.nodeCameraViewRef) nodeCameraViewRef.startPreview();
            } else {
                Logger.log('Camera permission denied');
            }
        } catch (err) {
            Logger.warn(err);
        }
    };

    useEffect(() => {
        requestCameraPermission();
        SocketManager.instance.emitPrepareLiveStream({
            userName: userName,
            roomName: roomName,
        });
        SocketManager.instance.emitJoinRoom({
            userName: userName,
            roomName: roomName,
        });
        SocketManager.instance.listenBeginLiveStream((data) => {
            const currentLiveStatus = get(data, 'liveStatus', '');
            setState({ ...state, currentLiveStatus });
        });
        SocketManager.instance.listenFinishLiveStream((data) => {
            const currentLiveStatus = get(data, 'liveStatus', '');
            setState({ ...state, currentLiveStatus });
        });
        SocketManager.instance.listenSendMessage((data) => {
            const messages = get(data, 'messages', []);
            setState({ ...state, messages });
        });
        return () => {
            if (nodeCameraViewRef) nodeCameraViewRef.stop();
            SocketManager.instance.emitLeaveRoom({
                userName: userName,
                roomName: roomName,
            });
        }
    }, [])

    console.log('Current live Status ->', state.currentLiveStatus);

    const onPressSend = (message) => {
        SocketManager.instance.emitSendMessage({
            roomName: roomName,
            userName: userName,
            message,
        });

        setState(prevState => { return { ...prevState, isVisibleMessages: true }; });
    };

    const onEndEditing = () => setState({ ...state, isVisibleMessages: true });

    const onFocusChatGroup = () => {
        setState({ ...state, isVisibleMessages: false });
    };
    const onPressClose = () => {
        const { navigation } = props;
        navigation.goBack();
    };

    const onPressLiveStreamButton = () => {
        const { navigation } = props;
        const { currentLiveStatus } = state;
        if (Number(currentLiveStatus) === Number(LIVE_STATUS.PREPARE)) {
            /**
             * Waiting live stream
             */
            SocketManager.instance.emitBeginLiveStream({ userName, roomName: userName });
            SocketManager.instance.emitJoinRoom({ userName, roomName: userName });
            if (nodeCameraViewRef) nodeCameraViewRef.start();
        } else if (Number(currentLiveStatus) === Number(LIVE_STATUS.ON_LIVE)) {
            /**
             * Finish live stream
             */
            SocketManager.instance.emitFinishLiveStream({ userName, roomName: userName });
            if (nodeCameraViewRef) nodeCameraViewRef.stop();
            Alert.alert(
                'Alert ',
                'Thanks for your live stream',
                [
                    {
                        text: 'Okay',
                        onPress: () => {
                            navigation.goBack();
                            SocketManager.instance.emitLeaveRoom({ userName, roomName: userName });
                        },
                    },
                ],
                { cancelable: false }
            );
        }
    };

    const renderChatGroup = () => {
        return (
            <ChatInputGroup
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

    //vars
    const { currentLiveStatus } = state;
    const outputUrl = `${RTMP_SERVER}/live/${userName}`;

    return (<SafeAreaView style={styles.container}>
        <NodeCameraView
            style={styles.streamerView}
            ref={setCameraRef}
            outputUrl={outputUrl}
            camera={{ cameraId: 1, cameraFrontMirror: true }}
            audio={audioConfig}
            video={videoConfig}
            smoothSkinLevel={3}
            autopreview={true}
        />
        <SafeAreaView style={styles.contentWrapper}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.btnClose} onPress={onPressClose}>
                    <Image
                        style={styles.icoClose}
                        source={require('../../assets/close.png')}
                        tintColor="white"
                    />
                </TouchableOpacity>
                <LiveStreamActionButton
                    currentLiveStatus={currentLiveStatus}
                    onPress={onPressLiveStreamButton}
                />
            </View>
            <View style={styles.center} />
            <View style={styles.footer}>
                {renderChatGroup()}
                {renderListMessages()}
            </View>
        </SafeAreaView>
    </SafeAreaView>);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3498db',
    },
    contentWrapper: { flex: 1 },
    header: { flex: 0.1, justifyContent: 'space-around', flexDirection: 'row' },
    footer: { flex: 0.1 },
    center: { flex: 0.8 },
    streamerView: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: Utility.screenHeight,
        width: Utility.screenWidth,
    },
    btnClose: { position: 'absolute', top: 15, left: 15 },
    icoClose: { width: 28, height: 28 },
    bottomGroup: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
    },
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
export default Streamer;