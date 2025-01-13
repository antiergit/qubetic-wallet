import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import images from '../../../theme/Images'
import { horizontalScale, moderateScale, verticalScale } from '../../../layouts/responsive'

const SingleCard = () => {
    return (
        <ImageBackground resizeMode={'contain'} style={{ width: '100%', height: verticalScale(76), justifyContent: 'center' }} source={images.singleCard}>

            <View style={{ flexDirection: 'row', marginHorizontal: horizontalScale(12), justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row' }}>



                    <Image source={images.t} />
                    <View style={{ marginLeft: horizontalScale(12) }}>
                        <Text style={{ color: '#FFFFFF', fontSize: moderateScale(18) }}>BTC</Text>
                        <Text style={{ color: '#737373', fontSize: moderateScale(14) }}>$27,059.28  <Text style={{ color: '#56B52A', fontSize: moderateScale(14) }}>+9.2%</Text></Text>

                    </View>
                </View>
                <View style={{ marginLeft: horizontalScale(12) }}>
                    <Text style={{ color: '#FFFFFF', fontSize: moderateScale(18) }}>0.198756</Text>
                    <Text style={{ color: '#737373', fontSize: moderateScale(14) }}>$5,973.28 </Text>

                </View>

            </View>
        </ImageBackground>
    )
}

export default SingleCard

const styles = StyleSheet.create({})