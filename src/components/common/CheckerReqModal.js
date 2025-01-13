import { View, Text, Modal, StyleSheet, Image, Platform } from "react-native";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
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
import { useSelector } from "react-redux";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import colors from "../../theme/Colors";
import Singleton from "../../Singleton";
import { LoaderView } from "./LoaderView";
import { updateAccessReqByChecker } from "../../Redux/Actions";
import { AppAlert } from "./AppAlert";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from '../../Constants';
import { AppState } from "react-native";

const CheckerReqModal = forwardRef((props, ref) => {
  const styles = getStyles(ThemeManager);
  const { bottom } = useSafeAreaInsets();
  const [isVisible, setIsVisible] = useState(false);
  const [isInvalidScreen, setIsInvalidScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [alertText, setAlertText] = useState("false");
  const { checkerTransactionReq, checkerAccessReq } = useSelector(
    (state) => state.walletReducer
  );
  console.log('checkerTransactionReq ------0', checkerTransactionReq)
  const [currentReqIndex, setCurrentReqIndex] = useState(0);
  const currentReq = useMemo(() => checkerAccessReq?.[currentReqIndex], [
    checkerAccessReq,
    currentReqIndex,
  ]);
  const [statusChangedIndexes, setStatusChangedIndexes] = useState([]); // Object ->  index: currentReqIndex || status - 1 (accepted) || status - 2(rejected)
  const isCurrIndexStatusChanged = useMemo(
    () => statusChangedIndexes.some((val) => val.index == currentReqIndex),
    [statusChangedIndexes, currentReqIndex]
  );
  const currentReqStatus = useMemo(
    () => statusChangedIndexes.find((val) => val.index == currentReqIndex)?.status,
    [statusChangedIndexes, currentReqIndex]
  );
  const isNoPrevAvail = useMemo(() => currentReqIndex == 0, [currentReqIndex]);
  const isNoNextAvail = useMemo(
    () => currentReqIndex == checkerAccessReq?.length - 1,
    [currentReqIndex, checkerAccessReq]
  );
  // console.log("checkerAccessReq ----", checkerAccessReq);

  useImperativeHandle(
    ref,
    () => {
      return {
        show() {
          if (!isVisible) {
            EventRegister.emit(Constants.DOWN_MODAL, "yes");
            setCurrentReqIndex(0);
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
    const appState = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        console.log("CheckerReqModal AppState active");
        setCurrentReqIndex(0);
      }
    });
    return () => {
      EventRegister.removeEventListener(Constants.DOWN_MODAL, onEventModalDown);
      appState && appState?.remove();
    };
  }, []);

  const onEventModalDown = () => {
    setStatusChangedIndexes([]);
    setIsVisible(false);
  };

  useEffect(() => {
    EventRegister.addEventListener("screenChanged", onScreenChanged);

    return () => {
      EventRegister.removeEventListener("screenChanged", onScreenChanged);
    };
  }, []);

  const onScreenChanged = (currScreenName) => {
    // console.log("onScreenChanged currentScene -----", currScreenName);
    const tempIsInvalid = ["EnterPin", "Welcome"].includes(currScreenName);
    // console.log("onScreenChanged tempIsInvalid -----", tempIsInvalid);
    setIsInvalidScreen(tempIsInvalid);
  };

  useEffect(() => {
    if (
      checkerAccessReq?.length > 0 &&
      !Singleton.getInstance().isMakerWallet
    ) {
      setIsVisible(true);
    }
  }, [checkerAccessReq]);

  const onPrevReq = () => {
    setCurrentReqIndex((prev) => prev - 1);
  };

  const onNextReq = () => {
    setCurrentReqIndex((prev) => prev + 1);
  };

  const onStatusUpdated = (status) => {
    setStatusChangedIndexes((prev) => [
      ...prev,
      { index: currentReqIndex, status },
    ]);
    // if (!isNoNextAvail) {
    //   // console.log("isNoNextAvail ------");
    //   onNextReq();
    // } else if (!isNoPrevAvail) {
    //   // console.log("isNoPrevAvail ------");
    //   onPrevReq();
    // }
  };

  const onError = (error) => {
    setIsVisible(false);
    setAlertText(error?.message);
    setTimeout(() => {
      setShowAlertDialog(true);
    }, 700);
  };

  const onCancel = async () => {
    try {
      setIsLoading(true);
      // show loading in btn container or on full screen
      const data = {
        status: 2, // 1 - approved || 2 - rejected
        id: checkerAccessReq[currentReqIndex].id, // 1 = access request id , 2 = trnx request id
        type: 1, // 1 = access request , 2 = trnx request
      };
      const res = await updateAccessReqByChecker(data);
      console.log("CheckerReqModal onCancel res --------", JSON.stringify(res));
      onStatusUpdated(2);
      // once api success, remove button and show status updated text
      // move to next req or prev, whichever applicable
    } catch (error) {
      console.log("CheckerReqModal onCancel eror --------", error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onApprove = async () => {
    try {
      setIsLoading(true);
      // show loading in btn container or on full screen
      const data = {
        status: 1, // 1 - approved || 2 - rejected
        id: currentReq.id, // 1 = access request id , 2 = trnx request id
        type: 1, // 1 = access request , 2 = trnx request
      };
      const res = await updateAccessReqByChecker(data);
      console.log(
        "CheckerReqModal onApprove res --------",
        JSON.stringify(res)
      );
      onStatusUpdated(1);
      // once api success, remove button and show status updated text
      // move to next req or prev, whichever applicable
    } catch (error) {
      console.log("CheckerReqModal onApprove eror --------", error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClose = () => {
    setCurrentReqIndex(0);
    setStatusChangedIndexes([]);
    setIsVisible(false);
  };

  const getCoinName = () => {
    if (!checkerAccessReq || checkerAccessReq?.length == 0 || !currentReq) {
      return "";
    }
    const tempFamily = currentReq.coin_family;
    const coin = Constants.AssetList.find((val) => val.coin_family == tempFamily);
    return coin.coin_symbol.toUpperCase();
  };

  console.log(
    "checker req modal visible ------",
    isVisible,
    !isInvalidScreen,
    !Singleton.getInstance().isMakerWallet,
    currentReq
  );
  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={
        isVisible && !isInvalidScreen && !Singleton.getInstance().isMakerWallet
      }
      // visible={true}
      onRequestClose={() => { }}
    >
      <View style={styles.container}>
        <View style={[styles.body]}>
          <Lottie
            style={[
              StyleSheet.absoluteFillObject,
              styles.lottieStyle,
              Platform.OS == "ios" && {
                marginTop: -dimen(70) + bottom,
              },
            ]}
            source={Images.lockLottie}
            autoPlay
            loop
          />
          <View
            style={{
              height: dimen(180) + (Platform.OS == "ios" ? bottom : 0),
            }}
          >
            <TouchableOpacity onPress={onClose}>
              <Image
                source={Images.closeIcon}
                style={{
                  alignSelf: "flex-end",
                  margin: 4,
                  tintColor: ThemeManager.colors.blackWhiteText,
                }}
              />
            </TouchableOpacity>
          </View>
          {isCurrIndexStatusChanged ? (
            <View>
              <Text
                style={{
                  fontSize: dimen(28),
                  fontFamily: fonts.dmMedium,
                  textAlign: "center",
                  color:
                    currentReqStatus == 1
                      ? colors.profitColor
                      : colors.lossColor,
                }}
              >
                {currentReqStatus == 1 ? "Access Granted" : "Access Rejected"}
              </Text>
            </View>
          ) : (
            <>
              <View
                style={{
                  marginBottom: dimen(24),
                }}
              >
                <Text style={styles.headingTxt}>
                  {LanguageManager.makerchecker.askingAccess}
                </Text>
                <Text style={[styles.subHeadingTxt, { lineHeight: 18 }]}>
                  {`Maker (${currentReq?.wallet_address}) ${LanguageManager.makerchecker.requestSubheadingnote
                    } ${getCoinName()} Wallet`}
                </Text>
              </View>
              <View style={styles.btnContainer}>
                <Button
                  isTouchableBtn
                  buttontext={"Cancel"}
                  customStyle={styles.cancelBtn}
                  restoreStyle={{
                    color: ThemeManager.colors.inputPlace,
                  }}
                  onPress={onCancel}
                />
                <Button
                  buttontext={"Yes"}
                  customStyle={{
                    flex: 0.48,
                  }}
                  onPress={onApprove}
                />
              </View>
            </>
          )}

          {!(isNoPrevAvail && isNoNextAvail) && (
            <View
              style={[
                styles.arrowContainer,
                {
                  marginBottom: Platform.OS == "ios" ? bottom + dimen(12) : 0,
                },
              ]}
            >
              <TouchableOpacity disabled={isNoPrevAvail} onPress={onPrevReq}>
                <Image
                  source={Images.leftArrIcon}
                  style={[
                    styles.arrowImg,
                    {
                      tintColor: isNoPrevAvail
                        ? colors.grayIcon
                        : ThemeManager.colors.blackWhiteText,
                    },
                  ]}
                />
              </TouchableOpacity>
              <TouchableOpacity disabled={isNoNextAvail} onPress={onNextReq}>
                <Image
                  source={Images.rightArrIcon}
                  style={[
                    styles.arrowImg,
                    {
                      tintColor: isNoNextAvail
                        ? colors.grayIcon
                        : ThemeManager.colors.blackWhiteText,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <LoaderView isLoading={isLoading} />
        {showAlertDialog ? (
          <AppAlert
            alertTxt={alertText}
            hideAlertDialog={() => {
              setShowAlertDialog(false);
              setTimeout(() => {
                setIsVisible(true);
              }, 700);
            }}
          />
        ) : null}
      </View>
    </Modal>
  );
});

export default CheckerReqModal;

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
      color: themeManager.colors.headingText,
      textAlign: "center",
      marginBottom: dimen(12),
    },
    subHeadingTxt: {
      fontSize: dimen(16),
      fontFamily: fonts.dmMedium,
      color: themeManager.colors.inputPlace,
      textAlign: "center",
    },
    btnContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cancelBtn: {
      flex: 0.48,
      borderWidth: 1,
      borderColor: themeManager.colors.inputPlace,
      borderRadius: 14,
    },
    arrowContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: dimen(20),
    },
    arrowImg: {
      width: dimen(32),
      height: dimen(32),
    },
  });
};
