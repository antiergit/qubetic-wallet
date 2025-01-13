import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Header, HeaderMain, LoaderView } from '../../common';
import { connect } from 'react-redux';
import { ThemeManager } from '../../../../ThemeManager';
import { WebView } from 'react-native-webview';
import * as Constants from '../../../Constants';
import { LanguageManager } from '../../../../LanguageManager';

const AboutUs = props => {
  const { walletMain } = LanguageManager;
  const [isLoading, setisLoading] = useState(true);
  useEffect(() => {
    // setisLoading(true);
  }, []);

  console.log("ThemeManager.colors.theme>>", ThemeManager.colors.theme);

  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}>
      <HeaderMain BackButtonText={walletMain.aboutUs} />
      <WebView
        onLoadStart={() => { setisLoading(true) }}
        style={{ flex: 1, }}
        source={{
          uri: `${Constants.ABOUT_US_LINK}${ThemeManager.colors.theme == "dark" ? "/dark" : ""
            }`,
        }}
        onLoadEnd={() => {
          setTimeout(() => {
            setisLoading(false);
          }, 1000);
        }}
      />
      {isLoading == true && <LoaderView isLoading={isLoading} />}
    </View>
  );
};

export default connect(null)(AboutUs);