import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import { Header, HeaderMain, LoaderView } from '../../common';
import { connect } from 'react-redux';
import { ThemeManager } from '../../../../ThemeManager';
import { WebView } from 'react-native-webview';
import * as Constants from '../../../Constants';
import { LanguageManager } from '../../../../LanguageManager';

const TermsandConditions = props => {
  const { walletMain } = LanguageManager;
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    setisLoading(true);
  }, []);

  return (
    <ImageBackground source={ThemeManager.ImageIcons.mainBgImgNew} style={{ flex: 1 }}>
      <HeaderMain BackButtonText={walletMain.termsandConditions} />
      <WebView
        onLoadStart={() => { setisLoading(true) }}
        style={{ flex: 1, backgroundColor: "transparent" }}
        source={{
          uri: `${Constants.TERM_LINK}${ThemeManager.colors.theme == "dark" ? "/dark" : ""
            }`,
        }}
        onLoadEnd={() => {
          setTimeout(() => {
            setisLoading(false);
          }, 1000);
        }}
      />
      {isLoading == true && <LoaderView isLoading={isLoading} />}
    </ImageBackground>
  );
};

export default connect(null)(TermsandConditions);
