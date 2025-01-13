import React, { useCallback, useEffect, useRef, useState } from "react";
import { ImageBackground, Keyboard, Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LanguageManager } from "../../../../LanguageManager";
import { ThemeManager } from "../../../../ThemeManager";
import {
  getBuySellQuoteRamp,
  getCurrencyPref,
  getMinMaxOnOffRamp,
  getOnOffRampCoins,
} from "../../../Redux/Actions";
import { dimen, widthDimen } from "../../../Utils";
import { AppAlert, Button, HeaderMain, LoaderView } from "../../common";
import ModalList from "../../common/ModalList";
import ProviderOfferCard from "../../common/ProviderOfferCard";
import TextInputDropDown from "../../common/TextInputDropDown";
import { styles } from "./styles";
import { AppAlertDialog } from "../../common/AppAlertDialog";
import { bigNumberFormat, toFixedExp } from "../../../Utils/MethodsUtils";
import { Actions } from "react-native-router-flux";
import Singleton from "../../../Singleton";
import { EventRegister } from "react-native-event-listeners";
import * as Constants from "../../../Constants";
import { useDispatch, useSelector } from "react-redux";
import { MERCURYO_REDIRECT_URL } from "../../../EndPoint";
import crypto from 'react-native-crypto'

const BuySellCoin = ({ navigation }) => {
  const dispatch = useDispatch()
  const coinList = useSelector(state => state?.walletReducer?.coinList)
  const [allFiatList, setAllFiatList] = useState([])
  const [allCryptoList, setCryptoList] = useState([])
  const [selectedTabData, setSelectedTabData] = useState("buy");
  const [youPay, setYouPay] = useState("");
  const [payModal, setPayModal] = useState(false);
  const [receiveModal, setReceiveModal] = useState(false);
  const [initialCurrencies, setInitialCurrencies] = useState([]);
  const [initialCryptos, setInitialCryptos] = useState([]);
  const tabData = ["buy", "sell"];
  const [selectedCurrencies, setSelectedCurrencies] = useState({});
  const [selectedCrypto, setSelectedCrypto] = useState({});
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [toValue, setToValue] = useState("");
  const [minMax, setMinMax] = useState({
    min: 0,
    max: 0
  })
  const quoteRef = useRef()

  useEffect(() => {
    const blurListener = navigation.addListener("didBlur", () => {

      setIsLoading(false);
    });

    dispatch(getCurrencyPref())
      .then(res => {
        getOnOffRampDetails(res);

      }).catch(err => {
        // getOnOffRampDetails([]);

      })


    // this event is handled when user moves the app to background
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {

      setPayModal(false);
      setReceiveModal(false);
      setAlertText("");
      setShowAlert(false);
    });

    return () => {
      Singleton.getInstance().buySellSelectedCoin = null
      blurListener && blurListener.remove();
    };
  }, []);


  const onSelectedTab = (item, isBypass) => {
    if (selectedTabData == item && isBypass == undefined) {
      return;
    }
    setSelectedTabData(item);
    setErrorMsg("")
    setYouPay("");
    setToValue("");
    if (item == "buy") {
      onBuyTabPress(allFiatList, allCryptoList)
    } else {
      onSellPress(allFiatList, allCryptoList)
    }

  };

  const getOnOffRampDetails = (list) => {
    dispatch(getOnOffRampCoins())
      .then(async (res) => {
        const { fiat, config } = res?.data
        const payList = list?.filter(res => fiat?.includes(res?.currency_code))
        setAllFiatList(payList)
        let cryptoCurrencies = config?.crypto_currencies
        cryptoCurrencies = cryptoCurrencies?.filter(res => res?.network?.toUpperCase() == "ETHEREUM" ||
          res?.network?.toUpperCase() == "TRON" ||
          res?.network?.toUpperCase() == "SOLANA" ||
          res?.network?.toUpperCase() == "POLYGON" ||
          res?.network?.toUpperCase() == "BINANCESMARTCHAIN" ||
          res?.network?.toUpperCase() == "BITCOIN"
        )
        cryptoCurrencies = cryptoCurrencies?.map(res => {
          return {
            ...res,
            coin_family: getCoinFamily(res?.network?.toUpperCase()),
            // coin_image: config?.icons?.[res?.currency]?.png || config?.icons?.[res?.currency]?.svg,
            display_options: config?.display_options?.[res?.currency],
          }
        })
        setCryptoList(cryptoCurrencies)
        onBuyTabPress(payList, cryptoCurrencies)
      })
      .catch((error) => {
        console.error("Error fetching on/off ramp details:", error);
        setIsLoading(false);
      });
  };

  const onBuyTabPress = (payList, cryptoCurrencies) => {

    let currencyCode = Singleton.getInstance().CurrencySelected || "USD"
    currencyCode = payList?.find(res => res?.currency_code == currencyCode)
    currencyCode = currencyCode || payList?.[0]
    setInitialCurrencies(payList);
    setSelectedCurrencies(currencyCode);




    let list = coinList?.map(res => {
      if (res?.is_token == 0) {
        const item = cryptoCurrencies?.find(mItem => ((mItem?.coin_family == res?.coin_family) && mItem?.contract == ""))
        if (item) {
          return { ...res, ...item }
        } else {
          return null
        }
      } else {
        const item = cryptoCurrencies?.find(mItem => (mItem?.contract?.toUpperCase() == res?.token_address?.toUpperCase()))
        if (item) {
          return { ...res, ...item }
        } else {
          return null
        }
      }
    })
    list = list?.filter(res => res != null)


    console.log("cryptoCurrencies>>>", JSON.stringify(list));

    setInitialCryptos(list);
    let selectedCoin = list?.[0]

    console.log("Singleton.getInstance()?.buySellSelectedCoin>>>>", Singleton.getInstance()?.buySellSelectedCoin);


    if (Singleton.getInstance()?.buySellSelectedCoin != null) {
      const item = Singleton.getInstance()?.buySellSelectedCoin
      if (item?.is_token == 0) {
        selectedCoin = list?.find(res => ((res?.coin_family == item?.coin_family) && res?.contract == ""))
      } else {
        const tokenItem = list?.find(mItem => (mItem?.contract?.toUpperCase() == item?.token_address?.toUpperCase()))
        if (tokenItem) {
          selectedCoin = tokenItem
        } else {
          selectedCoin = list?.find(res => ((res?.coin_family == item?.coin_family) && res?.contract == ""))
        }
      }
    }

    console.log("SELECTED>>>", selectedCoin);

    setSelectedCrypto(selectedCoin);
    getMinMaxValue(currencyCode?.currency_code, selectedCoin?.currency)
    setIsLoading(false);
  }

  const onSellPress = (payList, cryptoCurrencies) => {
    let list = coinList?.map(res => {
      if (res?.is_token == 0) {
        const item = cryptoCurrencies?.find(mItem => ((mItem?.coin_family == res?.coin_family) && mItem?.contract == ""))
        if (item) {
          return { ...res, ...item }
        } else {
          return null
        }
      } else {
        const item = cryptoCurrencies?.find(mItem => (mItem?.contract?.toUpperCase() == res?.token_address?.toUpperCase()))
        if (item) {
          return { ...res, ...item }
        } else {
          return null
        }
      }
    })
    list = list?.filter(res => res != null)

    setInitialCryptos(list);
    let selectedCoin = list?.[0];
    if (Singleton.getInstance()?.buySellSelectedCoin != null) {

      const item = Singleton.getInstance()?.buySellSelectedCoin
      if (item?.is_token == 0) {
        selectedCoin = list?.find(res => ((res?.coin_family == item?.coin_family) && item?.is_token == 0))
      } else {
        const tokenItem = list?.find(mItem => (mItem?.contract?.toUpperCase() == item?.token_address?.toUpperCase()))
        if (tokenItem) {
          selectedCoin = tokenItem
        } else {
          setTimeout(() => {
            onSelectedTab("buy", true)
          }, 1000);

          return showErr(item?.coin_symbol?.toUpperCase() + " is not available for sell.")
        }
      }

    }
    console.log("selectedCoin>>>", selectedCoin);


    setSelectedCurrencies(selectedCoin);
    payList = payList.filter(res => res?.currency_code == "USD" || res?.currency_code == "EUR")
    let currencyCode = "USD"

    const item = payList?.find(res => res?.currency_code == currencyCode)


    setInitialCurrencies(payList);
    setSelectedCrypto(item);
    getMinMaxValue(selectedCoin?.currency, item?.currency_code)

    console.log("COIN>>>>", list);

  }

  const getCoinFamily = (value) => {
    let family = 1

    if (value == "ETHEREUM") { family = 2 }
    else if (value == "TRON") { family = 6 }
    else if (value == "SOLANA") { family = 5 }
    else if (value == "POLYGON") { family = 4 }
    else if (value == "BINANCESMARTCHAIN") { family = 1 }
    else if (value == "BITCOIN") { family = 3 }
    return family

  }
  const getMinMaxValue = (from, to,) => {
    dispatch(getMinMaxOnOffRamp(from, to, selectedTabData))
      .then(res => {
        const data = res?.data?.[from]
        console.log("data>", data);
        setMinMax(data)
      })
      .catch(err => {
        console.log("ERR>", err);

      })
  }

  const getValue = (bal) => {
    console.log(bal, "balbalbalbalbalbal");

    if (bal > 0) {
      const NewBal =
        bal < 0.000001
          ? toFixedExp(bal, 8)
          : bal < 0.0001
            ? toFixedExp(bal, 6)
            : toFixedExp(bal, 4);
      return NewBal;
    } else return "0.0000";
  };


  /******************************************************************************************/
  const getAddress = (coinFamily) => {
    const address =
      coinFamily == 6
        ? Singleton.getInstance().defaultTrxAddress
        : coinFamily == 3
          ? Singleton.getInstance().defaultBtcAddress
          : coinFamily == 5
            ? Singleton.getInstance().defaultSolAddress
            : Singleton.getInstance().defaultEthAddress;

    console.log('defaultEthAddress ======', Singleton.getInstance().defaultEthAddress)
    console.log('defaultBnbAddress ======', Singleton.getInstance().defaultBnbAddress)
    return address;
  };


  const getOnOffRampQuote = (value) => {
    clearTimeout(quoteRef.current)
    quoteRef.current = setTimeout(() => {
      let from = selectedCurrencies?.currency_code;
      let to = selectedCrypto?.currency
      let network = selectedCrypto?.network
      if (selectedTabData == "sell") {
        to = selectedCrypto?.currency_code
        from = selectedCurrencies?.currency
        network = selectedCurrencies?.network
      }

      if (bigNumberFormat(value).isLessThan(minMax?.min)) {
        showErr("Minimum amount should be greater then " + toFixedExp(minMax.min, 6) + " " + from)
      } else if (bigNumberFormat(value).isGreaterThan(minMax?.max)) {
        showErr("Maximum amount should be less then " + toFixedExp(minMax.max, 6) + " " + from)
      } else {
        setIsLoading(true)


        dispatch(getBuySellQuoteRamp(selectedTabData, from, to, value, network))
          .then(res => {
            console.log("RES>>>>", res);
            setIsLoading(false)
            if (res?.message == "Amount off limits.") {
              const min = res?.data?.[from?.toUpperCase()]?.min
              const max = res?.data?.[from?.toUpperCase()]?.max
              if (bigNumberFormat(value).isLessThan(min)) {
                showErr("Minimum amount should be greater then " + toFixedExp(min, 6) + " " + from)
              } else if (bigNumberFormat(value).isGreaterThan(max)) {
                showErr("Maximum amount should be less then " + toFixedExp(max, 6) + " " + from)
              }
              setToValue("")
            } else if (res?.code == 400001) {
              setErrorMsg(res?.data?.from?.[0] || "Something went wrong")
              showErr(res?.data?.from?.[0] || "Something went wrong")
            } else {
              setToValue(selectedTabData == "buy" ? res?.data?.amount : res?.data?.fiat_amount)
            }
          })
          .catch(err => {

            showErr(err?.message)

            console.log("err>>>>", err);

            setIsLoading(false)

          })

      }
    }, 1200);

  }
  const onPressContinue = () => {
    try {
      if (errorMsg != "") {
        showErr(errorMsg)
        return
      } else if (selectedTabData == "buy" && selectedCrypto == undefined) {
        showErr("Please choose asset")
        return
      } else if (selectedTabData == "sell" && selectedCurrencies == undefined) {
        showErr("Please choose asset")
        return
      } else if (bigNumberFormat(youPay).isLessThan(minMax?.min)) {
        showErr("Minimum amount should be greater then " + toFixedExp(minMax.min, 4) + " " + (selectedTabData == "buy" ? selectedCrypto?.currency : selectedCurrencies?.currency))
        return
      } else if (bigNumberFormat(youPay).isGreaterThan(minMax?.max)) {
        showErr("Maximum amount should be less then " + toFixedExp(minMax.max, 4) + " " + (selectedTabData == "buy" ? selectedCrypto?.currency : selectedCrypto?.currency))
        return
      } else if (toValue == "" || toValue == undefined || toValue == null) {
        showErr("Please enter amount")
        return
      }
      console.log("selectedCrypto<<<", selectedCrypto);
      let wallet_address = getAddress(selectedCrypto?.coin_family)
      console.log("wallet_address data ======", wallet_address);

      let merchant_transaction_id = Math.random().toString(36).substr(2) + Date.now().toString(36);
      let secret = wallet_address + Constants.MERCURYO_SECRET_KEY;
      let signature = crypto.createHash("sha512").update(secret).digest("hex");
      let orderUrl = ""
      let sourceCurrName = selectedCurrencies?.currency_code
      let network = selectedCrypto?.network
      let targetCurrName = selectedCrypto?.currency
      let sourceAmount = youPay
      let targetAmount = toValue
      let coin_family = selectedCrypto?.coin_family
      let backHead = "Buy "
      let coinId = selectedCrypto?.coin_id
      if (selectedTabData == "sell") {
        sourceCurrName = selectedCrypto?.currency_code
        network = selectedCurrencies?.currency_code
        targetCurrName = selectedCurrencies?.currency
        coin_family = selectedCurrencies?.coin_family
        sourceAmount = toValue
        targetAmount = youPay
        backHead = "Sell "
        coinId = selectedCurrencies?.coin_id
      }

      // if (selectedTabData == "buy") {
      //   if(Singleton.getInstance().buySellSelectedCoin  !=null){

      //   }else{
      //     coinList?.map(res => {
      //       if (res?.is_token == 0 && selectedCrypto?.coin_family != res?.coin_family) {
      //         coinId = res?.coin_id
      //       } else if (res?.token_address?.toUpperCase() == selectedCrypto?.contract?.toUpperCase()) {
      //         coinId = res?.coin_id
      //       }
      //     })
      //   }
      // }


      let apiReq = {
        ramp_type: "mercuryo",
        coin_id: coinId,
        coin_family: coin_family,
        tx_type: selectedTabData,
        wallet_address: wallet_address,
        amount: selectedTabData == "sell" ? targetAmount : sourceAmount,
        fiat_price: Number(selectedTabData == "sell" ? sourceAmount : targetAmount),
        fiat_type: sourceCurrName,
        merchant_id: merchant_transaction_id,
        order_id: merchant_transaction_id
      }

      console.log("REQ>>>>", apiReq);


      selectedTabData == "sell"
        ? (orderUrl = `https://exchange.mercuryo.io/?widget_id=${Constants.MERCURYO_WIDGET_ID}&type=sell&fiat_currency=${sourceCurrName}&fix_fiat_currency=true&fiat_amount=${sourceAmount}&fix_fiat_amount=true&currency=${targetCurrName}&fix_currency=true&amount=${targetAmount}&fix_amount=true&address=${wallet_address}&redirect_url=${MERCURYO_REDIRECT_URL}&merchant_transaction_id=${merchant_transaction_id}&signature=${signature}&refund_address=${wallet_address}`)
        : (orderUrl = `https://exchange.mercuryo.io/?widget_id=${Constants.MERCURYO_WIDGET_ID}&type=buy&fiat_currency=${sourceCurrName}&fix_fiat_currency=true&network=${network}&currency=${targetCurrName}&fix_currency=true&fiat_amount=${sourceAmount}&fix_fiat_amount=true&amount=${targetAmount}&fix_amount=true&address=${wallet_address}&redirect_url=${MERCURYO_REDIRECT_URL}&merchant_transaction_id=${merchant_transaction_id}&signature=${signature}`)

      console.log("orderUrl>>>>", orderUrl);


      Actions.currentScene != "BuySellWebview" &&
        Actions.BuySellWebview({
          providerName: backHead + targetCurrName,
          redirectLink: orderUrl,
          apiReq: apiReq,
          onSuccess: () => {
            setToValue("")
            setYouPay("")
          }
        });
      setTimeout(() => {
        setIsLoading(false);
      }, 800);
    } catch (error) {
      console.log("onPressContinue error =======", error);
      setIsLoading(false);

    }
  };

  const showErr = (err) => {
    setAlertText(err);
    setShowAlert(true);
  }

  return (
    <ImageBackground
      source={ThemeManager.ImageIcons.mainBgImgNew}
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
    >
      <HeaderMain
        BackButtonText={LanguageManager.contactUs.buySell}
        customStyle={{ paddingHorizontal: widthDimen(24) }}
        showBackBtn={false}
      />
      <KeyboardAwareScrollView style={{ flexGrow: 1 }} bounces={false}>
        <View style={[styles.mainView, { paddingHorizontal: dimen(24) }]}>
          <View style={{ flexDirection: "row" }}>
            {tabData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.tabView,
                  {
                    borderColor:
                      item === selectedTabData
                        ? ThemeManager.colors.primaryColor
                        : ThemeManager.colors.legalGreyColor,
                  },
                ]}
                activeOpacity={0.9}
                onPress={() => onSelectedTab(item)}
              >
                <Text
                  style={[
                    {
                      color:
                        item === selectedTabData
                          ? ThemeManager.colors.primaryColor
                          : ThemeManager.colors.legalGreyColor,
                    },
                    styles.tabText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={[styles.spaceRow, styles.receiveView, { marginTop: dimen(0), }]}>
            <Text
              style={[
                { color: ThemeManager.colors.blackWhiteText },
                styles.payText,
              ]}
            >
              {selectedTabData == "sell"
                ? LanguageManager.changellyBuySell.youSell
                : LanguageManager.changellyBuySell.youPay}
            </Text>
            {selectedTabData == "sell" &&
              !!selectedCrypto &&
              !!selectedCurrencies && (
                <Text
                  style={[
                    { color: ThemeManager.colors.blackWhiteText },
                    styles.payText,
                  ]}
                >
                  {LanguageManager.commonText.Balance}:{" "}
                  <Text style={{ color: ThemeManager.colors.primaryColor }}>
                    {getValue(
                      selectedCrypto?.balance ||
                      selectedCurrencies?.balance
                    )}{" "}
                    {(
                      selectedCrypto?.coin_symbol ||
                      selectedCurrencies?.coin_symbol
                    )?.toUpperCase()}
                  </Text>
                </Text>
              )}
          </View>
          <TextInputDropDown
            value={youPay}
            onChangeText={(val) => {
              let decim = 2
              if (selectedTabData == "sell") {
                decim = 6
              }
              if (val.includes(",")) val = val.replace(",", ".");
              if (val == ".") val = "0.";
              const expression = new RegExp("^\\d*\\.?\\d{0," + decim + "}$");
              if (expression.test(val)) {
                setYouPay(val.trim());
                setErrorMsg("")
                getOnOffRampQuote(val.trim())
              }
            }}
            cointImage={
              selectedCurrencies?.image || selectedCurrencies?.coin_image
            }
            cointName={
              selectedCurrencies?.currency_code || selectedCurrencies?.currency
            }
            dropDown={true}
            onPressDropDown={() => setPayModal(true)}
            keyboardType={"numeric"}
            placeholder={"0.00"}
            maxLength={20}
          />
          <View style={styles.receiveView}>
            <Text
              style={[
                { color: ThemeManager.colors.blackWhiteText },
                styles.payText,
              ]}
            >
              {LanguageManager.changellyBuySell.youReceive}
            </Text>
          </View>
          <TextInputDropDown
            value={toValue}
            cointImage={selectedCrypto?.coin_image || selectedCrypto?.image}
            cointName={selectedCrypto?.currency || selectedCrypto?.currency_code}
            dropDown={true}
            onPressDropDown={() => setReceiveModal(true)}
            editable={false}
            placeholder={"0.00"}
          />

        </View>
      </KeyboardAwareScrollView>

      <Button
        customStyle={styles.buttonStyle}
        buttontext={
          selectedTabData == "sell" ? "Sell" : "Buy"
        }
        onPress={onPressContinue}
      />

      <ModalList
        openModel={payModal}
        isResetSearchOnBack
        title={selectedTabData == "buy" ? LanguageManager.merchantCard.chooseCurrency : LanguageManager.commonText.ChooseAsset}

        // title={LanguageManager.merchantCard.chooseCurrency}
        handleBack={() => setPayModal(false)}
        list={selectedTabData == "sell" ? initialCryptos : initialCurrencies}
        onPress={(item) => {
          setSelectedCurrencies(item);
          setPayModal(false);
          getMinMaxValue(item?.currency_code, selectedCrypto?.currency)
          setYouPay("");
          setToValue("")
          setErrorMsg("")
        }}
      />
      <ModalList
        openModel={receiveModal}
        isResetSearchOnBack
        title={selectedTabData == "sell" ? LanguageManager.merchantCard.chooseCurrency : LanguageManager.commonText.ChooseAsset}
        handleBack={() => setReceiveModal(false)}
        list={selectedTabData == "sell" ? initialCurrencies : initialCryptos}
        onPress={(item) => {
          setSelectedCrypto(item);
          setReceiveModal(false);
          getMinMaxValue(item?.currency, selectedCurrencies?.currency_code)
          setYouPay("");
          setToValue("")
          setErrorMsg("")
        }}
      />
      <LoaderView isLoading={isLoading} />
      {showAlert && (
        <AppAlert
          alertTxt={alertText}
          hideAlertDialog={() => {
            setShowAlert(false);
          }}
        />
      )}
    </ImageBackground>
  );
};

export default React.memo(BuySellCoin);
