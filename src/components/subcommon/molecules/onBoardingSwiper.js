import { View, Text } from 'react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import Singleswiper from '../atoms/singleSwiper';

const OnboardingSwiper = () => {
    return (
        <Swiper style={styles.wrapper} showsButtons={true}>
            <Singleswiper />
            <Singleswiper />
            <Singleswiper />

        </Swiper>
    );
};

export default OnboardingSwiper;

const styles = StyleSheet.create({
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB',
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5',
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9',
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold',
    },
});
