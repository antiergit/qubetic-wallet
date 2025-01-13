import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import images from '../../../theme/Images';
import { Colors, Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { moderateScale } from '../../../layouts/responsive';
import { TouchableOpacity, Image, } from 'react-native';
import { getDimensionPercentage } from '../../../Utils';
const DATA = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'Del'];

const KeyPad = ({ onPress }) => {
    return (
        <View>
            <FlatList
                data={DATA}
                numColumns={3}
                bounces={false}
                scrollEnabled={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => {
                    return index == 9 ? (<View style={styles.listStyle}><Text style={{ color: ThemeManager.colors.blackWhiteText, fontFamily: Fonts.dmBold }}></Text></View>) : (
                        <TouchableOpacity
                            style={styles.pinBlockStyle}
                            onPress={() => onPress(item)}
                        >
                            {item === 'Del' ? (<Image source={ThemeManager.ImageIcons.deleteIconNew} resizeMode={'contain'} style={{ height: getDimensionPercentage(24), width: getDimensionPercentage(32) }} />) : (<Text allowFontScaling={false} style={[styles.pinBlockTextStyle, { color: ThemeManager.colors.headersTextColor }]}>{item}</Text>)}
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    )
}

export default KeyPad

const styles = StyleSheet.create({
    listStyle: {
        alignItems: 'center',
        height: 50,
        width: 50,
        justifyContent: 'center',
        padding: 10,
        margin: Dimensions.get('screen').height > 800 ? 20 : 10,
    },

    pinBlockStyle: {
        alignItems: 'center',
        height: 50,
        width: 50,
        justifyContent: 'center',
        borderColor: 'red',
        borderRadius: 100,
        padding: 7,
        textAlign: 'center',
        alignSelf: 'center',
        margin: Dimensions.get('screen').height > 800 ? 30 : 10,

    },
    pinBlockTextStyle: {
        fontFamily: Fonts.dmMedium,
        color: Colors.textColor,
        fontSize: moderateScale(30),
        textAlign: 'center',
    },
})