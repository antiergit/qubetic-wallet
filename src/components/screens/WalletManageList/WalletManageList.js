import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Alert,
  Platform,
  FlatList,
  BackHandler,
  NativeModules
} from "react-native";
import styles from "./WalletManageListStyles";
import { ThemeManager } from "../../../../ThemeManager";
import { LanguageManager } from "../../../../LanguageManager";
import {
  AppAlert,
  Button,
  CardView,
  Divider,
  HeaderMain,
  Input,
  InputCustom,
  LoaderView,
  ManageItem,
} from "../../common";
import { Actions } from "react-native-router-flux";
import { getData, saveData } from "../../../Utils/MethodsUtils";
import { Colors, Images } from "../../../theme";
import * as Constants from "../../../Constants";
import { ConfirmAlert } from "../../common/ConfirmAlert";
import Singleton from "../../../Singleton";
import { store } from "../../../Redux/Reducers";
import {
  requestCoinList,
  requestWalletLogin,
  logoutUser,
} from "../../../Redux/Actions";
import { useDispatch } from "react-redux";
import CommonModal from "../../common/CommonModal";
import { BlurView } from "@react-native-community/blur";
import {
  bottomNotchWidth,
  getDimensionPercentage as dimen,
  getDimensionPercentage,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import CustomButton from "../../subcommon/atoms/customButton";
import { clearStorage, } from "../../../Utils/MethodsUtils";
import { EventRegister } from "react-native-event-listeners";
import { ActionConst } from "react-native-router-flux";
import { set } from "react-native-reanimated";


// import { LanguageManager } from "../../../../LanguageManager";
let selectedItem = "";
const WalletManageList = (props) => {
  // const {string} = languages;

  const dispatch = useDispatch();
  const [alertModal, setAlertModal] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [multiwallet, setmultiwallet] = useState([]);
  const [deleteItem, setdeleteItem] = useState("");
  const [showAlertDialogConfirm, setshowAlertDialogConfirm] = useState(false);
  const [alertTxt, setalertTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSecretPhrase, setIsSecretPhrase] = useState(false);
  const [isLostSecretPhrase, setisLostSecretPhrase] = useState(false);
  const [clickedItem, setClickedItem] = useState();
  const [checkedOne, setcheckedOne] = useState(false);
  const [checkedTwo, setcheckedTwo] = useState(false);
  const [checkedThree, setcheckedThree] = useState(false);

  const [name, setName] = useState(false);
  const [wallet_name, setWallet_name] = useState(props?.walletItem?.walletName);

  const { alertMessages, referral, pins, setting } = LanguageManager;
  const [selectionType, setSelectionType] = useState("");



  useEffect(() => {

    getData(Constants.MULTI_WALLET_LIST).then((multiWalletArray) => {
      setmultiwallet(JSON.parse(multiWalletArray));
    });
    props.navigation.addListener("didFocus", () => {
      BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
      getData(Constants.MULTI_WALLET_LIST).then((multiWalletArray) => {
        setmultiwallet(JSON.parse(multiWalletArray));
      });
    });
    props.navigation.addListener('didBlur', () => {
      // BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    });
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      setisLostSecretPhrase(false)
      setIsSecretPhrase(false)
      setcheckedOne('')
      setcheckedThree('')
    });


  }, []);

  const handleBackButtonClick = () => {
    Actions.pop()

    return true;
  };

  const deleteWalletAction = (item) => {
    setIsSecretPhrase(false);
    setdeleteItem(item);
    setTimeout(() => {
      setshowAlertDialogConfirm(true);
      setalertTxt(
        multiwallet.length == 1
          ? `${LanguageManager.manage.logout}`
          : LanguageManager.alertMessages.wantToDeleteThisWallet
      );
    }, 500);

  };
  /* *********************************************delete***************************************** */
  const deleteWallet = () => {
    if (multiwallet.length == 1) {
      logout()
    } else {
      setshowAlertDialogConfirm(false);

      const arr = multiwallet;
      arr.map((item, index) => {
        if (item.walletName == deleteItem?.walletName) {
          arr.splice(index, 1);
        }
      });
      setmultiwallet(arr);
      saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(arr));
      setAlertModal(false);
      setIsSecretPhrase(false);
    }
  };




  /******************************************************************************************/
  const logout = () => {
    setshowAlertDialogConfirm(false);
    setLoading(true);

    getData(Constants.DEVICE_TOKEN).then((device_token) => {
      let data = {
        deviceToken: device_token,
      };
      dispatch(logoutUser({ data }))
        .then((res) => {
          clearStorage();
          saveData(Constants.DEVICE_TOKEN, data.deviceToken);
          if (Platform.OS == "android") {
            var ClrStorageModule = NativeModules.EncryptionModule;
            ClrStorageModule.clearApplicationData();
          }
          setTimeout(() => {
            setLoading(false);

            saveData(Constants.DARK_MODE_STATUS, 1);
            ThemeManager.setLanguage("darkMode");
            EventRegister.emit("getThemeChanged", 1);
            EventRegister.emit("theme", '#0C0C0D');
            LanguageManager.setLanguage("English");
            Singleton.getInstance().userRefCode = "";
            global.isDeepLink = false;
            Singleton.getInstance().SelectedLanguage = "en";
            saveData(Constants.SELECTED_LANGUAGE, "en");

            Actions.currentScene != "Onboarding" &&
              Actions.Onboarding({ type: ActionConst.RESET });
          }, 1200);
        })
        .catch((err) => {
          console.log("chk logotu err::::>>>>>>>>", err);
          setLoading(false);
        });
    });
  };




  const makeDefault = (data) => {
    setLoading(true);
    console.log("selectedItem------ ", data);
    const allWallet = multiwallet;
    let selectedItem = "";
    allWallet.map((item, index) => {
      if (
        item.walletName == data?.walletName &&
        item?.loginRequest?.wallet_address == data?.loginRequest?.wallet_address
      ) {
        item.defaultWallet = true;
        selectedItem = item;
      } else {
        item.defaultWallet = false;
      }
    });
    console.log("allWallet------ ", allWallet);
    updateLocal(allWallet, selectedItem);
    setmultiwallet(allWallet);
  };

  /* *********************************************updateLocal***************************************** */
  const updateLocal = (newArray, selectedItem) => {
    const item = selectedItem;
    console.log("selectedItem:::::", item);
    let ethAddress = "";
    let btcAdress = "";
    let LtcAddress = "";
    let trxAddress = "";
    item.loginRequest.addressList.map((item, index) => {
      const symbol = item.symbol?.toLowerCase();
      symbol == "trx"
        ? (trxAddress = item.address)
        : symbol == "btc"
          ? (btcAdress = item.address)
          : symbol == "ltc"
            ? (LtcAddress = item.address)
            : (ethAddress = item.address);
    });
    Singleton.getInstance().defaultEthAddress = ethAddress;
    Singleton.getInstance().defaultBnbAddress = ethAddress;
    Singleton.getInstance().defaultMaticAddress = ethAddress;
    Singleton.getInstance().defaultBtcAddress = btcAdress;
    Singleton.getInstance().defaultTrxAddress = trxAddress;
    Singleton.getInstance().defaultLtcAddress = LtcAddress;
    Singleton.getInstance().defaultEmail = item.login_data?.userEmail;
    Singleton.getInstance().refCode = item.login_data?.refCode;
    saveData(Constants.USER_ID, item.login_data.userId);
    saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(newArray));
    saveData(Constants.ACCESS_TOKEN, item.user_jwtToken);
    saveData(
      Constants.ACTIVE_ADDRESS_LIST,
      JSON.stringify(item.loginRequest.addressList)
    );

    console.log("CoinsList==1===", item.coinFamilyKeys)
    saveData(Constants.ADDRESS_LIST, JSON.stringify(item.addrsListKeys));
    saveData(Constants.COIN_FAMILY_LIST, JSON.stringify(item.coinFamilyKeys));
    saveData(Constants.LOGIN_DATA, JSON.stringify(item.login_data));
    saveData(Constants.WALLET_NAME, item.walletName);
    saveData(Constants.REFRESH_TOKEN, item.user_refreshToken);
    saveData(Constants.FAVORITE, JSON.stringify([]));
    Singleton.getInstance().walletName = item.walletName;
    Singleton.isFirsLogin = true;
    setTimeout(() => {
      store
        .dispatch(requestCoinList({}))
        .then((res) => {
          setLoading(false);
          setIsSecretPhrase(false);
        })
        .catch((err) => {
          setLoading(false);
          setIsSecretPhrase(false);
        });
      setLoading(false);
    }, 150);
  };
  /* *********************************************update wallet name***************************************** */

  const onPressContinue = () => {
    setIsSecretPhrase(false);


    if (wallet_name?.trim().length == 0) {
      setTimeout(() => {
        setAlertModal(true);
        setAlertText(LanguageManager.alertMessages.enterWalletName);
      }, 200);


      return;
    }
    console.log("2");
    if (wallet_name?.length < 3) {
      setTimeout(() => {
        setAlertModal(true);
        setAlertText(LanguageManager.createWalletTexts.validName);
      }, 200);

      return;
    }
    console.log("13");
    if (multiwallet?.length > 0) {
      const iswalletNameExist = multiwallet?.find(
        (item) => item?.walletName?.toLowerCase() == wallet_name?.toLowerCase()
      );
      console.log("4", iswalletNameExist);
      if (iswalletNameExist) {
        console.log("56", iswalletNameExist);
        setTimeout(() => {
          setAlertModal(true);

          setAlertText(LanguageManager.alertMessages.walletAlreadyExists);
        }, 200);


        return;
      }
    }
    console.log("4");

    console.log("5");

    let wallet = selectedItem;
    let updatedList = multiwallet;
    console.log("wallet--- ", wallet);

    updatedList?.length > 0 &&
      updatedList?.map((item, index) => {
        if (
          item.walletName == wallet?.walletName &&
          item?.loginRequest?.wallet_address ==
          wallet?.loginRequest?.wallet_address
        ) {
          item.walletName = wallet_name;
          item.loginRequest.wallet_name = wallet_name;
          item.login_data.walletName = wallet_name;
        }
      });
    console.log("updatedList--- ", updatedList);
    saveData(Constants.WALLET_NAME, wallet_name);
    saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(updatedList));
    // Actions.pop()
  };

  return (
    <>
      {console.log("multiwallet---- ", multiwallet)}
      {console.log("isLostSecretPhrase---- ", isLostSecretPhrase)}

      <View style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}>
        <HeaderMain
          BackButtonText={LanguageManager.manageWallet.manageWallet}
        />

        <View style={styles.mainView}>
          <View style={styles.subView}>
            <FlatList
              bounces={false}
              keyExtractor={(item, index) => index + ""}
              showsVerticalScrollIndicator={false}
              data={multiwallet}
              renderItem={({ item, index }) => {
                return (
                  <ManageItem
                    walletName={item?.login_data.walletName}
                    walletType={
                      item?.defaultWallet
                        ? LanguageManager.setting.defaultWallet
                        : item?.loginRequest.wallet_address.substring(0, 13) + "..." + item?.loginRequest.wallet_address.substring(item?.loginRequest.wallet_address.length - 4, item?.loginRequest.wallet_address.length)
                    }
                    // firstIcon={
                    //   !item?.defaultWallet
                    //     ? ThemeManager.ImageIcons.deleteIcon
                    //     : null
                    // }
                    secondIcon={ThemeManager.ImageIcons.alertIcon}
                    onClickFirst={() => {
                      deleteWalletAction(item);
                    }}
                    onClickSecond={() => {
                      selectedItem = item;
                      // setClickedItem(item);
                      setTimeout(() => {
                        setWallet_name(item?.walletName);
                        setIsSecretPhrase(true);
                      }, 300);

                      // Actions.currentScene != "UpdateWalletName" &&
                      //   Actions.UpdateWalletName({ walletItem: item });
                    }}
                    onclickWallet={() => {
                      makeDefault(item)

                    }}
                  ></ManageItem>
                );
              }}
            />
          </View>

          <View style={{ marginBottom: heightDimen(50) }}>
            <Button
              onPress={() => {
                Actions.currentScene != "ManageOnboarding" &&
                  Actions.ManageOnboarding({ screen: "managewallet" });
              }}
              customStyle={{ marginTop: 20 }}
              buttontext={LanguageManager.manageWallet.addnewWallet}
            />
          </View>
        </View>

        {showAlertDialogConfirm && (
          <ConfirmAlert
            text={LanguageManager.addressBook.yes}
            alertTxt={alertTxt}
            hideAlertDialog={() => {
              setshowAlertDialogConfirm(false);
            }}
            ConfirmAlertDialog={() => {
              deleteWallet();
            }}
          />








        )}
        <LoaderView isLoading={loading} />
      </View>

      {isSecretPhrase && (
        <BlurView
          style={styles.blurView}
          blurType="light"
          blurAmount={2}
          overlayColor={"rgba(3, 13, 13, 0.6)"}
        // reducedTransparencyFallbackColor="red"
        />
      )}

      {isSecretPhrase && (
        <CommonModal
          isTopLine={false}
          visible={isSecretPhrase}
          onClose={() => setIsSecretPhrase(false)}
          button={true}
        >
          <View style={styles.mainStyleOne}>
            <View style={styles.imagetextContainerNew}>
              <Text
                style={[styles.txt2, { color: ThemeManager.colors.blackWhiteText }]}
              >
                {LanguageManager.walletMain.Wallet}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setIsSecretPhrase(false);
                  // navigation.navigate('VerifySecretPhrase');
                }}
              >
                <Image
                  style={styles.crossIconStyle}
                  source={ThemeManager.ImageIcons.cardCross}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.ViewStyle2,
                { borderColor: ThemeManager.colors.dividerColor },
              ]}
            >
              <Input
                editable={false}
                labelRow={true}
                labelOne={LanguageManager.walletMain.Wallet}
                labelTwo={
                  selectedItem?.defaultWallet
                    ? LanguageManager.setting.default
                    : "Multicoin Wallet"
                }
                value={wallet_name}
                onChangeText={(val) => {
                  if (Constants.ALPHANUMERIC_SPACE_REGEX.test(val)) {
                    setWallet_name(val);
                  }
                }}
                placeholder={LanguageManager.walletName.nameWallet}
                maxLength={20}
                inputStyle={{ borderRadius: dimen(14) }}
                style={{ marginTop: dimen(0) }}
              />
            </View>

            <CardView
              leftImg={true}
              imgStyleLeft={{
                height: dimen(20),
                width: dimen(20),
                resizeMode: "contain",
              }}
              imgStyle={{
                height: dimen(16),
                width: dimen(22),
                resizeMode: "contain",
              }}
              leftImgIcon={ThemeManager.ImageIcons.backupMnemonics}
              leftTextStyle={styles.textStyle}
              leftText={setting.backupMnemonics}
              gradientStyle={{ marginTop: dimen(23) }}
              // ViewStyle={{paddingVertical: dimen(20)}}
              imgIcon={ThemeManager.ImageIcons.arrowRight}
              showIcon={true}
              mainStyle={{ paddingHorizontal: dimen(0), marginTop: dimen(16) }}
              hideBottom={true}
              onPress={
                () => {
                  setSelectionType("mnemonics")
                  setIsSecretPhrase(false);
                  setTimeout(() => {
                    setisLostSecretPhrase(true)
                  }, 10);

                  // setIsSecretPhrase(false);
                  // Actions.currentScene !== "EnterPinSecurity" &&
                  //   Actions.EnterPinSecurity({ fromScreen: "WalletManage", selectionType: "mnemonics", walletItem: selectedItem });



                  // Actions.ShowRecoveryPhrase({ walletItem: selectedItem });
                }
                // { Actions.currentScene != 'ManageOnboarding' && Actions.ManageOnboarding({ screen: 'managewallet' }) }
              }
            />

            <CardView

              leftImg={true}
              imgStyleLeft={{
                height: dimen(20),
                width: dimen(20),
                resizeMode: "contain",
              }}
              leftImgIcon={ThemeManager.ImageIcons.backupPrivateKey}
              leftText={setting.backupPrivateKey}
              leftTextStyle={styles.textStyle}

              imgStyle={{
                height: dimen(16),
                width: dimen(22),
                resizeMode: "contain",
              }}
              imgIcon={ThemeManager.ImageIcons.arrowRight}
              gradientStyle={{ marginTop: dimen(16) }}
              // imgStyle={{ tintColor: ThemeManager.colors.cloudy }}
              mainStyle={{ paddingHorizontal: dimen(0), marginTop: dimen(0) }}
              hideBottom={false}
              onPress={
                () => {
                  setSelectionType("managewallet")

                  setIsSecretPhrase(false);
                  setTimeout(() => {
                    setisLostSecretPhrase(true)
                  }, 10);






                  // Actions.currentScene !== "EnterPinSecurity" &&
                  //   Actions.EnterPinSecurity({ fromScreen: "WalletManage", selectionType: "privateKey", walletItem: selectedItem });
                  // Actions.ExportPrivateKeys({ walletItem: selectedItem });
                }
                // { Actions.currentScene != 'ManageOnboarding' && Actions.ManageOnboarding({ screen: 'managewallet' }) }
              }
            // img={Images.Lock}
            // text={pins.resetPasscode}
            />
            {console.log("multi==", multiwallet.length)}

            {selectedItem?.defaultWallet && multiwallet.length > 1 ? <View style={{ marginBottom: heightDimen(20) }} /> :
              <TouchableOpacity
                onPress={() => {
                  deleteWalletAction(selectedItem);
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.txtDelete,
                    { color: ThemeManager.colors.DarkRed, textAlign: "center" },
                  ]}
                >
                  {LanguageManager.setting.deleteWallet}
                </Text>
              </TouchableOpacity>
            }
            {/* {!selectedItem?.defaultWallet && (
              <CardView
              imgStyleLeft={{
                height: dimen(20),
                width: dimen(20),
                resizeMode: "contain",
              }}
         
                leftImg={true}
                leftImgIcon={ThemeManager.ImageIcons.backupPrivateKey}
                leftText={"Make Default"}
             
                // imgIcon={ThemeManager.ImageIcons.rightArrowLong}
                gradientStyle={{ marginTop: dimen(16) }}
                // imgStyle={{ tintColor: ThemeManager.colors.cloudy }}
                mainStyle={{ paddingHorizontal: dimen(0), marginTop: dimen(0) }}
                hideBottom={false}
                onPress={() => {
                  makeDefault(selectedItem);
                }}
                imgStyle={{
                  height: dimen(16),
                  width: dimen(22),
                  resizeMode: "contain",
                }}
                imgIcon={ThemeManager.ImageIcons.arrowRight}
                // img={Images.Lock}
                // text={pins.resetPasscode}
              />
            )} */}

            {/* {!selectedItem?.defaultWallet && (
              <TouchableOpacity
                onPress={() => {
                  deleteWalletAction(selectedItem);
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.txtDelete,
                    { color: ThemeManager.colors.DarkRed, textAlign: "center" },
                  ]}
                >
                  {LanguageManager.setting.deleteWallet}
                </Text>
              </TouchableOpacity>
            )} */}
            {/* <Button
              myStyle={[styles.buttonstyle]}
              buttontext={"Update"}
              onPress={() => {
                onPressContinue();
              }}
            /> */}
          </View>
        </CommonModal>
      )}

      {alertModal && (
        <AppAlert
          alertTxt={alertText}
          hideAlertDialog={() => {
            setAlertModal(false);
          }}
        />
      )}
      <CommonModal
        isTopLine={false}
        visible={isLostSecretPhrase}
        onClose={() => {
          setcheckedOne('')
          setcheckedThree('')
          setisLostSecretPhrase(false)

        }

        }
        button={true}
      >
        <View style={styles.mainStyle}>
          <View style={styles.imagetextContainer}>
            <Text
              style={[styles.txt2, { color: ThemeManager.colors.blackWhiteText }]}
            >
              {LanguageManager.walletName.thisSecretPhrase}
            </Text>
            <Text
              style={[styles.txt3, { color: ThemeManager.colors.blackWhiteText }]}
            >
              {LanguageManager.walletName.tapOnAll}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setcheckedOne(!checkedOne)}>
            <View style={styles.imagetextContainerOne}>
              <Image
                style={[styles.dotStyle, { tintColor: ThemeManager.colors.primaryColor }]}
                source={
                  checkedOne
                    ? ThemeManager.ImageIcons.checkedIcon
                    : ThemeManager.ImageIcons.unCheckedIcon
                }
                resizeMode="contain"
              />
              <Text
                style={[styles.txt4, { color: ThemeManager.colors.blackWhiteText }]}
              >
                {LanguageManager.walletName.ifILose}
              </Text>
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity onPress={() => setcheckedTwo(!checkedTwo)}>
            <View style={styles.imagetextContainerTwo}>
              <Image
                style={styles.dotStyle}
                source={
                  checkedTwo
                    ? ThemeManager.ImageIcons.checkedIcon
                    : ThemeManager.ImageIcons.unCheckedIcon
                }
              />
              <Text
                style={[styles.txt4, { color: ThemeManager.colors.blackWhiteText }]}
              >
                {LanguageManager.walletName.ifILose}
              </Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={() => setcheckedThree(!checkedThree)}>
            <View style={styles.imagetextContainerThree}>
              <Image
                style={[styles.dotStyle, { tintColor: ThemeManager.colors.primaryColor }]}
                source={
                  checkedThree
                    ? ThemeManager.ImageIcons.checkedIcon
                    : ThemeManager.ImageIcons.unCheckedIcon
                }
              />
              <Text
                style={[styles.txt4, { color: ThemeManager.colors.blackWhiteText }]}
              >
                {LanguageManager.walletName.keyWallet}
              </Text>
            </View>
          </TouchableOpacity>

          {/* <View style={styles.btnMainView}>
              <Button
                btnTextStyle={{color: ThemeManager.colors.mainColor}}
                btnstyle={[styles.buttonstyleOne]}
                buttontext={LanguageManager.sendTrx.Cancel}
                onPress={() => {
                  setisTransactionSetting(false);
                }}
              />
              <Button
                btnstyle={[styles.buttonstyle]}
                buttontext={LanguageManager.pins.Continue}
                onPress={() => {
                  setisTransactionSetting(false);
                }}
              />
            </View> */}

          <View style={[styles.btnViewModal]}>
            <View style={{ marginRight: dimen(8) }}>
              <CustomButton
                text={LanguageManager.sendTrx.Cancel}
                color={ThemeManager.colors.borderBlackGray}
                backgroundColor={'transparent'}
                styleBtn={{ borderColor: ThemeManager.colors.borderBlackGray }}
                onPress={() => {
                  setcheckedOne('')
                  setcheckedThree('')
                  setisLostSecretPhrase(false)
                }
                }
              />
              {/* <Button
                  btnstyle={{ color: ThemeManager.colors.mainColor, }}
                  myStyle={[styles.buttonstyleOne]}
                  buttontext={LanguageManager.sendTrx.Cancel}
                  onPress={() => {
                    setisLostSecretPhrase(false)
                  }}
                /> */}
            </View>
            <View style={{ marginLeft: dimen(8) }}>
              <CustomButton
                text={LanguageManager.pins.Continue}
                color={ThemeManager.colors.whiteBlacktext}
                backgroundColor={!(checkedOne && checkedThree) ? 'rgba(36, 160, 157, 0.5)' : "#24A09D"}
                styleBtn={{ borderColor: !(checkedOne && checkedThree) ? 'transparent' : LanguageManager.pins.Continue == LanguageManager.walletMain.receive ? "#737373" : "#24A09D" }}
                onPress={() => {

                  setcheckedOne('')
                  setcheckedThree('')
                  setisLostSecretPhrase(false);
                  {
                    selectionType == "mnemonics" ?
                      Actions.currentScene !== "EnterPinSecurity" &&
                      Actions.EnterPinSecurity({ fromScreen: "WalletManage", selectionType: "mnemonics", walletItem: selectedItem })

                      :

                      Actions.currentScene !== "EnterPinSecurity" &&
                      Actions.EnterPinSecurity({
                        fromScreen: "WalletManage",
                        walletItem: selectedItem,
                      })
                  }


                  setcheckedOne(''); // Example of setting checkedOne to true
                  setcheckedTwo(''); // Example of setting checkedTwo to true
                  setcheckedThree('');

                  // Actions.currentScene !== "EnterPinSecurity" &&
                  //   Actions.EnterPinSecurity({
                  //     fromScreen: "WalletManage",
                  //     walletItem: selectedItem,
                  //   });
                }}
                disabled={!(checkedOne && checkedThree)}
              />
              {/* <Button
                  myStyle={[styles.buttonstyle]}
                  btnstyle
                  buttontext={LanguageManager.pins.Continue}
                  onPress={() => {
                    setisLostSecretPhrase(false)
                    Actions.currentScene !== "EnterPinSecurity" &&
              Actions.EnterPinSecurity({fromScreen:"WalletManage",walletItem:selectedItem});
                   
                  }}
                /> */}
            </View>
          </View>
        </View>
      </CommonModal>
    </>
  );
};

export default WalletManageList;
