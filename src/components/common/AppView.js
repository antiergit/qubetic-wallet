import { StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { EventRegister } from 'react-native-event-listeners';
import { getData } from '../../Utils/MethodsUtils';
import * as Constants from '../../Constants';
import { ThemeManager } from '../../../ThemeManager';
import { View } from 'react-native';

function AppView(props) {
  const [screen, setscreen] = useState('');
  const [themeSelected, setThemeSelected] = useState(1);

  /******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener('fromscreen', data => {

      setscreen(data)
    });
    EventRegister.addEventListener('theme', data => {
      getData(Constants.PIN_LOCK).then(pin => {
        getData(Constants.DARK_MODE_STATUS).then(async theme => {
          console.log("RES>>>>>>>", theme);

          setThemeSelected(theme);
        })
        console.log('chk data::::::theme', data);
      })
    });
  }, [screen]);

  /******************************************************************************************/
  console.log("themeSelected>>>>", themeSelected);

  return (
    <>
      <StatusBar
        backgroundColor="transparent"
        barStyle={ThemeManager.colors.mode == 'light' ? 'dark-content' : 'light-content'}
        translucent={true}
      />

      <View style={{ flex: 1, backgroundColor: themeSelected == 1 ? '#121117' : 'rgba(244, 245, 247, 1)' }}>
        {props.children}
      </View>
    </>
  );
}
export { AppView };
