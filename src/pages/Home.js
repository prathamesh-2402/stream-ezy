/* eslint-disable prettier/prettier */
import React from 'react';
import { useState, useEffect } from 'react';
import { Text, TouchableOpacity, SafeAreaView, FlatList, StyleSheet } from 'react-native';
import get from 'lodash/get';
import SocketManager from '../socketManager';
import LiveStreamCard from '../components/LiveStreamCard';

const Home = (props) => {
  const { route } = props;
  const userName = get(route, 'params.userName', '');

  const [listLiveStream, setListLiveStream] = useState([]);

  useEffect(() => {
    SocketManager.instance.emitListLiveStream();
    SocketManager.instance.listenListLiveStream((data) => {
      setListLiveStream(data);
    });
  }, [])

  const onPressLiveStreamNow = () => {
    const { route } = props;
    const userName = get(route, 'params.userName', '');
    const {
      navigation: { navigate },
    } = props;
    navigate('Streamer', { userName, roomName: userName });
  };

  const onPressCardItem = (data) => {
    const { route } = props;
    const userName = get(route, 'params.userName', '');
    const {
      navigation: { navigate },
    } = props;
    navigate('Viewer', { userName, data });
  };

  return (<SafeAreaView style={styles.container}>
    <Text style={styles.welcomeText}>Welcome : {userName}</Text>
    <Text style={styles.title}>List of live streams</Text>
    <FlatList
      contentContainerStyle={styles.flatList}
      data={listLiveStream}
      renderItem={({ item }) => <LiveStreamCard data={item} onPress={onPressCardItem} />}
      keyExtractor={(item) => item._id}
    />
    <TouchableOpacity style={styles.liveStreamButton} onPress={onPressLiveStreamNow}>
      <Text style={styles.textButton}>LiveStream Now</Text>
    </TouchableOpacity>
  </SafeAreaView>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3498db',
  },
  liveStreamButton: {
    backgroundColor: '#34495e',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 10,
    marginHorizontal: 25,
    marginBottom: 15,
  },
  textButton: {
    color: 'white',
    fontSize: 25,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginVertical: 20,
    marginHorizontal: 25,
    fontSize: 23,
    fontWeight: '600',
  },
  flatList: {
    marginHorizontal: 15,
  },
  welcomeText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 25,
  },
  title: {
    fontSize: 25,
    color: 'white',
    fontWeight: '700',
    marginLeft: 20,
    marginVertical: 25,
  },
});
export default Home;