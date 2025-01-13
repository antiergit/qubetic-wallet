import React, { useState, useEffect, useCallback, memo, useRef, useMemo } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import {
  onChainSwapList,
  getSwapPriceDiff,
  requestSendCoin,
  fetchNativePrice,
  getCommissionData,
  getInchTokenList,
  getInchQuote,
  checkInchAllowance,
  inchSwap,
  getGasslessTokens,
  inchSwapSpender,
  getUserBalance,
} from "../../../Redux/Actions";
import {
  AppAlert,
  Button,
  ConfirmSwap,
  Divider,
  GradientBorderView,
  LoaderView,
  ModalCoinList,
  SelectCurrencyNew,
} from "../../common";
import {
  bigNumberFormat,
  bigNumberSafeMath,
  currencyFormat,
  exponentialToDecimal,
  exponentialToDecimalWithoutComma,
  getData,
  getEncryptedData,
  saveData,
  swapToFixed,
  toFixed,
  toFixedExp,
} from "../../../Utils/MethodsUtils";
import { Images, Fonts } from "../../../theme";
import { ThemeManager } from "../../../../ThemeManager";
import * as Constants from "../../../Constants";
import { Actions } from "react-native-router-flux";
import { useDispatch } from "react-redux";
import Web3 from "web3";
import TOKEN_ABI from "../../../tokenContract.ABI.json";
import { BigNumber } from "bignumber.js";
import Singleton from "../../../Singleton";
import styles from "./onChainStyle";
import { EventRegister } from "react-native-event-listeners";
import { ConfirmAlert } from "../../common/ConfirmAlert";
import { LanguageManager } from "../../../../LanguageManager";
import CommonModal from "../../common/CommonModal";
import images from "../../../theme/Images";
import TxTWithRightINfo from "../../common/TxTWithRightINfo";
import ImgTxtTxt from "../../common/ImgTxtTxt";
import { getDimensionPercentage, heightDimen } from "../../../Utils";
import { EVM_DERIVATION, signTransaction, unmarshalSignature } from "../../../TangemUtils";
import { ethers } from 'ethers';
import { Modal } from "react-native";
import EnterPinForTransaction from "../EnterPinForTransaction/EnterPinForTransaction";
import PriceImpactModal from "../../common/PriceImpactModal";
import LinearGradient from "react-native-linear-gradient";
import colors from "../../../theme/Colors";
import { set } from "react-native-reanimated";
import GradentCardView from "../../common/GradentCardView";
var debounce = require("lodash.debounce");
let routerAddress = '0xdef1c0ded9bec7f1a1670819833240f027b25eff' // uniswap router address


const GAS_FEE_MULTIPLIER = 0.000000000000000001;
let tokenOne = "";
let tokenTwo = "";
let chainId = 1;
const inputType = {
  firstInput: "firstInput",
  secondInput: "secondInput",
};
let blockChain = "binancesmartchain";
let commissionData = "";
let savedSlippage = 1
let isApprovalTxn = false
let firstInputAmount = ""

const tabData = [
  { title: "25%", key: "1", selected: false },
  { title: "50%", key: "2", selected: false },
  { title: "75%", key: "3", selected: false },
  { title: "100%", key: "4", selected: false },
];
const slippageData = [
  { title: "Auto", key: "1", value: 1 },
  { title: "0.1%", key: "2", value: 0.1 },
  { title: "0.5%", key: "3", value: 0.5 },
  { title: "1%", key: "4", value: 1 },
  { title: "Custom", key: "5" },
];
let walletAddressDefault = null; // kept it here because it's updated value is not being fetched when api's are called from focus listener

