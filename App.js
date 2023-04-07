import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './src/pages/Home';
import Streamer from './src/pages/Streamer';
import Viewer from './src/pages/Viewer';
import Login from './src/pages/Login';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Login" component={Login} />

        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Streamer" component={Streamer} />
        <Stack.Screen name="Viewer" component={Viewer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
