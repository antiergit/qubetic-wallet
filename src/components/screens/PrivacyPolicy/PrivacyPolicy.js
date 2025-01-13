import React, { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import { Header, HeaderMain, LoaderView } from '../../common';
import { connect } from 'react-redux';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import { WebView } from 'react-native-webview';
import { LanguageManager } from '../../../../LanguageManager';
import { ScrollView } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { dimen } from '../../../Utils';

const PrivacyPolicy = () => {
  const { walletMain } = LanguageManager;
  const { width } = useWindowDimensions()
  const [isLoading, setisLoading] = useState(false);
  useEffect(() => {
    setisLoading(true);
  }, []);

  /******************************************************************************************/
  return (
    <ImageBackground source={ThemeManager.ImageIcons.mainBgImgNew} style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}>
      <HeaderMain BackButtonText={walletMain.privacyPolicy} />
      <WebView
        onLoadStart={() => {
          setisLoading(true);
        }}
        onLoadEnd={() => {
          setTimeout(() => {
            setisLoading(false);
          }, 1000);
        }}
        style={{ flex: 1, backgroundColor: "transparent" }}
        source={{
          uri: `${Constants.PRIVACY_POLICY_LINK}${ThemeManager.colors.theme == "dark" ? "/dark" : ""
            }`,
        }}
        originWhitelist={["*"]}
        scalesPageToFit={false}
      />

      {isLoading == true && <LoaderView isLoading={isLoading} />}
    </ImageBackground>
  );
};

export default connect(null)(PrivacyPolicy);
