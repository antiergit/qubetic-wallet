import { View, Text } from 'react-native';
import React from 'react';
import { Images } from '../../theme';

const SettingItem = ({ title, image, onPress, themeSelected, customDesign }) => {

  /******************************************************************************************/
  return (
    <TouchableOpacity onPress={onPress} style={[styles.setting_item, { backgroundColor: ThemeManager.colors.lightBlackNew }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.iconWrapStyle}>
          <Image source={image} style={[styles.imgBackup, { tintColor: ThemeManager.colors.colorVariation }, customDesign]} />
        </View>
        <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.whiteText, marginLeft: 13, flex: 1 }]}>{title}</Text>
        <Image source={Images.RightArrow} style={[styles.imgRightArrow, { tintColor: ThemeManager.colors.colorVariationBorder }]} />
      </View>
    </TouchableOpacity>
  );
};
export { SettingItem };