/******************************************************************************************/
const OneInchSwap = (props) => {
  const { alertMessages, pins, swapText, sendTrx } = LanguageManager;
  const RESET_SLIPPAGE_VALUE = {
    title: "Auto",
    key: "1",
    value: 1,
  }
  const [isLoading, setLoading] = useState(false);
  const [isLoadingText, setLoadingText] = useState(false);
  const [coinList, setCoinList] = useState([]);
  const [gaslessCoinList, setgaslessCoinList] = useState([]);
  const [ExistingCoinList, setExistingCoinList] = useState([]);
  const [NonExistingCoinList, setNonExistingCoinList] = useState([]);
  const [tokenFirst, setTokenFirst] = useState();
  const [tokenSecond, setTokenSecond] = useState();
  const [userBal, setUserBal] = useState(0);
  const [userEthBal, setUserEthBal] = useState(0);
  const [ExistingCoinModal, setExistingCoinModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [AlertDialogNew, showAlertDialogNew] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState("");
  const [tokenTwoAmount, setTokenTwoAmount] = useState("");
  const [alertTxt, setAlertTxt] = useState("");
  const [gasPrice, setGasPrice] = useState(0);
  const [NonExistingCoinModal, setNonExistingCoinModal] = useState(false);
  const [search, setSearch] = useState("");
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [PairNotExist, setPairNotExist] = useState(false);
  const [isApproved, setUserApproval] = useState(true);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [transactionFee, setTransactionFee] = useState("0.000000");
  const [rawTxnObj, setRawTxnObj] = useState({});
  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  const [toggleSwap, setToggleSwap] = useState(false);
  const [showApproveModaL, setShowApproveModal] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [fromSearch, setFromSearch] = useState(false);
  const [finalPath, setFinalPath] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [inputTypeForApproval, setInputTypeForApproval] = useState(null);
  const [tokenFirstForApproval, setTokenFirstForApproval] = useState(null);
  const [tokenSecondForApproval, setTokenSecondForApproval] = useState(null);
  const [valueForApproval, setValueForApproval] = useState(null);
  const [fromToAmtDiff, setFromToAmtDiff] = useState(0);
  const [selectedInput, setSelectedInput] = useState(inputType.firstInput);
  const [AlertDialog1, showAlertDialog1] = useState(false);
  const [showSuccess, setShowSucess] = useState(false);
  const [confirmTxnModalApprove, setConfirmTxnModalApprove] = useState(false);
  const [confirmTxnModalSwap, setConfirmTxnModalSwap] = useState(false);
  const [nativePrice, setNativePrice] = useState("0.00");
  const [previewModal, setPreviewModal] = useState(false);
  const [modalState, setModalState] = useState(false);
  const [slippageModal, setslippageModal] = useState(false);
  const [isReqSent, setIsReqSent] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [makerUserId, setMakerUserId] = useState('');
  const [showPinModal, setShowPinModal] = useState(false)
  const [inputSlippage, setinputSlippage] = useState("");
  const [selectedSlippage, setselectedSlippage] = useState(RESET_SLIPPAGE_VALUE);
  const [conversionQuote, setconversionQuote] = useState("0");
  const [priceImpactState, setPriceImpactState] = useState(true);
  const [pairModalAlert, setPairModalAlert] = useState(false);
  const scrollRef = useRef();
  const dispatch = useDispatch();
  /****************************************************************** */
  const [encodeData, setencodeData] = useState("");



  /******************************************************************************************/
  useEffect(() => {
    if (!props?.isVisible) {
      setTokenTwoAmount("");
      setTokenOneAmount("");
      setconversionQuote("0");
      setSelectedIndex(null);
    }
  }, [props?.isVisible])
  /******************************************************************************************/
  useEffect(() => {

    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      console.log("chk currentScene:::::::", Actions.currentScene);
      (Actions.currentScene == "_Swap" || Actions.currentScene == "Swap") &&
        loadState();
    });

    loadState();

    let focusListener = props.navigation.addListener("didFocus", () => {

      loadState();
    });
    let blurListener = props.navigation.addListener("didBlur", () => {
      saveLastSelectedCoins(tokenOne?.coin_id, tokenTwo?.coin_id)
      setExistingCoinModal(false);
      setNonExistingCoinModal(false);
      setConfirmTxnModalApprove(false);
      setConfirmTxnModalSwap(false);
      setModalState(false);
      setslippageModal(false);
      setPreviewModal(false);
      setPriceImpactState(true);
      setPairModalAlert(false);
      _scrollToTop();
    });

    return () => {
      focusListener.remove();
      blurListener.remove();
    };
  }, []);

  const _scrollToTop = () => {
    if (scrollRef !== null) {
      if (scrollRef.current !== null) {
        scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
      }
    }
  };

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Updates the wallet address according to the currently selected network.
   * @private
   */
  /******  5d67d859-c3f6-47e9-b15d-d58fa83873c1  *******/
  const updateWalletAddress = () => {
    console.log('updateWalletAddress -------', Singleton.getInstance()?.defaultEthAddress)
    walletAddressDefault =
      Singleton.getInstance()?.defaultEthAddress ??
      Singleton.getInstance().defaultBnbAddress ??
      Singleton.getInstance().defaultMaticAddress;

    savedSlippage = 1;
    setselectedSlippage(RESET_SLIPPAGE_VALUE);
  };
  /******************************************************************************************/
  const loadState = () => {
    setLoading(false);
    firstInputAmount = ""
    setLoadingText(false);
    getFromToAmtDiff();
    setTokenOneAmount("");
    setTokenTwoAmount("");
    setconversionQuote("0");
    setSelectedIndex(null);
    setUserApproval(true);
    setInsufficientBalance(false);
    setConfirmTxnModalApprove(false);
    setConfirmTxnModalSwap(false);
    showAlertDialogNew(false);
    setPairNotExist(false);
    setTransactionFee("0.00");
    getList_gasPrice();
    getApiCommissonData();
    updateWalletAddress()
    // ******
  };

  /******************************************************************************************/
  const getFromToAmtDiff = () => {
    dispatch(getSwapPriceDiff())
      .then(async (res) => {
        console.log("res===>>>>>", res);
        setFromToAmtDiff(res?.value);
      })
      .catch((err) => {
        console.log("getFromToAmtDiff_Err===>>>>>", err);
        setLoading(false);
      });
  };

  /******************************************************************************************/
  const getList_gasPrice = async () => {

    getGasPrice();
    await getData(Constants.ONCHAIN_LIST).then(async (swapList) => {
      const lastSelectedCoins = await getLastSelectedCoins()

      console.log("lastSelectedCoins>>>>", lastSelectedCoins);

      if (swapList != null) {
        console.log("swapList>>>>", typeof swapList);

        const SwapList = JSON.parse(swapList);

        const swapSelectedCoin = Singleton.getInstance().swapSelectedCoin?.selectedCoin;
        let selectedCoin = null;
        try {
          if (Singleton.getInstance().swapSelectedCoin != null && Singleton.getInstance().swapSelectedCoin?.isOnChain) {
            selectedCoin = SwapList.find(item => item.coin_id == swapSelectedCoin?.coin_id);
          } else {
            selectedCoin = lastSelectedCoins?.from ? SwapList.find(item => item.coin_id == lastSelectedCoins?.from) : SwapList[0];
          }
        } catch (error) {
          selectedCoin = SwapList[0]
        }

        selectedCoin = selectedCoin || SwapList[0]
        console.log("selectedCoin1111>>>>", selectedCoin);

        const existingList = SwapList.filter(
          (item) => item.wallets?.length > 0 && item.coin_family == selectedCoin.coin_family
        );

        const nonExistItem = SwapList.filter(
          (item) => item.coin_family == selectedCoin.coin_family
        );

        selectedCoin = selectedCoin || existingList[0];

        setCoinList(SwapList);
        setExistingCoinList(existingList);
        setNonExistingCoinList(nonExistItem);
        setTokenFirst(selectedCoin);
        getUserBal(selectedCoin);
        tokenOne = selectedCoin;
        console.log("TokenFirst:::::::", selectedCoin);
        console.log("nonExistItem:::::::", nonExistItem);

        chainId = tokenOne?.coin_family == 1 ? 56 : tokenOne?.coin_family == 4 ? 137 : 1;
        let toToken = lastSelectedCoins?.to ? nonExistItem.find(item => item.coin_id == lastSelectedCoins?.to) : nonExistItem[0]
        toToken = toToken ? toToken : nonExistItem[0]
        let isExist =
          nonExistItem && existingList
            ? toToken?.coin_symbol?.toLowerCase() ==
            selectedCoin?.coin_symbol?.toLowerCase()
            : "";
        if (isExist) {
          toToken = nonExistItem[0]
          isExist = toToken?.coin_symbol?.toLowerCase() == selectedCoin?.coin_symbol?.toLowerCase()
        }

        if (existingList?.length > 0) {
          setTokenSecond(isExist ? nonExistItem[1] : toToken);
          tokenTwo = isExist ? nonExistItem[1] : toToken;
        } else {
          setTokenSecond();
        }
        getSwapList();
      } else {
        getSwapList();
      }
    });
  };
  /****************************************get commission data**************************************************/
  const getApiCommissonData = () => {
    dispatch(getCommissionData())
      .then(async (res) => {
        console.log("getCommissionData==success=>>>>>", res);
        commissionData = res?.data;
      })
      .catch((err) => {
        console.log("getCommissionData===error>>>>>", err);
        setLoading(false);
      });
  };

  /******************************************************************************************/
  const getGasPrice = () => {
    getWeb3Object()
      .eth.getGasPrice()
      .then((gasPrice) => {
        console.log("-----------------gasPrice-----------", gasPrice);
        setGasPrice(gasPrice);
      })
      .catch((err) => {
        console.log(":::::::::getGasPrice_ERR", err);
        if (err == "Please check your network connection") {
          setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
          showAlertDialogNew(true);
        }
        setLoading(false);
      });
  };

  /******************************************************************************************/
  const getSwapList = async () => {
    getData(Constants.ACCESS_TOKEN)
      .then(async (ACCESS_TOKEN) => {
        setLoading(true);
        const ethAddress = walletAddressDefault;
        const addrsListKeys = [ethAddress, ethAddress, ethAddress];
        let tempCoinFam = await getData(Constants.COIN_FAMILY_LIST);
        try {
          tempCoinFam = tempCoinFam ? JSON.parse(tempCoinFam) : tempCoinFam;
        } catch (error) {
          console.log('tempCoinFam json parse error-------')
        }
        console.log(">tempCoinFam>>>>", tempCoinFam);

        let coin_family = tempCoinFam;
        coin_family = coin_family?.filter(res => res != 3 && res != 5 && res != 6);

        dispatch(onChainSwapList({ ACCESS_TOKEN, addrsListKeys, coin_family }))
          .then(async (res) => {
            // console.log("res:::::::", res);
            const swapSelectedCoin = Singleton.getInstance().swapSelectedCoin?.selectedCoin;
            const lastSelectedCoins = await getLastSelectedCoins()
            let selectedCoin = null
            try {
              if (Singleton.getInstance().swapSelectedCoin != null && Singleton.getInstance().swapSelectedCoin?.isOnChain) {
                selectedCoin = res.find(item => item.coin_id == swapSelectedCoin?.coin_id);

              } else {
                selectedCoin = lastSelectedCoins?.from ? res.find(item => item.coin_id == lastSelectedCoins?.from) : res[0];
              }
            }
            catch (error) {
              selectedCoin = res[0]
            }

            selectedCoin = selectedCoin ? selectedCoin : existingList[0];
            const existingList = res.filter((item) => item.wallets?.length > 0 && item.coin_family == selectedCoin.coin_family);

            const nonExistItem = res.filter(
              (item) => item?.coin_family == selectedCoin?.coin_family
            );
            setCoinList(res);
            setExistingCoinList(existingList);
            setNonExistingCoinList(nonExistItem);
            selectedCoin = await getUserBalanceFunction(selectedCoin); //{ ...selectedCoin, balance: newBalance }
            console.log("selectedCoin1111>>", selectedCoin);

            setTokenFirst(selectedCoin);
            getUserBal(selectedCoin);
            tokenOne = selectedCoin;
            chainId = tokenOne?.coin_family == 1 ? 56 : tokenOne?.coin_family == 4 ? 137 : 1; 1;
            blockChain =
              selectedCoin?.coin_family == 1
                ? "binancesmartchain"
                : selectedCoin?.coin_family == 4 ? "polygon" : "ethereum";

            let toToken;
            try {
              toToken = lastSelectedCoins?.to ? nonExistItem.find(item => item.coin_id == lastSelectedCoins?.to) : nonExistItem[0]
            } catch (error) {
              toToken = nonExistItem[0]
            }

            toToken = toToken ? toToken : nonExistItem[0]


            let isExist =
              nonExistItem && existingList
                ? toToken?.coin_symbol?.toLowerCase() ==
                selectedCoin?.coin_symbol?.toLowerCase()
                : "";

            if (isExist) {
              toToken = nonExistItem[0]
              isExist = toToken?.coin_symbol?.toLowerCase() == selectedCoin?.coin_symbol?.toLowerCase()
            }

            console.log("TokenFirst:::::::", selectedCoin);

            setTokenSecond(isExist ? nonExistItem[1] : toToken);
            tokenTwo = isExist ? nonExistItem[1] : toToken;
            fetchNativePrice_(selectedCoin?.coin_family);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Err====== getswapcoinlist", err);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log("ACCESS_TOKEN_ERR===>>>>>", error);
        setLoading(false);
      });
  };

  /******************************************************************************************/
  const fetchNativePrice_ = (coin_family) => {
    let data = {
      fiat_currency: Singleton.getInstance().CurrencySelected,
      coin_family: coin_family,
    };
    console.log("coin_family>>>", data);

    dispatch(fetchNativePrice({ data }))
      .then((res) => {
        setNativePrice(toFixedExp(res?.fiatCoinPrice?.value, 2));
        console.log("chk res native price:::::", res);
      })
      .catch((err) => {
        console.log("chk err native price:::::", err);
      });
  };

  /******************************************************************************************/
  const getWeb3Object = () => {
    console.log("chk:::::::blockChain", blockChain);
    return blockChain == "ethereum"
      ? new Web3(Singleton.getInstance().ETH_RPC_URL)
      : blockChain == "polygon"
        ? new Web3(Singleton.getInstance().MATIC_RPC_URL)
        : new Web3(Singleton.getInstance().BSC_RPC_URL);
  };

  /******************************************************************************************/
  const getUserBal = async (item) => {
    try {
      const userBal_ = item?.wallets[0].balance;
      console.log("userBal_>>>", typeof userBal_, userBal_);

      const TokenBal = userBal_
        ? userBal_ > 0
          ? toFixedExp(userBal_, getTokenFirstDecimal(item))
          : "0.00"
        : "0.00";
      console.log("TokenBal>>>", TokenBal);
      const userEthBal_ = item?.native_wallet_data[0].balance;
      const NativeCoinBal = userEthBal_
        ? userEthBal_ > 0
          ? toFixedExp(userEthBal_, 8)
          : "0.00"
        : "0.00";
      setUserBal(TokenBal);
      setUserEthBal(NativeCoinBal);
      setLoading(false);
      return TokenBal;



    } catch (error) {
      setLoading(false);
    }
  };

  /******************************************************************************************/
  const existingCoinList = (text) => {
    setSearch(text);
    setFromSearch(true);
    debounceLoadData(text);
  };

  /******************************************************************************************/
  const debounceLoadData = useCallback(
    debounce((text) => {
      searchExistingFilterFunction(text);
    }, 1000),
    []
  );

  /******************************************************************************************/
  const searchExistingFilterFunction = async (search) => {
    console.log("checkkk111111")
    const coinListData = await getData(Constants.ONCHAIN_LIST);
    const coinList = JSON.parse(coinListData);
    const NameList = [];
    setExistingCoinList([]);
    search = search?.trim();
    if (search == "") {
      console.log("checkkk2222222")
      setExistingCoinList(coinList.filter((item) => item.wallets?.length > 0));
    } else {
      const list = coinList.filter((item) => item.wallets?.length > 0);
      list.filter((value) => {
        if (
          value?.coin_name?.toLowerCase()?.includes(search.toLowerCase()) ||
          value?.coin_symbol?.toLowerCase()?.includes(search.toLowerCase())
        ) {
          NameList.push(value);
          console.log("checkkk3333333")

          setExistingCoinList(NameList);
          // Keyboard.dismiss();
        }
      });
    }
  };

  /******************************************************************************************/
  const nonExistingCoinList = (text) => {
    setSearch(text);
    setFromSearch(true);
    debounceLoadDataTwo(text);
  };

  /******************************************************************************************/
  const debounceLoadDataTwo = useCallback(
    debounce((text) => {
      searchNonExistingFilterFunction(text);
    }, 1000),
    []
  );

  /******************************************************************************************/
  const searchNonExistingFilterFunction = async (search) => {
    const coinListData = await getData(Constants.ONCHAIN_LIST);
    const coinList = JSON.parse(coinListData);
    // console.log(search, 'chk coinList::::::', coinList);
    const NameList = [];
    setNonExistingCoinList([]);
    if (search == "") {
      setNonExistingCoinList(
        coinList.filter((item) => item?.coin_family == tokenOne?.coin_family)
      );
    } else {
      const arr = await coinList.filter(
        (item) => item?.coin_family == tokenOne?.coin_family
      );
      console.log(tokenOne?.coin_family, "chk arr::::::", arr);
      arr.filter((value) => {
        if (
          value?.coin_name?.toLowerCase()?.includes(search.toLowerCase()) ||
          value?.coin_symbol?.toLowerCase()?.includes(search.toLowerCase())
        ) {
          NameList.push(value);
          setNonExistingCoinList(NameList);
          // Keyboard.dismiss();
        }
      });
    }
  };

  /******************************************************************************************/
  const initialState = () => {
    setTokenOneAmount("");
    setTokenTwoAmount("");
    setconversionQuote("0");
    setInsufficientBalance(false);
  };

  /******************************************************************************************/
  const onPressExistList = (item) => {
    if (!global.isConnected) {
      showAlertDialogNew(true);
      setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
      return;
    } else {
      // setLoading(true);
      setTimeout(async () => {
        console.log("chk item::::", item);
        let secondItem = tokenSecond;
        console.log("chk secondItem::::", secondItem);
        blockChain = item.coin_family == 1 ? "binancesmartchain" : item.coin_family == 4 ? "polygon" : "ethereum";
        const list = await coinList.filter(
          (itemNew) => itemNew?.coin_family == item?.coin_family
        );
        setNonExistingCoinList(list);
        if (item?.coin_family != tokenSecond?.coin_family) {

          if (item?.coin_symbol == list[0]?.coin_symbol) {
            setTokenSecond(list[1]);
            secondItem = list[1];
            tokenTwo = list[1];
          } else {
            setTokenSecond(list[0]);
            secondItem = list[0];
            tokenTwo = list[0];
          }
        }
        if (item?.coin_symbol == secondItem?.coin_symbol) {
          const temp = tokenFirst;
          console.log("setTokenSecond==-temp-===-==", temp)

          setTokenSecond(temp);
          tokenTwo = temp;
        }

        fetchNativePrice_(item?.coin_family)
        item = await getUserBalanceFunction(item);
        setTokenFirst(item);
        getUserBal(item);
        tokenOne = item;
        setExistingCoinModal(false);
        setTokenOneAmount("");
        setTokenTwoAmount("");
        setSelectedIndex(null);
        setTransactionFee("0.00");
      }, 100);
    }
  };

  /******************************************************************************************/
  const onPressNonExistList = async (item) => {
    if (!global.isConnected) {
      showAlertDialogNew(true);
      setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
      return;
    } else {
      // setLoading(true);
      setTimeout(async () => {
        let firstItem = tokenFirst;
        blockChain = item?.coin_family == 1 ? "binancesmartchain" : item?.coin_family == 4 ? "polygon" : "ethereum";
        const list =
          item?.coin_family == 1
            ? ExistingCoinList.sort((a, b) => a.coin_family - b.coin_family)
            : ExistingCoinList.sort((a, b) => b.coin_family - a.coin_family);
        console.log("list:::: non exist", list);
        const isTogglePress = true;
        if (item?.coin_family != tokenFirst?.coin_family) {
          let selectedCoin = list[0]
          if (item?.coin_symbol == list[0]?.coin_symbol) {
            selectedCoin = list[1]
          }
          selectedCoin = await getUserBalanceFunction(selectedCoin);
          setTokenFirst(selectedCoin);
          getUserBal(selectedCoin);
          tokenOne = selectedCoin;
          firstItem = selectedCoin;

        }
        if (item?.coin_symbol == firstItem?.coin_symbol) {
          setNonExistingCoinModal(false);
          setSearch("");
          setTimeout(() => {
            setAlertTxt("Can not select same coin.");
            showAlertDialog1(true);
          }, 200);
          return;
        }
        console.log("setTokenSecond==-item-==", item)

        setTokenSecond(item);
        tokenTwo = item;
        setTokenOneAmount("");
        setTokenTwoAmount("");
        setSelectedIndex(null);
        setTransactionFee("0.00");
        setNonExistingCoinModal(false);
      }, 100);
    }
  };

  /******************************************************************************************/
  const onChangeTextDebounce = useCallback(
    debounce(({ tokenFirst, tokenSecond, type, value, isTogglePress }) => {
      console.log("value:::::!11111", value);
      if (
        value?.length == 0 ||
        value == 0 ||
        value == "." ||
        value?.trim() == ""
      ) {
        initialState();
        return;
      } else {
        onChangeTextFinal({ tokenFirst, tokenSecond, type, value });
      }
    }, 1500),
    []
  );

  /******************************************************************************************/
  const getContractObject = async (tokenAddress, abi = TOKEN_ABI) => {
    try {
      const web3Object = getWeb3Object();
      const tokenContractObject = await new web3Object.eth.Contract(
        abi,
        tokenAddress
      );
      return tokenContractObject;
    } catch (e) {
      console.error("error ===>>", e);
    }
  };

  /******************************************************************************************/
  const onChangeTextFinal = async ({
    tokenFirst,
    tokenSecond,
    type,
    value,
  }) => {
    if (tokenFirst == undefined) {
      setLoading(false);
      setLoadingText(false);
      return
    }
    if (savedSlippage?.length == 0) {
      setAlertTxt("Select slippage");
      showAlertDialog1(true);
      return
    }
    Keyboard.dismiss();
    setLoading(false);
    setLoadingText(true);
    setTimeout(async () => {
      setTokenFirstForApproval(tokenFirst);
      console.log("setTokenSecond==-tokenSecond-==", tokenSecond)
      setTokenSecondForApproval(tokenSecond);
      setInputTypeForApproval(type);
      setValueForApproval(value);
      chainId = tokenFirst?.coin_family == 1 ? 56 : tokenFirst?.coin_family == 4 ? 137 : 1;
      blockChain =
        tokenFirst?.coin_family == 1 ? "binancesmartchain" : tokenFirst?.coin_family == 4 ? "polygon" : "ethereum";
      const userAddress = walletAddressDefault;
      // let amount = exponentialToDecimal(value * (1 * tokenFirst?.decimals));
      console.log("value>>>", value);

      let amount = await exponentialToDecimal(bigNumberSafeMath(value, '*', tokenFirst?.decimals))
      let source =
        tokenFirst?.is_token == 1
          ? tokenFirst?.token_address
          : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
      let destination =
        tokenSecond?.is_token == 1
          ? tokenSecond?.token_address
          : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
      console.log("userAddress:::::", userAddress);
      console.log("tokenFirst:::::", tokenFirst);
      console.log("tokenSecond:::::", tokenSecond);
      console.log("amount:::::", amount);
      console.log("source:::::", source);
      console.log("destination:::::", destination);
      console.log("commissionData:::::", commissionData);
      const userBal = await getUserBal(tokenFirst);
      console.log("BAL1>>", userBal, tokenFirst.decimals, userBal * tokenFirst.decimals);

      const bal_user = bigNumberSafeMath(userBal, "*", tokenFirst.decimals);
      console.log("BAL1>>", bal_user);
      if (amount?.includes('.')) {
        amount = amount?.split('.')[0]
      }

      if (bigNumberFormat(bal_user).isLessThan(amount)) {
        setInsufficientBalance(true);
      } else {
        setInsufficientBalance(false);
      }

      let data = {
        src: source,
        dst: destination,
        amount: amount.toString(),
        fee: commissionData?.percentage || 0,
        chain_id: chainId
      };

      console.log("data>>", data);

      // chain_id, src, dst, amount, fee

      getWeb3Object()
        .eth.getGasPrice()
        .then(async (gasPrice) => {

          console.log("userBal:::::", userBal);
          if (!value || parseFloat(value) <= 0) {
            //empty value
            setconversionQuote("0");
            setLoadingText(false);
            return;
          }

          dispatch(getInchQuote({ data, }))
            .then(async (res) => {
              console.log("getMatchaPrice==success=>>>>>", res);
              let receivingAmt = await exponentialToDecimal(bigNumberSafeMath(res?.toAmount, '/', tokenSecond?.decimals))
              let perQuote = await exponentialToDecimal(bigNumberSafeMath(receivingAmt, '/', value))
              console.log("calculatedAmt::::: ", receivingAmt);
              console.log("calculatedAmt11::::: ", swapToFixed(receivingAmt));
              console.log("perQuote::::: ", perQuote);
              if (firstInputAmount != "") {
                setTokenTwoAmount(swapToFixed(receivingAmt));
                setconversionQuote(perQuote);
              }
              const txnFee = res?.gas * 1.5 * gasPrice * GAS_FEE_MULTIPLIER;
              setTransactionFee(toFixed(txnFee, 6));
              setGasEstimate((res?.gas * 1.5).toFixed(0).toString());
              if (tokenFirst?.is_token == 1) {
                checkContractApproval(tokenFirst, data?.amount);
              } else {
                setUserApproval(true);
                setLoadingText(false);
                setLoading(false);
              }
            })
            .catch((err) => {
              console.log("getMatchaPrice===error>>>>> ", err);
              setTokenTwoAmount("");
              setLoadingText(false);
              setLoading(false);
            });
        }).catch((err) => {
          console.log("getGasPrice===error>>>>> ", err);
          setLoading(false);
          setLoadingText(false);
        });


    }, 100);
  };
  /******************************************************************************************/
  const checkContractApproval = async (tokenFirst, amount) => {
    try {
      let data = {
        chain_id: chainId,
        tokenAddress: tokenFirst?.token_address,
        walletAddress: walletAddressDefault,
      };
      let allowanceData = await dispatch(checkInchAllowance({ data }));
      setLoadingText(false);
      setLoading(false);
      if (BigNumber(allowanceData?.allowance).isLessThan(BigNumber(amount))) {
        let tokenContractObject = await getContractObject(
          tokenFirst?.token_address,
          TOKEN_ABI
        );
        setAllowancetxnObj({
          tokenContractObject: tokenContractObject,
          path: tokenFirst?.token_address,
        });
        console.log(":::::::::allowance required:::::::::")
        setUserApproval(false);
        return false;
      } else {
        console.log(":::::::::allowance NOT required:::::::::")
        setUserApproval(true);
        return true;
      }

    } catch (error) {
      setUserApproval(false);
      setLoadingText(false);
      setLoading(false);
    }

  };

  const onPressToggle = async (tokenFirst, tokenSecond) => {
    setconversionQuote("0");

    if (!global.isConnected) {
      setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
      showAlertDialogNew(true);
      setLoading(false);
      return;
    }
    // props.socketPropsUpdate({ prop: "previousAction", value: null })
    const isTogglePress = true;
    if (tokenSecond?.wallets?.length == 0) {
      setAlertTxt(alertMessages.addTokenFromAddCustomToken);
      showAlertDialogNew(true);
      setLoading(false);
      return;
    }
    let temp = tokenFirst;
    tokenSecond = await getUserBalanceFunction(tokenSecond);
    setTokenFirst(tokenSecond);
    getUserBal(tokenSecond);
    tokenOne = tokenSecond;
    console.log("setTokenSecond==--==", temp)
    setTokenSecond(temp);
    tokenTwo = temp;
    setTokenOneAmount("");
    setTokenTwoAmount("");
    setSelectedIndex(null);
    setTransactionFee("0.00");
    setInsufficientBalance(false);
    setUserApproval(true);
    setToggleSwap(!toggleSwap);
  };

  const isValidSwap = async () => {
    let message = "";
    const fromAmount =
      tokenFirst?.value != undefined &&
      currencyFormat(
        tokenFirst?.value * tokenOneAmount,
        Constants.FIAT_DECIMALS
      );
    const receivedAmount =
      tokenSecond?.value != undefined &&
      currencyFormat(
        tokenSecond?.value * tokenTwoAmount,
        Constants.FIAT_DECIMALS
      );
    const percVal = (parseFloat(receivedAmount) / parseFloat(fromAmount)) * 100;
    const diffVal = parseFloat(fromToAmtDiff) > 0 ? fromToAmtDiff : 0;
    console.log("fromToAmtDiff -----", fromToAmtDiff);
    if (
      tokenOneAmount == undefined ||
      tokenOneAmount == "" ||
      tokenOneAmount == 0
    ) {
      message = alertMessages.pleaseEnterAmountToSwap;
    } else if (parseFloat(percVal) < parseFloat(diffVal)) {
      // if receiving amount less than 90% of invested amount
      message = alertMessages.cantSwapThesePair;
    } else if (tokenTwoAmount == undefined || tokenTwoAmount == 0) {
      message =
        tokenFirst?.coin_name +
        alertMessages.equivalentAmountTo +
        tokenSecond?.coin_name +
        alertMessages.isNotReceived;
    }

    if (!message && isApproved) {
      const totalFee = exponentialToDecimal(
        parseFloat(gasPrice) * parseFloat(gasEstimate) * GAS_FEE_MULTIPLIER
      );
      const web3Object = getWeb3Object();
      const userAddress = walletAddressDefault;
      const ethBal_ = await web3Object.eth.getBalance(userAddress);
      console.log("ethBal_ -------", ethBal_);
      const value = ethBal_ / tokenFirst.decimals;
      const ethBal = exponentialToDecimal(value);
      console.log("chk:::::UserBalance====", ethBal);
      const calcAmount = parseFloat(value) - parseFloat(totalFee);
      console.log("calcAmount====", calcAmount);
      if (calcAmount < 0) {
        message =
          alertMessages.youDontHaveEnough +
          `${tokenFirst.coin_family == 1 ? "BNB" : "ETH"}` +
          alertMessages.toPerformTransaction;
      }
    }

    return message ? { message } : null;
  };

  /******************************************************************************************/
  const onPressSwap = async (transactionFee, hideModal) => {

    setLoading(true);
    const fromAmount =
      tokenFirst?.fiat_price_data?.value != undefined &&
      currencyFormat(
        tokenFirst?.fiat_price_data?.value * tokenOneAmount,
        Constants.FIAT_DECIMALS
      );
    const receivedAmount =
      tokenSecond?.fiat_price_data?.value != undefined &&
      currencyFormat(
        tokenSecond?.fiat_price_data?.value * tokenTwoAmount,
        Constants.FIAT_DECIMALS
      );

    console.log("tokenFirst>>>>", tokenFirst?.fiat_price_data?.value, "tokenOneAmount>>>>", tokenOneAmount);
    console.log("tokenSecond>>>>", tokenSecond?.fiat_price_data?.value, "tokenTwoAmount>>>>", tokenTwoAmount);
    console.log("receivedAmount>>>>", receivedAmount, "fromAmount>>>>", fromAmount);

    const percVal = (parseFloat(receivedAmount) / parseFloat(fromAmount)) * 100;
    blockChain = tokenFirst.coin_family == 1 ? "binancesmartchain" : tokenFirst?.coin_family == 4 ? "polygon" : "ethereum";
    const userAddress = walletAddressDefault;
    const diffVal = parseFloat(fromToAmtDiff) > 0 ? fromToAmtDiff : 0;
    console.log("percVal::::::::::", percVal);
    console.log("diffVal::::::::::", diffVal);
    getWeb3Object()
      .eth.getGasPrice()
      .then(async (gasPrice) => {
        // console.log("userBal::::::::::", userBal);
        if (tokenOneAmount == undefined || tokenOneAmount == 0) {
          setAlertTxt(alertMessages.pleaseEnterAmountToSwap);
          showAlertDialogNew(true);
          setLoading(false);
          return;
        }
        if (
          parseFloat(percVal || 0) < parseFloat(diffVal) &&
          (!!hideModal ? false : priceImpactState)
        ) {
          // if receiving amount less than 90% of invested amount
          // setAlertTxt(alertMessages.cantSwapThesePair);
          setPairModalAlert(true);
          setLoading(false);
          return;
        } else if (tokenTwoAmount == undefined || tokenTwoAmount == 0) {
          setAlertTxt(
            tokenFirst?.coin_name +
            alertMessages.equivalentAmountTo +
            tokenSecond?.coin_name +
            alertMessages.isNotReceived
          );
          showAlertDialogNew(true);
          setLoading(false);
          return;
        } else if (
          (tokenFirst?.coin_symbol?.toLowerCase() != "bnb" &&
            tokenFirst?.coin_symbol?.toLowerCase() != "eth" &&
            parseFloat(userBal) >= parseFloat(tokenOneAmount)) ||
          parseFloat(userBal) > parseFloat(tokenOneAmount)
        ) {
          if (isApproved) {
            const totalFee = exponentialToDecimal(
              parseFloat(gasPrice) *
              parseFloat(gasEstimate) *
              GAS_FEE_MULTIPLIER
            );
            // console.log('chk total fee:::::', totalFee);
            const web3Object = getWeb3Object();
            const ethBal_ = await web3Object.eth.getBalance(userAddress);
            const value = ethBal_ / tokenFirst.decimals;
            const ethBal = exponentialToDecimal(value);
            console.log("chk:::::UserBalance====", ethBal);
            const calcAmount = parseFloat(value) - parseFloat(totalFee);
            console.log("calcAmount====", calcAmount);
            if (calcAmount < 0) {
              setAlertTxt(
                alertMessages.youDontHaveEnough +
                `${tokenFirst.coin_family == 1 ? "BNB" : "ETH"}` +
                alertMessages.toPerformTransaction
              );
              showAlertDialogNew(true);
              setLoading(false);
              return;
            }
            setPreviewModal(false);
            get1inchSwapData()
          } else {
            const totalFee = (gasPrice * gasEstimate).toFixed(0);
            const web3Object = getWeb3Object();
            const ethBal = await web3Object.eth.getBalance(userAddress);
            if (ethBal - exponentialToDecimal(totalFee) < 0) {
              setAlertTxt(
                alertMessages.youDontHaveEnough +
                `${tokenFirst.coin_family == 1 ? "BNB" : "ETH"}` +
                alertMessages.toPerformTransaction
              );
              showAlertDialogNew(true);
              setLoading(false);
              return;
            }
            setLoading(false);
            setAlertText(
              alertMessages.youHaveToPay +
              `${parseFloat(transactionFee).toFixed(6)} ${tokenFirst.coin_family == 1 ? "BNB" : "ETH"
              }` +
              alertMessages.areYouWillingToGiveApproval
            );
            setShowApproveModal(true);
          }
        } else {
          setAlertTxt(
            alertMessages.youDontHaveEnough +
            `${tokenFirst.coin_family == 1 ? "BNB" : "ETH"}` +
            alertMessages.toPerformTransaction
          );
          showAlertDialogNew(true);
          setLoading(false);
          return;
        }
      })
      .catch((err) => {
        setLoading(false);
      });

  };
  /******************************************************************************************/
  const get1inchSwapData = async () => {
    let amount = await exponentialToDecimal(bigNumberSafeMath(tokenOneAmount, '*', tokenFirst?.decimals))

    if (amount?.toString()?.includes(".")) {
      amount = amount?.toString()?.split(".")[0]
    }
    console.log("tokenOneAmount>>>>>>>>", amount, tokenOneAmount);


    let slippageSwap = await bigNumberSafeMath(savedSlippage, '/', 100)
    let source =
      tokenFirst?.is_token == 1
        ? tokenFirst?.token_address
        : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    let destination =
      tokenSecond?.is_token == 1
        ? tokenSecond?.token_address
        : "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
    let data = {
      chain_id: chainId,
      src: source,
      dst: destination,
      amount: amount.toString(),
      slippage: slippageSwap,
      from: walletAddressDefault,
      referrer: commissionData?.walletAddress,
      fee: commissionData?.percentage
    };

    console.log("getdata::::::", data);
    console.log("getchainId::::::", chainId);
    dispatch(inchSwap({ data }))
      .then(async (res) => {
        console.log("getMatchaQuote==success::::::", res);
        let receivingAmt = await exponentialToDecimal(bigNumberSafeMath(res?.toAmount, '/', tokenSecond?.decimals))
        let perQuote = await exponentialToDecimal(bigNumberSafeMath(receivingAmt, '/', tokenOneAmount))
        console.log("calculatedAmt::::: ", receivingAmt);
        console.log("perQuote::::: ", perQuote);
        setTokenTwoAmount(swapToFixed(receivingAmt));
        setconversionQuote(perQuote);
        const gasPrice = res?.tx?.gasPrice
        const txnFee = res?.tx?.gas * 1.5 * gasPrice * GAS_FEE_MULTIPLIER;
        console.log("txn fee:::::>>>>>", txnFee);
        setTransactionFee(toFixed(txnFee, 6));
        setGasEstimate((res?.tx?.gas * 1.5).toFixed(0).toString());
        routerAddress = res?.tx?.to
        setencodeData(res?.tx?.data)
        setLoadingText(false);
        setLoading(false);
        setConfirmTxnModalSwap(true);
      })
      .catch((err) => {
        console.log("getMatchaQuote===error::::::: ", err);
        setTokenTwoAmount("");
        setLoadingText(false);
        setLoading(false);
        setAlertTxt(err);
        showAlertDialogNew(true);
      });


  }

  /******************************************************************************************/
  const getApproval = async (pin) => {
    console.log("routerAddress::::::: ", routerAddress)
    console.log("allownceTxnObj::::::: ", allownceTxnObj)
    setLoading(true);

    setTimeout(async () => {
      setShowApproveModal(false);
      let spenderAddress = await dispatch(inchSwapSpender({ data: { chain_id: chainId } }))
      routerAddress = spenderAddress?.address
      const approveRes = await approveTransaction(
        allownceTxnObj.tokenContractObject,
        routerAddress,
        allownceTxnObj.path,
        pin
      );
      // console.log('chk app res::::', approveRes);
      if (approveRes) {
        setTimeout(async () => {
          const contract = await getWeb3Object();
          const txnReceipt = await contract.eth.getTransactionReceipt(
            approveRes?.tx_hash || approveRes?.transactionHash
          );
          console.log("txnReceipt::::::", txnReceipt);
          if (txnReceipt) {
            if (txnReceipt.status == true) {
              setUserApproval(true);
              onChangeTextFinal({
                tokenFirst: tokenFirstForApproval,
                tokenSecond: tokenSecondForApproval,
                type: inputTypeForApproval,
                value: valueForApproval,
              });
              setAlertTxt(alertMessages.approvalSuccess);
              setShowSucess(true);
              showAlertDialogNew(true);
              setLoading(false);
            } else {
              setUserApproval(false);
              setAlertTxt(err || alertMessages.approvalFailed);
              showAlertDialogNew(true);
              setLoading(false);
            }
          } else {
            setShowSucess(true);
            setUserApproval(false);
            setShowApproveModal(false);
            setAlertTxt(approveRes?.message);
            setIsReqSent(true);
            showAlertDialog1(true);
            setLoading(false);
          }
        }, 6000);
      } else {
        setTimeout(async () => {
          let data = {
            chain_id: chainId,
            tokenAddress: tokenFirst?.token_address,
            walletAddress: walletAddressDefault,
          };
          let isApproved = await dispatch(checkInchAllowance({ data }));
          isApproved = isApproved?.allowance != 0;
          if (isApproved) {
            onChangeTextFinal({
              tokenFirst: tokenFirstForApproval,
              tokenSecond: tokenSecondForApproval,
              type: inputTypeForApproval,
              value: valueForApproval,
            });
            // setUserApproval(true)
            setLoading(false);
          } else {
            setUserApproval(false);
            setLoading(false);
            setAlertTxt(alertMessages.pleaseWaitForBlockchainConfirmation);
            showAlertDialog1(true);
          }
        }, 6000);
      }
    }, 100);
  };

  /******************************************************************************************/
  const approveTransaction = async (
    tokenContractObject,
    spenderAddress,
    tokenAddress,
    pin
  ) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log("spenderAddress:::::: ", spenderAddress)
        // console.log('\n\n\n **** APPROVED TRANSACTION ALERT ***** \n\n\n');
        const userAddress = walletAddressDefault;
        console.log(
          "\n\n\n **** APPROVED TRANSACTION userAddress ***** \n\n\n",
          userAddress
        );
        blockChain =
          tokenFirst.coin_family == 1 ? "binancesmartchain" : tokenFirst?.coin_family == 4 ? "polygon" : "ethereum";
        getWeb3Object()
          .eth.getGasPrice()
          .then(async (gasPrice) => {
            const web3Object = getWeb3Object();
            const approveTrans = await tokenContractObject.methods.approve(
              spenderAddress,
              BigNumber(10 ** 70).toFixed(0)
            );
            console.log("approveTrans ===>>>", approveTrans);
            const approveGasLimit = await approveTrans.estimateGas({
              from: userAddress,
            });
            // console.log('approveGasLimit ===>>>', approveGasLimit);
            const nonce = await web3Object.eth.getTransactionCount(userAddress);
            console.log("nonce ===>>>approve", nonce);
            console.log("gasPrice ===>>>approve", gasPrice);

            const resultApprove = await makeTransaction(
              approveTrans.encodeABI(),
              gasPrice,
              approveGasLimit + 10000,
              nonce,
              "0x0",
              tokenAddress,
              true,
              pin
            );
            console.log("chk approve Result::::", resultApprove);
            // setLoading(false);
            return resolve(resultApprove);
          })
          .catch((err) => {
            console.log("error in approval ", err);
            setLoading(false);
          });
      } catch (e) {
        console.log("chk approve txn err::::", e);
        return reject(null);
      }
    });
  };

  /******************************************************************************************/
  const swap = async (amount, tokenFirst, encodeData, pin) => {
    setLoading(true);
    setTimeout(() => {
      const userAddress = walletAddressDefault;
      blockChain =
        tokenFirst?.coin_family == 1 ? "binancesmartchain" : tokenFirst?.coin_family == 4 ? "polygon" : "ethereum";
      getWeb3Object()
        .eth.getGasPrice()
        .then(async (gasPrice) => {
          saveLastSelectedCoins(tokenOne?.coin_id, tokenTwo?.coin_id)
          const web3Object = getWeb3Object();
          const nonce = await web3Object.eth.getTransactionCount(userAddress);
          console.log("chk gasEstimate::::::", gasEstimate);

          let toAddress = routerAddress;

          const result = await makeTransaction(
            encodeData,
            gasPrice,
            gasEstimate,
            nonce,
            tokenFirst?.is_token == 0 ? amount : "0x0",
            toAddress,
            false,
            pin
          );

          console.log("--------------result---------------", result);
          setRawTxnObj({});
          getUserBal(tokenFirst);
          setLoading(false);
          if (result) {
            setShowSucess(true);
            setAlertTxt(result?.message);
            showAlertDialog1(true);
            loadState()
          }
          return result;
        })
        .catch((err) => {
          console.log("error swap", err);
          setLoading(false);
        });
    }, 150);
  };

  /******************************************************************************************/
  const makeTransaction = async (
    transactionData,
    gasPrice,
    gasLimit,
    nonce,
    value,
    to,
    fromApproval = false,
    pin
  ) => {
    setLoading(true);
    const from = walletAddressDefault;
    return new Promise(async (resolve, reject) => {
      // console.log('chk pvt key::::::::', pvtKey);
      console.log("chk value ::::::::", value);
      const web3Object = getWeb3Object();
      const chainID = tokenFirst?.coin_family == 1 ? 56 : tokenFirst?.coin_family == 4 ? 137 : 1;
      const rawTransaction = {
        gasPrice: gasPrice,
        gasLimit: web3Object.utils.toHex(gasLimit),
        to: to,
        value: value,
        data: transactionData,
        nonce: nonce,
        from: from,
        chainId: chainID,

      };

      console.log("rawTransaction =>", rawTransaction);
      console.log("fromApproval =>", fromApproval);
      let finalTxn = "";
      const pvtKey = await getEncryptedData(`${Singleton.getInstance().defaultEthAddress}_pk`, pin);
      const txn = await web3Object.eth.accounts.signTransaction(
        rawTransaction,
        pvtKey
      );
      finalTxn = txn.rawTransaction.slice(2)

      console.log("chk signtxn:::::", finalTxn);
      const fiatval = tokenFirst.fiat_price_data?.value;
      const fiatValue = toFixedExp(
        parseFloat(tokenOneAmount) * parseFloat(fiatval),
        10
      );
      const currencyCode = await getData(Constants.SELECTED_CURRENCY);

      const sendCoinReq = {
        nonce: nonce,
        tx_raw: finalTxn,
        from: from,
        to: to,
        amount: tokenOneAmount,
        gas_estimate: gasLimit,
        gas_price: gasPrice,
        tx_type: fromApproval == true ? "Approve" : "Swap",
        approval: fromApproval == true ? 1 : 0,
        amount_in_fiat: fiatValue,
        swap_fee: commissionData?.percentage,
        fiat_type: currencyCode,
      };
      const access_token = await getData(Constants.ACCESS_TOKEN);
      console.log("sendCoinReq::::::", sendCoinReq);
      const symbol =
        tokenFirst?.token_address != null
          ? tokenFirst?.token_address
          : tokenFirst?.coin_symbol?.toLowerCase();
      const blockChainSymbol =
        tokenFirst?.coin_family == 1 ? "binancesmartchain" : tokenFirst?.coin_family == 4 ? "polygon" : "ethereum";
      await dispatch(
        requestSendCoin({
          url: `${blockChainSymbol}/${symbol}/send`,
          sendCoinReq,
          token: access_token,
        })
      )
        .then((res) => {
          fromApproval == true ? setLoading(true) : setLoading(false);
          return resolve(res);
        })
        .catch((err) => {
          console.log("chk err:::::data", err);
          setLoading(false);
          setAlertTxt(err);
          showAlertDialogNew(true);
          return reject(null);
        });
    });
  };

  /******************************************************************************************/
  const onChangeNumber = (value) => {
    if (value.includes(",")) value = value.replace(",", ".");
    if (value == ".") value = "0.";
    if (/^\d*\.?\d*$/.test(value)) {
      if (value.includes(".") && value.split(".")[1].length > 18) {
        return;
      } else {
        firstInputAmount = value;
        const isTogglePress = false;
        setTokenOneAmount(value);
        setSelectedInput(inputType.firstInput);
        setToggleSwap(false);
        onChangeTextDebounce({
          tokenFirst,
          tokenSecond,
          value,
          type: inputType.firstInput,
          isTogglePress,
        });
      }
    }
    setSelectedIndex(null);
  };

  /******************************************************************************************/
  const onPressCoin = () => {
    if (ExistingCoinList.length == 0) {
      showAlertDialogNew(true);
      setAlertTxt(alertMessages.pleaseEnableYourAssetsToProceed);
      return;
    }
    saveData(Constants.ONCHAIN_LIST, JSON.stringify(coinList));
    tokenSecond && setNonExistingCoinModal(true);
    setSearch("");
    tokenSecond &&
      setNonExistingCoinList(
        coinList.filter((item) => item.coin_family == tokenFirst?.coin_family)
      );
  };

  /******************************************************************************************/
  const onPressCoinFirst = () => {
    // console.log('ExistingCoinList:::::', ExistingCoinList);
    if (ExistingCoinList.length == 0) {
      showAlertDialogNew(true);
      setAlertTxt(alertMessages.pleaseEnableYourAssetsToProceed);
      return;
    } else {

      tokenFirst && setExistingCoinModal(true);
      setSearch("");

      tokenFirst &&
        setExistingCoinList(
          coinList.filter((item) => item.wallets?.length > 0)
        );

    }
  };


  /******************************************************************************************/
  const onPressItem = (item, index) => {
    var amount = 0;
    console.log(
      exponentialToDecimal(tokenFirst?.wallets[0].balance).toString()
      , 0, ' tokenFirst?.wallets[0].balance', tokenFirst?.wallets[0].balance);
    if (Number(tokenFirst?.wallets[0].balance)
      <= 0) {
      return
    }
    setSelectedIndex(index);
    const balance = tokenFirst?.wallets[0].balance;
    const totalFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
    console.log("total fee %>>>>>>>", totalFee);
    setSelectedInput(inputType.firstInput);
    if (index == 0) {
      amount =
        tokenFirst?.is_token == 1
          ? toFixedExp(0.25 * parseFloat(balance), getTokenFirstDecimal(tokenFirst)).toString()
          : toFixedExp(0.15 * parseFloat(balance), 8).toString();
    } else if (index == 1) {
      amount =
        tokenFirst?.is_token == 1
          ? toFixedExp(0.5 * parseFloat(balance), getTokenFirstDecimal(tokenFirst)).toString()
          : toFixedExp(0.4 * parseFloat(balance), 8).toString();
    } else if (index == 2) {
      amount =
        tokenFirst?.is_token == 1
          ? toFixedExp(0.75 * parseFloat(balance), getTokenFirstDecimal(tokenFirst)).toString()
          : toFixedExp(0.65 * parseFloat(balance), 8).toString();
    } else if (index == 3) {
      if (tokenFirst?.is_token == 1) {
        console.log("BALANCE>>>", balance);
        amount = toFixedExp(balance, getTokenFirstDecimal(tokenFirst)).toString() //toFixedExp(balance, 8).toString();
      } else {
        if (balance > totalFee) {
          amount = toFixedExp(
            (balance * 0.9 - totalFee).toString(),
            8
          ).toString();
        } else {
          amount = toFixedExp(balance, 8).toString();
        }
      }
    }
    firstInputAmount = amount
    console.log(tokenFirst, 'tokenFirsttokenFirst');

    setTokenOneAmount(amount);
    setToggleSwap(false);
    if (
      amount?.length == 0 ||
      amount == 0 ||
      amount == "." ||
      amount?.trim() == "" ||
      amount.includes("-") ||
      parseFloat(amount) <= 0
    ) {
      console.log("EERR>>", amount);

      // if (parseFloat(amount) <= 0) {
      initialState();
      setInsufficientBalance(true);
      return;
      // }
    } else {
      onChangeTextFinal({
        tokenFirst,
        tokenSecond,
        type: inputType.firstInput,
        value: amount,
      });
    }
  };

  /************************************** alertDialogPressed ****************************************************/
  const alertDialogPressed = () => {
    showAlertDialog1(false);
    setShowSucess(false);
    setinputSlippage("");
    if (isReqSent) {
      setIsReqSent(false)
      Actions.jump('WalletMain');
    }
    // Singleton.bottomBar?.navigateTab('WalletMain');
    // Actions.jump('WalletMain');
  };


  const getRightLabel = () => {
    if (walletAddressDefault) {
      return `${walletAddressDefault.substring(
        0,
        5
      )}....${walletAddressDefault.substring(
        walletAddressDefault.length - 5,
        walletAddressDefault.length
      )}`;
    }
    if (Singleton.getInstance().defaultBnbAddress) {
      return `${Singleton.getInstance().defaultBnbAddress.substring(
        0,
        5
      )}....${Singleton.getInstance().defaultBnbAddress.substring(
        Singleton.getInstance().defaultBnbAddress.length - 5,
        Singleton.getInstance().defaultBnbAddress.length
      )}`;
    }
    return "";
  };


  const getLastSelectedCoins = async () => {
    try {
      const address = Singleton.getInstance().defaultEthAddress || Singleton.getInstance().defaultBnbAddress
      const result = await getData(Constants.ON_CHAIN_LAST_PAIRS)
      const data = JSON.parse(result)
      return { from: data?.[address]?.from || "1", to: data?.[address]?.to || "102" }
    } catch (error) {
      return { from: "1", to: "102" }
    }
  }

  const saveLastSelectedCoins = async (from, to) => {
    const address = Singleton.getInstance().defaultEthAddress || Singleton.getInstance().defaultBnbAddress
    let data = await getData(Constants.ON_CHAIN_LAST_PAIRS)
    data = data ? JSON.parse(data) : {}
    console.log("data>>>>", data);

    saveData(Constants.ON_CHAIN_LAST_PAIRS, JSON.stringify({ ...data, [address]: { from, to } }))
  }

  const resetLastSelectedCoins = async () => {
    const address = Singleton.getInstance().defaultEthAddress || Singleton.getInstance().defaultBnbAddress
    saveData(Constants.ON_CHAIN_LAST_PAIRS, JSON.stringify({ ...data, [address]: { from: "1", to: "102" } }))
  }

  const getTokenFirstDecimal = (item, isExact) => {
    const decim =
      item?.decimals.toString().length - 1 > 18
        ? 8
        : item?.decimals.toString().length - 1;
    return isExact ? item?.decimals.toString().length - 1 : decim
  }

  const getUserBalanceFunction = (item) => {
    return new Promise((resolve, reject) => {
      const data = {
        wallet_address: walletAddressDefault,
        coin_id: item?.coin_id,
      };
      dispatch(getUserBalance({ data }))
        .then((res) => {
          console.log("BALANCE>>>>", res);
          resolve({ ...item, wallets: [{ balance: res, user_id: item?.wallets?.[0]?.user_id }] })
        }).catch(err => {
          console.log("BALANCE_ERR>>>>", this.state.balance, err);
          resolve(item)
        })
    })
  }


  /******************************************************************************************/
  if (!props?.isVisible) {
    return <View />;
  }

  /******************************************************************************************/
  return (
    <>
      {/* {console.log("tokenFirst:::::::: ", tokenFirst)}
      {console.log("tokenSecond:::::::: ", tokenSecond)} */}
      <View style={styles.ViewStyle}>
        <ScrollView
          ref={scrollRef}
          bounces={false}
          showsVerticalScrollIndicator={false}
          // style={{ flex: 1, }}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View style={styles.ViewStyle1}>
            <SelectCurrencyNew
              type={"from"}
              label={"You Pay"}
              item={tokenFirst}
              tokenOneAmount={exponentialToDecimal(tokenOneAmount)}
              maxLength={10}
              placeholder="0.00"
              custStyle={{ textAlign: "right" }}
              onPressCoin={() => onPressCoinFirst()}
              value={tokenOneAmount}
              keyboardType={"numeric"}
              onChangeNumber={(value) => {
                onChangeNumber(value);
              }}
            />

            <View style={{ marginTop: heightDimen(16) }}>
              <TouchableOpacity
                onPress={() => {
                  onPressToggle(tokenFirst, tokenSecond);
                }}
              >
                <Image
                  source={ThemeManager.ImageIcons.toggle}
                  style={[styles.imgstyle]}
                />
              </TouchableOpacity>
              <SelectCurrencyNew
                type={"to"}
                label={"You Get"}
                inputandselectStyle={{ marginTop: heightDimen(16) }}
                styleImg={{ height: 28, width: 28 }}
                item={tokenFirst != undefined ? tokenSecond : undefined}
                placeholder="0.00"
                editable={false}
                custStyle={{ textAlign: "right" }}
                onPressCoin={() => onPressCoin()}
                value={tokenTwoAmount}
                tokenOneAmount={exponentialToDecimal(tokenTwoAmount)}
              // keyboardType={"numeric"}
              />
            </View>


            <View style={styles.reciptViewStyle}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textStyle,
                  { color: ThemeManager.colors.legalGreyColor },
                ]}
              >
                {sendTrx.transactionFees}
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.textStyle2,
                  { color: ThemeManager.colors.blackWhiteText },
                ]}
              >
                {transactionFee}
                {!tokenFirst?.coin_family
                  ? ""
                  : tokenFirst?.coin_family == 1
                    ? " BNB"
                    : tokenFirst?.coin_family == 2 ? " ETH" : " POL"}{" "}
                {/* {`(${Singleton.getInstance().CurrencySymbol} ${toFixedExp(
                  parseFloat(transactionFee) * parseFloat(nativePrice),
                  2
                )})`} */}
              </Text>
            </View>
            {/* <------------------------------------------------------------------------percentage tab view---------------------------------------------------------> */}

            <View
              style={{
                justifyContent: "space-between",
                marginTop: getDimensionPercentage(10),
                marginHorizontal: getDimensionPercentage(5),
              }}
            >
              <View style={styles.sliderView}>
                {tabData.map((item, index) => (
                  <TouchableOpacity
                    key={index + ""}
                    onPress={async () => onPressItem(item, index)}
                    style={[styles.tabsViewTwo,]}
                  >
                    {selectedIndex == index ? <LinearGradient
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      colors={["#73C9E2", "#6C8DC5", "#6456B2", "#6145EA"]}

                      style={[styles.tabsViewTwo, { height: 40 }]}
                    >
                      <Text
                        allowFontScaling={false}
                        style={{
                          color: ThemeManager.colors.blackWhiteText,
                          fontSize: 16,
                          fontFamily: Fonts.dmSemiBold,
                        }}
                      >
                        {item.title}
                      </Text>
                    </LinearGradient> :
                      <GradientBorderView
                        gradientStyle={{ height: 40 }}
                        mainStyle={[styles.tabsViewTwo]}
                      >
                        <Text
                          allowFontScaling={false}
                          style={{
                            color: ThemeManager.colors.TextColor,
                            fontSize: 16,
                            fontFamily: Fonts.dmSemiBold,
                          }}
                        >
                          {item.title}
                        </Text>
                      </GradientBorderView>
                    }
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[styles.sliderView, { marginTop: 10, justifyContent: 'space-between', }]}>
                <Text
                  style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText, fontSize: 16 }]}
                >Slippage</Text>
                <TouchableOpacity
                  style={{ flexDirection: "row" }}
                  onPress={() => {
                    setslippageModal(true);
                  }}>
                  <Text
                    style={[styles.textStyle, { color: ThemeManager.colors.blackWhiteText, fontSize: 16 }]}
                  >{savedSlippage}%</Text>
                  <Image
                    style={{ tintColor: ThemeManager.colors.blackWhiteText }}
                    source={images.setting_inactiveNew} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* *********************************************************** MODAL FOR EXISTING COINS ********************************************************************** */}
          <ModalCoinList
            // from={'From'}
            showSearch={true}
            isFrom={'From'}
            openModel={ExistingCoinModal}
            handleBack={() => {
              setExistingCoinModal(false);
              setSearch("");
            }}
            list={ExistingCoinList}
            onPress={(item) => {
              onPressExistList(item);
            }}
            pressClear={() => existingCoinList("")}
            onChangeNumber={(text) => existingCoinList(text)}
            onSubmitEditing={() => existingCoinList(search)}
            search={search}
            fromSearch={fromSearch}
          />

          {/* *********************************************************** MODAL FOR NON-EXISTING COINS ********************************************************************** */}
          <ModalCoinList
            // from={'To'}
            showSearch={true}
            openModel={NonExistingCoinModal}
            handleBack={() => {
              setNonExistingCoinModal(false);
              setSearch("");
            }}
            list={NonExistingCoinList}
            onPress={(item) => {
              onPressNonExistList(item);
            }}
            pressClear={() => nonExistingCoinList("")}
            onChangeNumber={(text) => nonExistingCoinList(text)}
            onSubmitEditing={() => nonExistingCoinList(search)}
            search={search}
            fromSearch={fromSearch}
          />
          {/* <----------------------------------------------approve modal-----------------------------------------------------------------------------------> */}
          <CommonModal
            visible={modalState}
            onClose={() => setModalState(false)}
          >
            <View style={styles.main_container}>
              <View style={styles.heading_container}>
                <Text style={styles.heading_text}>
                  {LanguageManager.swapText.approve}
                </Text>
              </View>
              <ImgTxtTxt
                main_container={styles.token_head_container}
                imgSrc={images.bnb}
                ImageStyle={styles.logo}
                txt1_style={styles.token_name}
                txt1={"BUSD"}
                txt2_style={styles.amount_text}
                txt2={"BEP20"}
              />

              <View style={styles.first_view}>
                <TxTWithRightINfo
                  main_CONTAINER={styles.info_row}
                  LeftTxtStyle={styles.left_texts}
                  LeftTxt_Label={LanguageManager.swapText.from}
                  RightInfo_container={styles.right_Double_col_View}
                  rigthTxtStyle={styles.right_value_text}
                  righttxt_label_first={LanguageManager.swapText.myWallet}
                  rigthTxt_scnd_Style={styles.right_lower_text}
                  righttxt_label_scnd={"0xcsdsd....sssdsds"}
                />

                <Divider customStyle={styles.seprator_line} />

                <TxTWithRightINfo
                  main_CONTAINER={styles.info_row}
                  LeftTxtStyle={styles.left_texts}
                  LeftTxt_Label={LanguageManager.swapText.contactAddress}
                  righttxt_label_first={"0xerfg...sacasd"}
                  rigthTxtStyle={styles.right_value_text}
                />
              </View>
              <View style={styles.second_view}>
                <TxTWithRightINfo
                  main_CONTAINER={styles.info_row}
                  LeftTxtStyle={styles.left_texts}
                  LeftTxt_Label={LanguageManager.swapText.provider}
                  RightInfo_container={styles.providerIcon_TXT_row}
                  Imgshow={true}
                  right_Icon={images.providerIcon}
                  img_styling={styles.provider_icon}
                  rigthTxt_scnd_Style={styles.right_value_text}
                  righttxt_label_scnd={"1Inch"}
                  rigthTxtStyle={null}
                  righttxt_label_first={null}
                />
                <Divider customStyle={styles.seprator_line} />
                <TxTWithRightINfo
                  main_CONTAINER={styles.info_row}
                  LeftTxtStyle={styles.left_texts}
                  LeftTxt_Label={LanguageManager.swapText.networkfess}
                  RightInfo_container={styles.right_Double_col_View}
                  rigthTxtStyle={styles.right_value_text}
                  righttxt_label_first={"0.00215 BNB"}
                  rigthTxt_scnd_Style={styles.right_lower_text}
                  righttxt_label_scnd={"$0.250"}
                />
              </View>
              <View style={styles.btn_container}>
                <Button
                  restoreStyle={styles.btn_text}
                  buttontext={LanguageManager.swapText.continueSwap}
                  myStyle={styles.btn_style}
                />
              </View>
            </View>
          </CommonModal>

          {/* <----------------------------------------------slippage modal-----------------------------------------------------------------------------------> */}
          <CommonModal
            visible={slippageModal}
            onClose={() => setslippageModal(false)}
          >
            <View style={styles.main_container}>
              <View style={styles.heading_container}>
                <Text
                  style={[
                    styles.heading_text,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {LanguageManager.swapText.trasactionSetting}
                </Text>
              </View>
              <View style={styles.slippageTabView}>
                <Text
                  style={[
                    styles.slippageText,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  Slippage Tolerance
                </Text>
                <View
                  style={{
                    justifyContent: "space-between",
                    marginTop: 15,
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor:
                      ThemeManager.colors.addressBookDropBorederColor,
                    padding: 4,
                  }}
                >
                  <View style={styles.sliderView}>
                    {slippageData.map((item, index) =>
                      item.key != 5 ? (
                        <TouchableOpacity
                          key={index + ""}
                          onPress={async () => {
                            setinputSlippage("");
                            setselectedSlippage(item)
                          }}
                          style={[
                            styles.tabsView,
                            {
                              backgroundColor:
                                selectedSlippage?.title == item.title
                                  ? ThemeManager.colors.primaryColor
                                  : ThemeManager.colors.mnemonicsBg,
                              borderColor:
                                ThemeManager.colors.addressBookDropBorederColor,
                            },
                          ]}
                        >
                          <Text
                            allowFontScaling={false}
                            style={{
                              color:
                                selectedSlippage?.title == item.title
                                  ? ThemeManager.colors.Mainbg
                                  : ThemeManager.colors.blackWhiteText,
                              fontSize: 14,
                              fontFamily: Fonts.dmMedium,
                            }}
                          >
                            {item.title}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <TextInput
                          keyboardType="numeric"
                          value={inputSlippage}
                          placeholderTextColor={
                            ThemeManager.colors.blackWhiteText
                          }
                          placeholder={item.title}
                          style={[
                            styles.tabsView,
                            {
                              paddingHorizontal: 10,
                              alignItems: "flex-start",
                              borderColor:
                                ThemeManager.colors.addressBookDropBorederColor,
                              color: ThemeManager.colors.blackWhiteText,
                              paddingVertical:
                                Platform.OS == "android" ? 0 : undefined,
                            },
                          ]}
                          onChangeText={(text) => {
                            if (Constants.TWO_DECIMAL_REGEX.test(text)) {
                              if (text <= 100) {
                                setselectedSlippage({
                                  title: "Custom",
                                  key: "4",
                                  value: text,
                                });
                                setinputSlippage(text);
                              }
                            }
                          }}
                        ></TextInput>
                      )
                    )}
                  </View>
                </View>

                <View style={{ marginVertical: 20, flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.cancelView}
                    onPress={() => {
                      savedSlippage = 1;
                      setselectedSlippage(RESET_SLIPPAGE_VALUE);
                      setslippageModal(false);
                      setinputSlippage("");
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: ThemeManager.colors.blackWhiteText,
                        fontSize: 16,
                        fontFamily: Fonts.dmMedium,
                      }}
                    >
                      {"Cancel"}
                    </Text>
                  </TouchableOpacity>
                  <View style={{ width: 20 }}></View>
                  {/* <Button 
                buttontext={'save'}
                myStyle={[styles.cancelView]}
                onPress={() => {
                  setslippageModal(false)
                  setsavedSlippage(selectedSlippage?.value)
                }}
                /> */}
                  <TouchableOpacity
                    style={[
                      styles.cancelView,
                      { backgroundColor: ThemeManager.colors.primaryColor },
                    ]}
                    onPress={() => {
                      setslippageModal(false);

                      if (parseFloat(inputSlippage) >= 100) {
                        setTimeout(() => {
                          setAlertTxt("Enter a valid slippage percentage.");
                          showAlertDialog1(true);
                        }, 500);

                        return;
                      }
                      if (
                        selectedSlippage?.value == undefined ||
                        selectedSlippage?.value?.length == 0
                      ) {
                        setAlertTxt("Select slippage");
                        showAlertDialog1(true);
                      }
                      console.log("selectedSlippage ", selectedSlippage?.value);
                      console.log("savedSlippage1111 ", savedSlippage);
                      savedSlippage = selectedSlippage?.value;
                      // setTokenOneAmount("");
                      // setTokenTwoAmount("");
                      // setsavedSlippage(selectedSlippage?.value);
                    }}
                  >
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: ThemeManager.colors.Mainbg,
                        fontSize: 16,
                        fontFamily: Fonts.dmMedium,
                      }}
                    >
                      {"Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CommonModal>
        </ScrollView>

        <View style={styles.btnView}>

          <Button
            buttontext={
              isInsufficientBalance
                ? alertMessages.insufficientBalance
                : PairNotExist
                  ? swapText.pairNotSupported
                  : isApproved
                    ? swapText.swap
                    : !isApproved
                      ? swapText.approval
                      : swapText.swap
            }
            disabled={isInsufficientBalance || PairNotExist || !tokenFirst}
            onPress={async () => {
              console.log(
                "hasvavghvd ----",
                JSON.stringify({
                  tokenOneAmount,
                  tokenOne,
                  tokenSecond,
                  // amountTokenSecond,
                  savedSlippage,
                })
              );
              // return;
              if (!isLoading || !isLoadingText) {

                if (isApproved) {
                  console.log("====swap without gassless======");
                  isApprovalTxn = false
                  onPressSwap(transactionFee);
                } else if (!isApproved) {
                  console.log("====get approval without gassless======");
                  isApprovalTxn = true
                  setShowPinModal(true)
                }
              }
            }}
          />

        </View>
        {AlertDialogNew && (
          <AppAlert
            showSuccess={showSuccess}
            alertTxt={alertTxt}
            hideAlertDialog={() => {
              showAlertDialogNew(false);
              setShowSucess(false);
              if (isReqSent) {
                setIsReqSent(false);
                loadState();
              }
            }}
          />
        )}
        {AlertDialog1 && (
          <AppAlert
            alertTxt={alertTxt}
            showSuccess={showSuccess}
            hideAlertDialog={() => {
              alertDialogPressed();
            }}
          />
        )}
        <LoaderView isSwap={true} isLoading={isLoading} />
        <LoaderView isSwap={true} isLoading={isLoadingText} />
        {confirmTxnModalApprove && (
          <ConfirmSwap
            tokenFirst={tokenFirst}
            tokenSecond={tokenSecond}
            tokenOneAmount={tokenOneAmount}
            tokenTwoAmount={tokenTwoAmount}
            networkFee={transactionFee}
            showConfirmTxnModal={confirmTxnModalApprove}
            conversionRate={`1 ${tokenFirst?.coin_symbol?.toUpperCase()} = ${conversionQuote} ${tokenSecond?.coin_symbol?.toUpperCase()}`}
            slippage={savedSlippage}
            comissionFee={commissionData?.percentage}
            handleBack={() => {
              setLoading(false);
              setConfirmTxnModalApprove(false);
            }}
            text={swapText.approve}
            onPress={() => {
              setConfirmTxnModalApprove(false);
              setTimeout(() => {
                isApprovalTxn = true
                setShowPinModal(true)
              }, 100);
            }}
            nativePrice={toFixedExp(
              parseFloat(transactionFee) * parseFloat(nativePrice),
              2
            )}
          />
        )}

        {confirmTxnModalSwap && (
          <ConfirmSwap
            tokenFirst={tokenFirst}
            tokenSecond={tokenSecond}
            tokenOneAmount={tokenOneAmount}
            tokenTwoAmount={tokenTwoAmount}
            networkFee={transactionFee}
            showConfirmTxnModal={confirmTxnModalSwap}
            conversionRate={`1 ${tokenFirst?.coin_symbol?.toUpperCase()} = ${conversionQuote} ${tokenSecond?.coin_symbol?.toUpperCase()}`}
            slippage={savedSlippage}
            comissionFee={commissionData?.percentage}
            handleBack={() => {
              setLoading(false);
              setConfirmTxnModalSwap(false);
            }}
            text={pins.continueSwap}
            onPress={async () => {
              setConfirmTxnModalSwap(false);
              setTimeout(() => {
                setShowPinModal(true)
              }, 100);
            }}
            nativePrice={toFixedExp(
              parseFloat(transactionFee) * parseFloat(nativePrice),
              2
            )}
          />
        )}
        {showApproveModaL && (
          <ConfirmAlert
            text={pins.Continue}
            alertTxt={alertText}
            hideAlertDialog={() => setShowApproveModal(false)}
            ConfirmAlertDialog={() => {
              setConfirmTxnModalApprove(true);
              setShowApproveModal(false);
            }}
          />
        )}

        {/* --------------------------------Modal for Pin----------------------------------- */}
        <Modal
          statusBarTranslucent
          animationType="slide"
          transparent={true}
          visible={showPinModal}
          onRequestClose={() => {
            setShowPinModal(false);
          }}
        >
          <View style={{ flex: 1 }}>
            <EnterPinForTransaction
              onBackClick={() => {
                setShowPinModal(false);
              }}
              closeEnterPin={async (pin) => {
                setShowPinModal(false);
                setTimeout(async () => {
                  if (isApprovalTxn) {
                    getApproval(pin);
                  } else {
                    let amount = await bigNumberSafeMath(
                      tokenOneAmount,
                      "*",
                      tokenFirst?.decimals
                    );
                    swap(amount.toString(), tokenFirst, encodeData, pin);
                  }
                }, 1500);


              }}
              checkBiometric={true}
            />
          </View>
        </Modal>
        <PriceImpactModal
          visible={pairModalAlert}
          onPress={async () => {
            await setPriceImpactState(false);
            await setPairModalAlert(false);
            if (!isLoading || !isLoadingText) {

              if (isApproved) {
                console.log("====swap======");
                isApprovalTxn = false;
                onPressSwap(transactionFee, true);
              } else if (!isApproved) {
                console.log("====get approval =====");
                isApprovalTxn = true;
                setShowPinModal(true);
              }
            }
          }}
          onRequestClose={() => {
            setPairModalAlert(false);
          }}
        />
      </View>
    </>
  );
};
export default memo(OneInchSwap);
