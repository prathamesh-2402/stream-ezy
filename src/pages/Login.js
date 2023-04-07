/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';


const Login = (props) => {

    const [userName, setUserName] = useState('prathamesh');

    const onPressLogin = () => {
        if (userName === '') return Alert.alert('Please input userName');
        const {
            navigation: { navigate },
        } = props;
        return navigate('Home', { userName });
    };

    const onChangeUserName = (userName) => setUserName(userName);

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Please enter name"
                placeholderTextColor="gray"
                value={userName}
                onChangeText={onChangeUserName}
                autoCorrect={false}
            />
            <TouchableOpacity style={styles.loginBtn} onPress={onPressLogin}>
                <Text style={styles.textButton}>Sign in</Text>
            </TouchableOpacity>
        </View>
    );
}

Login.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func,
    }).isRequired,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#3498db',
    },
    loginBtn: {
        backgroundColor: '#34495e',
        alignItems: 'center',
        paddingVertical: 15,
        borderRadius: 10,
        marginHorizontal: 25,
    },
    textButton: {
        color: 'white',
        fontSize: 25,
    },
    input: {
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginVertical: 20,
        marginHorizontal: 25,
        fontSize: 23,
        fontWeight: '600',
    },
});


export default Login;
