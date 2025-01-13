import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from 'react-native';
import React from 'react';
import { ThemeManager } from '../../../../ThemeManager';
import { Actions } from 'react-native-router-flux';
import { AppAlert, Button, Header, InputCustom, LoaderView } from '../../common';
import { Colors, Fonts, Images } from '../../../theme';
import Singleton from '../../../Singleton';
import { useState } from 'react';
import { phoneNoCheck, wordsWithOutSpace, wordsWithSpace } from '../../../Utils';
import { KeyboardAwareScrollView } from '@codler/react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';
import { bindPhysicalCard } from '../../../Redux/Actions';
import * as Constants from '../../../Constants';
import { LanguageManager } from '../../../../LanguageManager';

const LinkPhysicalCard = (props) => {
  const { merchantCard, alertMessages, placeholderAndLabels } = LanguageManager;
  const linkingInstructions = [
    {
      key: '1',
      image: Images.polygonBlack,
      text1: merchantCard?.noFeeIsChargedForTheCardLinkingServices,
    },
    {
      key: '2',
      image: Images.polygonBlack,
      text1: merchantCard.theMailerNumberUniqueAndRelevent,
    },
    {
      key: '3',
      image: Images.polygonBlack,
      text1: merchantCard.userNotAbletoUnlink,
    },
  ];
  const dispatch = useDispatch();
  const [cardDetails, setCardDetails] = useState({
    number: '',
    envelopNumber: '',
    name: '',
  });
  const [errors, setErrors] = useState({
    number: '',
    envelopNumber: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [alertTxt, setAlertTxt] = useState('');
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  console.log('chk physical props::::', props.physicalCardData)
  /******************************************************************************************/
  const renderInstructionItem = (item, index) => {
    return (
      <View style={styles.cardInstructionView}>
        <Image
          style={[styles.imageDesign, { tintColor: ThemeManager.colors.colorVariationBorder }]}
          source={item.image}
        />
        <Text style={[styles.textStyle, { color: ThemeManager.colors.lightText }]}>{item.text1}</Text>
      </View>
    );
  };

  /******************************************************************************************/
  const checkValidations = () => {
    let errorsLocal = errors;
    if (cardDetails.number.length == 0) {
      errorsLocal = {
        ...errorsLocal,
        number: alertMessages.cardNumberIsMandatory,
      };
    } else if (cardDetails.number.length != 16) {
      errorsLocal = {
        ...errorsLocal,
        number: alertMessages.pleaseEnterValidCardNumber,
      };
    }
    if (cardDetails.envelopNumber.length == 0) {
      errorsLocal = {
        ...errorsLocal,
        envelopNumber: alertMessages.envelopNumberIsMandatory,
      };
    }
    if (cardDetails.name.length == 0) {
      errorsLocal = {
        ...errorsLocal,
        name: alertMessages.linkingNameIsMandatory,
      };
    }
    setErrors(errorsLocal);
    setTimeout(() => {
      if (errorsLocal.envelopNumber.length == 0 && errors.name.length == 0 && errors.number.length == 0) {
        linkCard();
      }
    }, 100);
  };

  /******************************************************************************************/
  const hideAlert = () => {
    setShowSuccessAlert(false);
    Actions.currentScene != 'PrepaidCard' && Actions.PrepaidCard({ from: 'physicalCardLink', physicalCardData: props.physicalCardData });
  };

  /******************************************************************************************/
  const linkCard = () => {
    setLoading(true);
    let data = {
      card_no: cardDetails.number,
      envelope_no: cardDetails.envelopNumber,
      name: cardDetails.name,
      card_id: props.physicalCardData?.card_id
    };
    dispatch(bindPhysicalCard(data)).then(res => {
      console.log('res::::::bindPhysicalCard', res);
      setLoading(false);
      setAlertTxt(res.data.message);
      setShowSuccessAlert(true);
    }).catch(err => {
      setLoading(false);
      setAlertTxt(err || Constants.SOMETHING_WRONG);
      setShowAlertDialog(true);
      console.log('err::::::bindPhysicalCard', err);
    });
  };

  /******************************************************************************************/
  return (
    <View style={{ flex: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header
        expandHeader
        onPressIcon={() => Actions.pop()}
        BackButtonText={merchantCard.triskelPhysicalCardLinkingService}
        bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mainView}>
          <Text allowFontScaling={false} style={[styles.questionStyle, { color: ThemeManager.colors.Text }]}>{merchantCard.whatIsTheLinkingYourCardService}</Text>
          <Text allowFontScaling={false} style={[styles.ansStyle, { color: ThemeManager.colors.lightText }]}>{merchantCard.cardLinkingServiceIsLaunched}</Text>
          <InputCustom
            txtStyle={{ marginTop: 10 }}
            label={placeholderAndLabels.linkCardNumber}
            placeHolder={placeholderAndLabels.pleaseEnterTheCardNumber}
            placeholderColor={ThemeManager.colors.txtColor}
            placeholderTextColor={ThemeManager.colors.txtColor}
            value={cardDetails.number}
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                setCardDetails({ ...cardDetails, number: text });
                console.log('text::::', text.length);
                if (text.length != 16) {
                  setErrors({ ...errors, number: alertMessages.pleaseEnterValidCardNumber });
                } else {
                  setErrors({ ...errors, number: '' });
                }
              } else if (text.length < 2) {
                setCardDetails({ ...cardDetails, number: '' });
                setErrors({ ...errors, number: alertMessages.cardNumberIsMandatory });
              }
            }}
            onBlur={() => {
              if (cardDetails.number.length == 0) {
                setErrors({ ...errors, number: alertMessages.cardNumberIsMandatory });
              } else if (cardDetails.number.length != 16) {
                setErrors({ ...errors, number: alertMessages.pleaseEnterValidCardNumber });
              }
            }}
          />
          {errors.number.length > 0 && (
            <Text style={styles.errorText}>{errors.number}</Text>
          )}
          <InputCustom
            txtStyle={{ marginTop: 10 }}
            label={placeholderAndLabels.envelopeNumber}
            placeHolder={placeholderAndLabels.pleaseEnterTheEnvelopeNumber}
            placeholderColor={ThemeManager.colors.txtColor}
            placeholderTextColor={ThemeManager.colors.txtColor}
            value={cardDetails.envelopNumber}
            onChangeText={text => {
              if (phoneNoCheck(text)) {
                setCardDetails({ ...cardDetails, envelopNumber: text });
                setErrors({ ...errors, envelopNumber: '' });
              } else if (text.length < 2) {
                setCardDetails({ ...cardDetails, envelopNumber: '' });
                setErrors({ ...errors, envelopNumber: alertMessages.envelopNumberIsMandatory });
              }
            }}
            onBlur={() => {
              if (cardDetails.envelopNumber.length == 0) {
                setErrors({ ...errors, envelopNumber: alertMessages.envelopNumberIsMandatory });
              }
            }}
          />
          {errors.envelopNumber.length > 0 && (<Text style={styles.errorText}>{errors.envelopNumber}</Text>)}

          <InputCustom
            txtStyle={{ marginTop: 10 }}
            maxLength={40}
            label={placeholderAndLabels.linkingName}
            placeHolder={placeholderAndLabels.pleaseEnterYourName}
            placeholderColor={ThemeManager.colors.txtColor}
            placeholderTextColor={ThemeManager.colors.txtColor}
            value={cardDetails.name}
            onChangeText={text => {
              if (wordsWithSpace(text)) {
                setCardDetails({ ...cardDetails, name: text });
                setErrors({ ...errors, name: '' });
              } else if (text.length < 2) {
                setCardDetails({ ...cardDetails, name: '' });
                setErrors({ ...errors, name: alertMessages.linkingNameIsMandatory });
              }
            }}
            onBlur={() => {
              if (cardDetails.name.length == 0) {
                setErrors({ ...errors, name: alertMessages.linkingNameIsMandatory });
              }
            }}
          />
          {errors.name.length > 0 && (<Text style={styles.errorText}>{errors.name}</Text>)}
        </View>

        <Text allowFontScaling={false} style={[styles.headingText, { color: ThemeManager.colors.Text }]}>{merchantCard.cardLinkingInstruction}</Text>

        <FlatList
          data={linkingInstructions}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => `_key${index.toString()}`}
          renderItem={({ item, index }) => renderInstructionItem(item, index)}
        />

        <Button
          buttontext={merchantCard.submit}
          myStyle={styles.buttonStyle}
          onPress={() => { checkValidations() }}
        />

        <LoaderView isLoading={loading} />

        {showSuccessAlert && (
          <AppAlert
            showSuccess={true}
            alertTxt={alertTxt}
            hideAlertDialog={() => { hideAlert() }}
          />
        )}

        {showAlertDialog && (
          <AppAlert
            showSuccess={false}
            alertTxt={alertTxt}
            hideAlertDialog={() => { setShowAlertDialog(false) }}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LinkPhysicalCard;
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    padding: 20,
  },
  errorText: {
    fontFamily: Fonts.dmRegular,
    color: Colors.lossColor,
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left',
  },
  questionStyle: {
    fontFamily: Fonts.dmMedium,
    fontSize: 15,
  },
  ansStyle: {
    color: '#64748B',
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 15,
  },
  headingText: {
    color: ThemeManager.colors.black,
    fontFamily: Fonts.dmSemiBold,
    fontSize: 16,
    paddingLeft: 15,
  },
  textStyle: {
    color: ThemeManager.colors.lightText,
    fontFamily: Fonts.dmRegular,
    fontSize: 14,
    paddingLeft: 5,
    marginRight: 20,
  },
  imageDesign: {
    resizeMode: 'contain',
    tintColor: ThemeManager.colors.black,
  },
  cardInstructionView: {
    flexDirection: 'row',
    alignContent: 'center',
    marginVertical: 10,
    marginHorizontal: 5,
    marginRight: 10,
  },
  buttonStyle: { marginTop: 20, marginBottom: 17, marginHorizontal: 20 },
});
