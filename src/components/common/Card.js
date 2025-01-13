import React, { useEffect, useState } from 'react';
import { Colors, Fonts } from '../../theme';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { getData } from '../../Utils/MethodsUtils';
import * as Constants from '../../Constants';
import { EventRegister } from 'react-native-event-listeners';

export const Card = props => {
  const [themeSelected, setThemeSelected] = useState();

  //******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('getThemeChanged', data => {
      setThemeSelected(data);
    });
    getData(Constants.DARK_MODE_STATUS).then(async theme => {
      setThemeSelected(theme);
    })
  }, []);

  /******************************************************************************************/
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.touchStyle]}>
      <View style={[styles.mainView,]}>
        <Image
          style={{ width: 30, height: 30 }}
          source={props.img} />
      </View>
      <Text allowFontScaling={false} style={[styles.textStyle, { color: ThemeManager.colors.iconTint }]}>{props.title}</Text>
    </TouchableOpacity>
  );
};

/******************************************************************************************/
const styles = StyleSheet.create({
  touchStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
    // marginHorizontal: 5,
  },
  mainView: {
    height: 60,// 65,
    width: Dimensions.get('screen').width / 6.2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ThemeManager.colors.nmemonicsInputColor,
    borderRadius: 30

  },
  imgStyle: {
  },
  textStyle: {
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    letterSpacing: 0.1,
    marginTop: 12,
  },
});
