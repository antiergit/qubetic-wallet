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

export const Divider = props => {
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

    <View style={[styles.dividerView, { backgroundColor: ThemeManager.colors.dividerColor }, props.customStyle]}>
    </View>

  );
};

/******************************************************************************************/
const styles = StyleSheet.create({

  dividerView: {
    height: 1,

  },

});
