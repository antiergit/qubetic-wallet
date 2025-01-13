import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { ThemeManager } from '../../../ThemeManager';
import { Fonts } from '../../theme';

const CustomInprogress = props => {

  //******************************************************************************************/
  return (
    <>
      <View style={styles.main}>
        {props.showOnlyTwoProg ? (
          <>
            <View style={[styles.containerView, props.containerView]}>
              <View style={[styles.progressView, props.progressView]}>
                <Text style={[styles.progTxt, props.progTxt, { color: ThemeManager.colors.pieInnerColor }]}>{props.progOneTxt}</Text>
              </View>
              <View style={[styles.horizontalLine, props.horizontalLine]}></View>
              {props.showprogTwo ? (
                <View style={[styles.progressView, props.progressView]}>
                  <Text style={[styles.progTxt, props.progTxt]}>{props.progTwoTxt}</Text>
                </View>
              ) : (
                <View style={[styles.progressViewEmpty, props.progressViewEmpty]} />
              )}
            </View>
            {/* ****************************************************** */}
            <View style={styles.contentView}>
              <Text style={[styles.txtStyle, { textAlign: 'left', color: ThemeManager.colors.text_Color }, props.firstCountStyle]}>{props.firstCont}</Text>
              <Text style={[styles.txtStyle, { textAlign: 'center', color: ThemeManager.colors.text_Color }, props.txtTwoStyle]}>{props.secCont}</Text>
            </View>
          </>
        ) : (
          <>
            <View style={styles.containerView}>
              <View style={[styles.progressView, props.progressView]}>
                <Text style={[styles.progTxt, props.progTxt]}>{props.progOneTxt}</Text>
              </View>
              <View
                style={[styles.horizontalLine, props.horizontalLine]}></View>
              {props.showprogTwo ? (
                <View style={[styles.progressView, props.progressView]}>
                  <Text style={[styles.progTxt, props.progTxt]}>{props.progTwoTxt}</Text>
                </View>
              ) : (
                <View style={[styles.progressViewEmpty, props.progressViewEmpty]} />
              )}
              <View style={[styles.horizontalLine, props.horizontalLine]}></View>
              {props.showprogThree ? (
                <View style={[styles.progressView, props.progressView]}>
                  <Text style={[styles.progTxt, props.progTxt]}>{props.progThreeTxt}</Text>
                </View>
              ) : (
                <View style={[styles.progressViewEmpty, props.progressViewEmpty]} />
              )}
            </View>
            {/* ****************************************************** */}
            <View style={styles.contentView}>
              <Text style={[styles.txtStyle, { color: ThemeManager.colors.text_Color }]}>{props.firstCont}</Text>
              <Text style={[styles.txtStyle, props.txtTwoStyle, { color: ThemeManager.colors.text_Color }]}>{props.secCont}</Text>
              <Text style={[styles.txtStyle, props.txtThreeStyle, { color: ThemeManager.colors.text_Color }]}>{props.thirdCont}</Text>
            </View>
          </>
        )}
      </View>
    </>
  );
};

export default CustomInprogress;

//******************************************************************************************/
const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 20,
  },
  containerView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 50,
  },
  progressView: {
    backgroundColor: ThemeManager.colors.colorVariation,
    borderRadius: 15,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ThemeManager.colors.settingBg,
  },
  horizontalLine: {
    backgroundColor: ThemeManager.colors.settingBg,
    height: 2,
    flex: 1,
  },
  progTxt: {
    fontSize: 14,
    fontFamily: Fonts.dmMedium,
    textAlign: 'center',
  },
  contentView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 9,
    marginHorizontal: 25,
  },
  txtStyle: {
    fontSize: 14,
    flex: 1,
    fontFamily: Fonts.dmMedium,
  },
  progressViewEmpty: {
    backgroundColor: 'transparent',
    borderRadius: 15,
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: ThemeManager.colors.settingBg,
  },
});
