import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomKeyPad = () => {
    const keypadData = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'Ok'];

    const handleKeyPress = (key) => {
        console.log('Key pressed:', key);
    };

    const renderItem = ({ item }) => {
        let itemStyle;
        if (['1', '4', '7', 'C'].includes(item)) {
            itemStyle = styles.keypadItemLeft;
        } else if (['2', '5', '8', '0'].includes(item)) {
            itemStyle = styles.keypadItemCenter;
        } else {
            itemStyle = styles.keypadItemRight;
        }

        return (
            <View style={itemStyle}>
                <TouchableOpacity style={styles.keypadButton} onPress={() => handleKeyPress(item)}>
                    <Text style={styles.keypadText}>{item}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={keypadData}
                renderItem={renderItem}
                numColumns={3}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    keypadItemLeft: {
        flex: 1,
        alignItems: 'flex-start',
        //  marginLeft: 2
    },
    keypadItemCenter: {
        flex: 1,
        alignItems: 'center',
    },
    keypadItemRight: {
        flex: 1,
        alignItems: 'flex-end',
        //  marginRight: 2
    },
    keypadButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 80,
        height: 80,
        // backgroundColor: '#e0e0e0',

    },
    keypadText: {
        fontSize: 24,
        color: 'white'
    },
});

export default CustomKeyPad;