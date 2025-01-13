import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts, Images } from '../../theme';
import Singleton from '../../Singleton';
import { getData } from '../../Utils/MethodsUtils';
import { LanguageManager } from '../../../LanguageManager';
import * as Constants from '../../Constants';
import { EventRegister } from 'react-native-event-listeners';
import { dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../Utils';
import colors from '../../theme/Colors';
import PortfolioButton from '../subcommon/atoms/PortfolioButton';

export const MainCard = props => {
  const { walletMain } = LanguageManager;
  const [themeSelected, setThemeSelected] = useState();
  const [integerPart, decimalPart] = props.showBal.split('.');

  //******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
    getData(Constants.DARK_MODE_STATUS).then(async theme => {
      setThemeSelected(theme);
    })
  }, []);

  //******************************************************************************************/
  return (
    <View style={{ marginTop: heightDimen(20), }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flex: 1 }}>
          <Text allowFontScaling={false} style={[styles.totalValue, { color: ThemeManager.colors.blackWhiteText }]}>{walletMain.totalBal}</Text>

          <View style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "space-between",
          }}>

            <View style={{ flexDirection: "row", }}>
              <Text allowFontScaling={false} style={[styles.balAmount, { color: ThemeManager.colors.blackWhiteText }]}>{Singleton.getInstance().CurrencySymbol}{(props.isHideBalance ? "*****" : integerPart)}
                <Text allowFontScaling={false} style={[styles.bal, { color: ThemeManager.colors.blackWhiteText }]}>{'.'}{(props.isHideBalance ? "**" : decimalPart)}</Text></Text>
            </View>
            <TouchableOpacity
              onPress={props.hideBalance}
            >
              <Image style={{ tintColor: ThemeManager.colors.blackWhiteText }} source={!props.isHideBalance ? Images.showBalanceIcon : Images.hideBalanceIcon} />
            </TouchableOpacity>
          </View>

        </View>

      </View>



      <View style={{
        flexDirection: 'row',
        marginTop: getDimensionPercentage(22),
        justifyContent: "space-between",
      }}>
        <PortfolioButton
          image={Images.walletSendIcon}
          text={LanguageManager.walletMain.send}
          onPress={() => props.onPressSend()} />

        <PortfolioButton
          image={Images.walletReceiveIcon}
          text={LanguageManager.walletMain.receive}
          color={ThemeManager.colors.blackWhiteText}
          onPress={() => props.onPressReceive()} />

        <PortfolioButton
          image={Images.walletBuyIcon}
          text={LanguageManager.contactUs.buySell}
          onPress={() => props.onPressBuySell()} />

        <PortfolioButton
          image={Images.walletTradeIcon}
          text={LanguageManager.merchantCard.trade}
          onPress={props.onPressSwap} />

        <PortfolioButton
          image={Images.walletHistoryIcon}
          text={LanguageManager.merchantCard.history}
          onPress={() => props.onPressHistory()} />
      </View>
    </View>
  );
};

//******************************************************************************************/
const styles = StyleSheet.create({
  totalValue: {
    fontSize: dimen(18),
    lineHeight: dimen(18),
    fontFamily: Fonts.dmRegular,
  },
  bal: {
    textAlign: 'center',
    fontSize: getDimensionPercentage(20),

    fontFamily: Fonts.dmRegular,

    // marginBottom: 20
  },

  balAmount: {
    textAlign: 'center',
    fontSize: getDimensionPercentage(40),
    fontFamily: Fonts.dmSemiBold,
    // marginBottom: 20
  },
  textPL: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: Fonts.dmBold,
    // marginBottom: 20
  },
});
