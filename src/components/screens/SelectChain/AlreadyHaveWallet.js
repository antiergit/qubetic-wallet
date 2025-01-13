import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native'
import React from 'react'
import { ThemeManager } from '../../../../ThemeManager'
import { LanguageManager } from '../../../../LanguageManager'
import { HeaderMain } from '../../common'
import { styles } from './styles'
import images from '../../../theme/Images'
import { heightDimen, widthDimen } from '../../../Utils'
import { Actions } from 'react-native-router-flux'

const AlreadyHaveWallet = (props) => {
  const screenParams = props;
  const isFromManageWallet = screenParams?.isFromManageWallet;

  const Item = ({ image, title, description, onPress }) => {
    return <ImageBackground
      resizeMode='contain'
      style={styles.importCard}
      source={ThemeManager.ImageIcons.cardImportBg}>
      <Image source={image} />
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPress}
        style={{ flex: 1, paddingHorizontal: widthDimen(5) }}>
        <Text style={[styles.importTitle, { color: ThemeManager.colors.blackWhiteText }]}>{title}</Text>
        <Text style={[styles.importDescription, { color: ThemeManager.colors.TextColor }]}>{description}</Text>
      </TouchableOpacity>
      <Image source={images.right_arrow} />
    </ImageBackground>
  }
  return (
    <View style={[{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }]}>
      <HeaderMain BackButtonText={LanguageManager.importWallet.importWalletText} />
      <View style={[styles.maincontainer, { marginTop: heightDimen(10) }]}>
        <Item
          image={images.importSecret}
          title={"Secret Phrase"}
          description={"Use a 12, 18 or 24-word seed phrase"}
          onPress={() => {
            if (isFromManageWallet) {
              Actions.currentScene != "ManageImportWallet" &&
                Actions.ManageImportWallet({});
            } else {
              Actions.currentScene != "ImportWallet" &&
                Actions.ImportWallet({});
            }
          }}
        />
        <Item
          image={images.importKey}
          title={"Private Key"}
          description={"Securely access your wallet"}
          onPress={() => {
            Actions.currentScene != "SelectChain" &&
              Actions.SelectChain({ walletType: "privateKey", isFromManageWallet });
          }}
        />
        <Item
          image={images.importSecret}
          title={"Maker Wallet"}
          description={"Use checker's code and wallet address"}
          onPress={() => {
            Actions.currentScene != "SelectChain" &&
              Actions.SelectChain({ walletType: "makerWallet", isFromManageWallet });
          }}
        />
      </View>
    </View>
  )
}

export default AlreadyHaveWallet