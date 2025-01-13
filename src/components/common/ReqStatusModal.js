import { View, Text, Modal, StyleSheet, Image } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { dimen, screenWidth } from "../../Utils";
import { Images } from "../../theme";
import Lottie from "lottie-react-native";
import { TouchableOpacity } from "react-native";
import { ThemeManager } from "../../../ThemeManager";
import fonts from "../../theme/Fonts";
import { Button } from "./Button";
import { LanguageManager } from "../../../LanguageManager";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from "../../Constants";
import { startMakerWalletCreation } from "../../Utils/CheckerMarkerUtils";
import { LoaderView } from "./LoaderView";
import { Actions } from "react-native-router-flux";

const ReqStatusModal = forwardRef((props, ref) => {
  const styles = getStyles(ThemeManager);
  const [isVisible, setIsVisible] = useState(false);
  const [reqStatus, setReqStatus] = useState(0); // 1 - success || 2 - rejected
  const [subHeading, setSubHeading] = useState("");
  const [showDeclinedOnClose, setShowDeclinedOnClose] = useState(false);
  const [makerData, setMakerData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(
    ref,
    () => {
      return {
        show(data = {}) {
          const {
            status,
            alsoShowDeclined = false,
            msg = "",
            makerData,
          } = data;
          if (makerData) {
            setMakerData(makerData);
          }
          setReqStatus(status);
          setShowDeclinedOnClose(alsoShowDeclined);
          setSubHeading(msg);
          if (!isVisible) {
            EventRegister.emit(Constants.DOWN_MODAL, "yes");
            setTimeout(() => {
              setIsVisible(true);
            }, 900);
          }
        },
        hide() {
          setIsVisible(false);
        },
      };
    },
    [isVisible]
  );

  useEffect(() => {
    EventRegister.addEventListener(Constants.DOWN_MODAL, onEventModalDown);

    return () => {
      EventRegister.removeEventListener(Constants.DOWN_MODAL, onEventModalDown);
    };
  }, []);

  const onEventModalDown = () => {
    setShowDeclinedOnClose(false);
    setIsVisible(false);
  };

  const closeModal = () => {
    setIsVisible(false);
    setMakerData(null);
    if (showDeclinedOnClose) {
      setTimeout(() => {
        setShowDeclinedOnClose(false);
        setReqStatus(2);
        setIsVisible(true);
      }, 500);
    }
  };

  const onBtnClick = () => {
    if (makerData) {
      const temp = makerData;
      setIsLoading(true);
      startMakerWalletCreation({
        ...temp,
        onSuccess: () => {
          // closeModal();
          setMakerData(null);
          setIsLoading(false);
          setIsVisible(false);
          setShowDeclinedOnClose(false);
          Actions.jump("WalletMain");
        },
      });
    } else {
      Actions.jump("WalletMain");
      if (props?.onBtnPress) {
        props?.onBtnPress();
      }
      closeModal();
    }
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => { }}
    >
      <View style={styles.container}>
        <View style={styles.body}>
          {!makerData && (
            <TouchableOpacity onPress={closeModal}>
              <Image
                source={Images.closeIcon}
                style={{
                  alignSelf: "flex-end",
                  margin: 4,
                  tintColor: ThemeManager.colors.blackWhiteText,
                }}
              />
            </TouchableOpacity>
          )}
          <View
            style={{
              marginBottom: dimen(24),
            }}
          >
            {reqStatus != 0 && (
              <Image
                source={
                  reqStatus == 1 ? Images.successIcon : Images.cancelRedIcon
                }
                style={{
                  alignSelf: "center",
                  marginBottom: dimen(24),
                }}
              />
            )}
            <Text style={styles.headingTxt}>
              {reqStatus == 1
                ? LanguageManager.commonText.successful
                : reqStatus == 2
                  ? LanguageManager.contactUs.cancel
                  : ""}
            </Text>
            <Text style={styles.subHeadingTxt}>
              {reqStatus == 1
                ? LanguageManager.makerChecker.accessSuccess
                : reqStatus == 2
                  ? LanguageManager.makerChecker.accessRejected
                  : ""}
            </Text>
          </View>
          <Button
            buttontext={
              makerData ? "Open Wallet" : LanguageManager.merchantCard.done
            }
            onPress={onBtnClick}
          />
        </View>
        <LoaderView isLoading={isLoading} />
      </View>
    </Modal>
  );
});

export default ReqStatusModal;

const getStyles = (themeManager) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.8)",
    },
    body: {
      borderWidth: 1,
      borderColor: themeManager.colors.modalBorder,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingHorizontal: dimen(24),
      paddingVertical: dimen(24),
      backgroundColor: themeManager.colors.mainBgNew,
    },
    lottieStyle: {
      height: dimen(500),
      width: screenWidth,
      alignSelf: "center",
      marginTop: -dimen(70),
    },
    headingTxt: {
      fontSize: dimen(20),
      fontFamily: fonts.dmMedium,
      color: themeManager.colors.blackWhiteText,
      textAlign: "center",
      marginBottom: dimen(12),
    },
    subHeadingTxt: {
      fontSize: dimen(16),
      fontFamily: fonts.dmMedium,
      color: themeManager.colors.inputPlace,
      textAlign: "center",
    },
    cancelBtn: {
      flex: 0.48,
      borderWidth: 1,
      borderColor: themeManager.colors.inputPlace,
      borderRadius: 14,
    },
  });
};
