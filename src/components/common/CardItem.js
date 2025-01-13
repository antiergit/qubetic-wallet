import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemeManager } from '../../../ThemeManager'
import { LanguageManager } from '../../../LanguageManager'
import CommonRow from './CommonRow'
import { dimen, heightDimen, widthDimen } from '../../Utils'

const CardItem = ({contactAddress,ownerAddress,tokenID,tokenStandard,Quantity}) => {
  return (
    <ImageBackground source={ThemeManager.ImageIcons.homeSubBg} style={[styles.ViewStyle1,]}>
    <CommonRow label={LanguageManager.nftData.contactAddress} value={contactAddress} />
    <CommonRow label={LanguageManager.nftData.ownerAddress} value={ownerAddress} />
    <CommonRow label={LanguageManager.nftData.tokenID} value={tokenID} />
    <CommonRow label={LanguageManager.nftData.tokenStandard} value={tokenStandard} />
    <CommonRow label={LanguageManager.nftData.Quantity} value={Quantity} />
</ImageBackground>
  )
}

export default CardItem

const styles = StyleSheet.create({
    ViewStyle1:{
        // height:heightDimen(221),
        width:widthDimen(382),
        alignSelf:"center",
        borderRadius:14,
        marginTop:heightDimen(20)
      },
    
})