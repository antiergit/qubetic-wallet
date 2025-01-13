import React, { useState, useEffect, useCallback, memo, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView,
} from 'react-native';
import {
  onChainSwapList,
  getSwapPriceDiff,
  requestSendCoin,
  fetchNativePrice,
} from '../../../Redux/Actions';
import {
  AppAlert,
  Button,
  ConfirmSwap,
  LoaderView,
  ModalCoinList,
  SelectCurrencyNew,
} from '../../common';
import {
  currencyFormat,
  exponentialToDecimal,
  exponentialToDecimalWithoutComma,
  getData,
  toFixed,
  toFixedExp,
} from '../../../Utils/MethodsUtils';
import { Images, Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import * as Constants from '../../../Constants';
import { Actions } from 'react-native-router-flux';
import { useDispatch } from 'react-redux';
import Web3 from 'web3';
import TOKEN_ABI from '../../../tokenContract.ABI.json';
import ROUTER_ABI from '../../../router.ABI.json';
import WRAPPED_ABI from '../../../wrappedABI.json';
import { BigNumber } from 'bignumber.js';
import Singleton from '../../../Singleton';
import styles from './onChainStyle';
import { EventRegister } from 'react-native-event-listeners';
import { ConfirmAlert } from '../../common/ConfirmAlert';
import { LanguageManager } from '../../../../LanguageManager';

var debounce = require('lodash.debounce');
const routerAddress = Constants.ETH_ROUTER_ADDRESS; // uniswap router address
const routerAddressBnb = Constants.BSC_ROUTER_ADDRESS; // pancake router address
const WETH = Constants.network == 'mainnet' ? Constants.WETH_MAINNET : Constants.WETH_TESTNET; // Using Wrapped Ether (WETH) contract address to get ETH equivalent balance
const WBNB = Constants.network == 'mainnet' ? Constants.WBNB_MAINNET : Constants.WBNB_TESTNET;
const GAS_FEE_MULTIPLIER = 0.000000000000000001;
const SLIPPERAGE_PERCENTAGE = 5; //in percent
const TXN_COMPLETE_MAX_TIME = 20; //in minutes
const GAS_BUFFER = 10000;
let path = [];
let tokenOne = '';

const inputType = {
  firstInput: 'firstInput',
  secondInput: 'secondInput',
};
let blockChain = 'binancesmartchain';
const tabData = [
  { title: '25%', key: '1', selected: false },
  { title: '50%', key: '2', selected: false },
  { title: '75%', key: '3', selected: false },
  { title: '100%', key: '4', selected: false },
];

/******************************************************************************************/
const OnChainSwapNew = props => {
  const { alertMessages, pins, swapText, sendTrx } = LanguageManager;
  const [isLoading, setLoading] = useState(false);
  const [isLoadingText, setLoadingText] = useState(false);
  const [coinList, setCoinList] = useState([]);
  const [ExistingCoinList, setExistingCoinList] = useState([]);
  const [NonExistingCoinList, setNonExistingCoinList] = useState([]);
  const [tokenFirst, setTokenFirst] = useState();
  const [tokenSecond, setTokenSecond] = useState();
  const [userBal, setUserBal] = useState(0);
  const [userEthBal, setUserEthBal] = useState(0);
  const [ExistingCoinModal, setExistingCoinModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [AlertDialogNew, showAlertDialogNew] = useState(false);
  const [tokenOneAmount, setTokenOneAmount] = useState('');
  const [tokenTwoAmount, setTokenTwoAmount] = useState('');
  const [alertTxt, setAlertTxt] = useState('');
  const [gasPrice, setGasPrice] = useState(0);
  const [NonExistingCoinModal, setNonExistingCoinModal] = useState(false);
  const [search, setSearch] = useState('');
  const [isInsufficientBalance, setInsufficientBalance] = useState(false);
  const [PairNotExist, setPairNotExist] = useState(false);
  const [isApproved, setUserApproval] = useState(true);
  const [gasEstimate, setGasEstimate] = useState(0);
  const [transactionFee, setTransactionFee] = useState('0.000000');
  const [rawTxnObj, setRawTxnObj] = useState({});
  const [allownceTxnObj, setAllowancetxnObj] = useState({});
  const [toggleSwap, setToggleSwap] = useState(false);
  const [showApproveModaL, setShowApproveModal] = useState(false);
  const [alertText, setAlertText] = useState('');
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
  const [nativePrice, setNativePrice] = useState('0.00');
  const scrollRef = useRef();
  const dispatch = useDispatch();

  /******************************************************************************************/
  useEffect(() => {
    if (!props?.isVisible) {
      setTokenTwoAmount('');
      setTokenOneAmount('');
      setSelectedIndex(null);
    }
  }, [props?.isVisible]);

  /******************************************************************************************/
  useEffect(() => {
    EventRegister.addEventListener(Constants.DOWN_MODAL, () => {
      console.log('chk currentScene:::::::', Actions.currentScene);
      (Actions.currentScene == '_Swap' || Actions.currentScene == 'Swap') && loadState();
    });
    loadState();
    let focusListener = props.navigation.addListener('didFocus', () => {
      loadState();
    });
    let blurListener = props.navigation.addListener('didBlur', () => {
      setExistingCoinModal(false);
      setNonExistingCoinModal(false);
      setConfirmTxnModalApprove(false);
      setConfirmTxnModalSwap(false);
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

  /******************************************************************************************/
  const loadState = () => {
    setLoading(false);
    setLoadingText(false);
    getFromToAmtDiff();
    setTokenOneAmount('');
    setTokenTwoAmount('');
    setSelectedIndex(null);
    setUserApproval(true);
    setInsufficientBalance(false);
    setConfirmTxnModalApprove(false);
    setConfirmTxnModalSwap(false);
    showAlertDialogNew(false);
    setPairNotExist(false);
    setTransactionFee('0.00');
    getList_gasPrice();
  };

  /******************************************************************************************/
  const getFromToAmtDiff = () => {
    dispatch(getSwapPriceDiff()).then(async res => {
      setFromToAmtDiff(res?.value);
    }).catch(err => {
      console.log('getFromToAmtDiff_Err===>>>>>', err);
      setLoading(false);
    });
  };

  /******************************************************************************************/
  const getList_gasPrice = async () => {
    getGasPrice();
    await getData(Constants.ONCHAIN_LIST).then(swapList => {
      if (swapList != null) {
        const SwapList = JSON.parse(swapList);
        const nonExistItem = SwapList.filter(item => item.coin_family == SwapList[0].coin_family);
        const existingList = SwapList.filter(item => item.wallets?.length > 0)
        setCoinList(SwapList);
        setExistingCoinList(existingList);
        setNonExistingCoinList(nonExistItem);
        setTokenFirst(existingList[0]);
        tokenOne = existingList[0];

        // const TokenTwo = props?.item != undefined && nonExistItem.filter(element => element?.coin_family == props?.item?.coin_family);
        // const TokenTwoFinal = props?.item != undefined && TokenTwo.find(element => element?.coin_name != props?.item?.coin_name);
        const isExist = (nonExistItem && existingList) ? nonExistItem[0]?.coin_symbol?.toLowerCase() == existingList[0]?.coin_symbol?.toLowerCase() : ''
        console.log('nonExistItem:::::::', nonExistItem)
        console.log('existingList:::::::', existingList)
        console.log('isExist:::::::', isExist)
        setTokenSecond(isExist ? nonExistItem[1] : nonExistItem[0]);
        getUserBal(existingList[0]);
        getSwapList();
      } else {
        getSwapList();
      }
    });
  };

  /******************************************************************************************/
  const getGasPrice = () => {
    getWeb3Object().eth.getGasPrice().then(gasPrice => {
      console.log('-----------------gasPrice-----------', gasPrice);
      setGasPrice(gasPrice);
    }).catch(err => {
      console.log(':::::::::getGasPrice_ERR', err);
      if (err == 'Please check your network connection') {
        setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
        showAlertDialogNew(true);
      }
      setLoading(false);
    });
  };

  /******************************************************************************************/
  const getSwapList = async () => {
    getData(Constants.ACCESS_TOKEN).then(async ACCESS_TOKEN => {
      setLoading(true);
      const ethAddress = await Singleton.getInstance().defaultEthAddress;
      const addrsListKeys = [ethAddress, ethAddress, ethAddress];
      const coin_family = [1, 2, 3];
      dispatch(onChainSwapList({ ACCESS_TOKEN, addrsListKeys, coin_family })).then(async res => {
        const nonExistItem = res.filter(item => item?.coin_family == res[0]?.coin_family);
        const existingList = res.filter(item => item.wallets?.length > 0)
        setCoinList(res);
        setExistingCoinList(existingList);
        setNonExistingCoinList(nonExistItem);
        setTokenFirst(existingList[0]);
        tokenOne = existingList[0];
        blockChain = existingList[0].coin_family == 1 ? 'binancesmartchain' : 'ethereum';
        const isExist = (nonExistItem && existingList) ? nonExistItem[0]?.coin_symbol?.toLowerCase() == existingList[0]?.coin_symbol?.toLowerCase() : ''
        // console.log('nonExistItem:::::::1111', nonExistItem)
        // console.log('existingList:::::::111', existingList)
        // console.log('isExist:::::::11111', isExist)
        setTokenSecond(isExist ? nonExistItem[1] : nonExistItem[0]);
        fetchNativePrice_(existingList[0]?.coin_family);
        getUserBal(existingList[0]);
        setLoading(false);
      }).catch(err => {
        console.log('Err====== getswapcoinlist', err);
        setLoading(false);
      });
    }).catch(error => {
      console.log('ACCESS_TOKEN_ERR===>>>>>', error);
      setLoading(false);
    });
  };

  /******************************************************************************************/
  const fetchNativePrice_ = coin_family => {
    let data = {
      fiat_currency: Singleton.getInstance().CurrencySelected,
      coin_family: coin_family,
    };
    dispatch(fetchNativePrice({ data })).then(res => {
      setNativePrice(toFixedExp(res?.fiatCoinPrice?.value, 2));
      console.log('chk res native price:::::', res);
    }).catch(err => {
      console.log('chk err native price:::::', err);
    });
  };

  /******************************************************************************************/
  const getWeb3Object = () => {
    console.log('chk:::::::blockChain', blockChain);
    return blockChain == 'ethereum' ? new Web3(Singleton.getInstance().ETH_RPC_URL) : new Web3(Singleton.getInstance().BSC_RPC_URL);// Constants.network == 'testnet' ? new Web3(Constants.BSC_TESTNET_URL) : new Web3(Constants.BSC_MAINNET_URL);
    // return blockChain == 'ethereum' ? Constants.network == 'testnet' ? new Web3(Constants.ETH_TESTNET_SWAP) : new Web3(Constants.ETH_MAINNET_SWAP) :  Constants.network == 'testnet' ? new Web3(Constants.BSC_TESTNET_URL) : new Web3(Constants.BSC_MAINNET_URL);
  };

  /******************************************************************************************/
  const getUserBal = async item => {
    try {
      const userBal_ = item?.wallets[0].balance;
      const TokenBal = userBal_ ? userBal_ > 0 ? toFixedExp(userBal_, 8) : '0.00' : '0.00';
      const userEthBal_ = item?.native_wallet_data[0].balance;
      const NativeCoinBal = userEthBal_ ? userEthBal_ > 0 ? toFixedExp(userEthBal_, 8) : '0.00' : '0.00';
      setUserBal(TokenBal);
      setUserEthBal(NativeCoinBal);
      setLoading(false);
      return TokenBal;
    } catch (error) {
      setLoading(false);
    }
  };

  /******************************************************************************************/
  const existingCoinList = text => {
    setSearch(text);
    setFromSearch(true);
    debounceLoadData(text);
  };

  /******************************************************************************************/
  const debounceLoadData = useCallback(
    debounce(text => {
      searchExistingFilterFunction(text);
    }, 1000),
    [],
  );

  /******************************************************************************************/
  const searchExistingFilterFunction = async search => {
    const coinListData = await getData(Constants.ONCHAIN_LIST);
    const coinList = JSON.parse(coinListData);
    const NameList = [];
    setExistingCoinList([]);
    if (search == '') {
      setExistingCoinList(coinList.filter(item => item.wallets?.length > 0));
    } else {
      const list = coinList.filter(item => item.wallets?.length > 0);
      list.filter(value => {
        if (value?.coin_name?.toLowerCase()?.includes(search.toLowerCase()) || value?.coin_symbol?.toLowerCase()?.includes(search.toLowerCase())) {
          NameList.push(value);
          setExistingCoinList(NameList);
          // Keyboard.dismiss();
        }
      });
    }
  };

  /******************************************************************************************/
  const nonExistingCoinList = text => {
    setSearch(text);
    setFromSearch(true);
    debounceLoadDataTwo(text);
  };

  /******************************************************************************************/
  const debounceLoadDataTwo = useCallback(
    debounce(text => {
      searchNonExistingFilterFunction(text);
    }, 1000),
    [],
  );

  /******************************************************************************************/
  const searchNonExistingFilterFunction = async search => {
    const coinListData = await getData(Constants.ONCHAIN_LIST);
    const coinList = JSON.parse(coinListData);
    // console.log(search, 'chk coinList::::::', coinList);
    const NameList = [];
    setNonExistingCoinList([]);
    if (search == '') {
      setNonExistingCoinList(coinList.filter(item => item?.coin_family == tokenOne?.coin_family));
    } else {
      const arr = await coinList.filter(
        item => item?.coin_family == tokenOne?.coin_family,
      );
      console.log(tokenOne?.coin_family, 'chk arr::::::', arr);
      arr.filter(value => {
        if (value?.coin_name?.toLowerCase()?.includes(search.toLowerCase()) || value?.coin_symbol?.toLowerCase()?.includes(search.toLowerCase())) {
          NameList.push(value);
          setNonExistingCoinList(NameList);
          // Keyboard.dismiss();
        }
      });
    }
  };

  /******************************************************************************************/
  const initialState = () => {
    setTokenOneAmount('');
    setTokenTwoAmount('');
  };

  /******************************************************************************************/
  const onPressExistList = item => {
    if (!global.isConnected) {
      showAlertDialogNew(true);
      setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
      return;
    } else {
      // setLoading(true);
      setTimeout(async () => {
        console.log('chk item::::', item);
        let secondItem = tokenSecond;
        console.log('chk secondItem::::', secondItem);
        blockChain = item.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
        const list = await coinList.filter(itemNew => itemNew?.coin_family == item?.coin_family);
        setNonExistingCoinList(list);
        if (item?.coin_family != tokenSecond?.coin_family) {
          if (item?.coin_symbol == list[0]?.coin_symbol) {
            setTokenSecond(list[1]);
            secondItem = list[1];
          } else {
            setTokenSecond(list[0]);
            secondItem = list[0];
          }
        }
        const isTogglePress = true;
        if (item?.coin_symbol == secondItem?.coin_symbol) {
          const temp = tokenFirst;
          setTokenSecond(temp);
          // onChangeText({
          //   tokenFirst: item,
          //   tokenSecond: temp,
          //   value: tokenOneAmount,
          //   type: inputType.firstInput,
          //   isTogglePress,
          // });
        } else {
          // onChangeText({
          //   tokenFirst: item,
          //   tokenSecond: secondItem,
          //   value: tokenOneAmount,
          //   type: inputType.firstInput,
          //   isTogglePress,
          // });
        }
        setTokenFirst(item);
        tokenOne = item;
        setExistingCoinModal(false);
        setTokenOneAmount('');
        setTokenTwoAmount('')
        setSelectedIndex(null);
        setTransactionFee('0.00');
      }, 100);
    }
  };

  /******************************************************************************************/
  const onPressNonExistList = async item => {
    if (!global.isConnected) {
      showAlertDialogNew(true);
      setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
      return;
    } else {
      // setLoading(true);
      setTimeout(() => {
        let firstItem = tokenFirst;
        blockChain = item?.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
        const list = item?.coin_family == 1 ? ExistingCoinList.sort((a, b) => a.coin_family - b.coin_family) : ExistingCoinList.sort((a, b) => b.coin_family - a.coin_family);
        console.log('list:::: non exist', list);
        const isTogglePress = true;
        if (item?.coin_family != tokenFirst?.coin_family) {
          if (item?.coin_symbol == list[0]?.coin_symbol) {
            setTokenFirst(list[1]);
            tokenOne = list[1];
            firstItem = list[1];
          } else {
            setTokenFirst(list[0]);
            tokenOne = list[0];
            firstItem = list[0];
          }
        }
        if (item?.coin_symbol == firstItem?.coin_symbol) {
          // setLoading(false);
          return;
        } else {
          // onChangeText({
          //   tokenFirst: firstItem,
          //   tokenSecond: item,
          //   value: tokenOneAmount,
          //   type: inputType.firstInput,
          //   isTogglePress,
          // });
        }
        setTokenSecond(item);
        setTokenOneAmount('');
        setTokenTwoAmount('')
        setSelectedIndex(null);
        setTransactionFee('0.00');
        setNonExistingCoinModal(false);
      }, 100);
    }
  };

  /******************************************************************************************/
  const onChangeText = useCallback(
    ({ tokenFirst, tokenSecond, type, value, isTogglePress = false }) => {
      if (isTogglePress) {
        onChangeTextFinal({ tokenFirst, tokenSecond, type, value });
      } else {
        if (value?.length == 0 || value == 0 || value == '.' || value?.trim() == '') {
          if (parseFloat(value) <= 0) {
            initialState();
            return;
          }
          return;
        } else {
          onChangeTextFinal({ tokenFirst, tokenSecond, type, value });
        }
      }
    },
    [],
  );

  /******************************************************************************************/
  const onChangeTextDebounce = useCallback(
    debounce(({ tokenFirst, tokenSecond, type, value, isTogglePress }) => {
      console.log('value:::::!11111', value);
      if (value?.length == 0 || value == 0 || value == '.' || value?.trim() == '') {
        initialState();
        return;
      } else {
        onChangeTextFinal({ tokenFirst, tokenSecond, type, value });
      }
    }, 1500),
    [],
  );

  /******************************************************************************************/
  const getContractObject = async (tokenAddress, abi = TOKEN_ABI) => {
    try {
      const web3Object = getWeb3Object();
      const tokenContractObject = await new web3Object.eth.Contract(abi, tokenAddress);
      return tokenContractObject;
    } catch (e) {
      console.error('error ===>>', e);
    }
  };

  /******************************************************************************************/
  const getAmountsInOut = async (
    tokenFirstDecimals,
    tokenSecondDecimals,
    amount,
    tokenType,
    blockChain,
    tokenFirst,
    tokenSecond,
  ) => {
    console.log('path::::', path);
    try {
      setInsufficientBalance(false);
      const decimals = tokenType == inputType.firstInput ? tokenFirstDecimals : tokenSecondDecimals;
      const addAmountIn = (amount * (1 * decimals)).toFixed(0);
      const calAmount = BigNumber(addAmountIn).toFixed();
      const routerContractObject = await getContractObject(blockChain == 'ethereum' ? routerAddress : routerAddressBnb, ROUTER_ABI);
      let result;
      if (tokenType == inputType.firstInput) {
        try {
          {
            /* *********************************************************** chk route for both (token to token, BNB to token and token to BNB)(binancesmartchain) ********************************************************************** */
          }
          if (blockChain?.toLowerCase() == 'binancesmartchain') {
            let path1 = [...path];
            let tempPath = [...path];
            let tempPath2 = [...path];
            let tempPath3 = [...path];
            tempPath.splice(1, 0, Constants.BUSD_ADDRESS); // BUSD address
            tempPath2.splice(1, 0, Constants.WBNB_MAINNET); // WBNB address
            tempPath3.splice(1, 0, Constants.USDT_ADDRESS); // USDT address
            let result1;
            try {
              result1 = await routerContractObject.methods.getAmountsOut(calAmount, path1).call();
            } catch (err) {
              console.log('chk result1 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result1 = 0;
              }
            }
            console.log('chk:::::result1', result1);
            const amountWithTwoAddressPath = result1 != undefined ? `${exponentialToDecimal((result1[result1.length - 1] / tokenSecond.decimals).toFixed(8))}` : 0;

            let result2;
            try {
              result2 = await routerContractObject.methods.getAmountsOut(calAmount, tempPath).call();
              console.log('chk:::::result2 tempPath:::::::', tempPath);
            } catch (err) {
              console.log('chk result2 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result2 = 0;
              }
            }
            console.log('chk:::::result2', result2);
            const amountwithThreeAddressPath = result2 != undefined ? `${exponentialToDecimal((result2[result2.length - 1] / tokenSecond.decimals).toFixed(8))}` : 0;

            let result3;
            try {
              result3 = await routerContractObject.methods.getAmountsOut(calAmount, tempPath2).call();
            } catch (err) {
              console.log('chk result3 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result3 = 0;
              }
            }
            console.log('chk:::::result3', result3);
            const amountwithFourAddressPath = result3 != undefined ? `${exponentialToDecimal((result3[result3.length - 1] / tokenSecond.decimals).toFixed(8))}` : 0;

            let result4;
            try {
              result4 = await routerContractObject.methods.getAmountsOut(calAmount, tempPath3).call();
            } catch (err) {
              console.log('chk result4 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result4 = 0;
              }
            }
            console.log('chk:::::result4', result4);
            const amountwithFiveAddressPath = result4 != undefined ? `${exponentialToDecimal((result4[result4.length - 1] / tokenSecond.decimals).toFixed(8))}` : 0;
            if (parseFloat(amountwithFiveAddressPath) > parseFloat(amountwithFourAddressPath)) {
              if (parseFloat(amountwithFiveAddressPath) > parseFloat(amountwithThreeAddressPath)) {
                if (parseFloat(amountwithFiveAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath3;
                } else {
                  path = path1;
                }
              } else {
                if (parseFloat(amountwithThreeAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath;
                } else {
                  path = path1;
                }
              }
            } else {
              if (parseFloat(amountwithFourAddressPath) > parseFloat(amountwithThreeAddressPath)) {
                if (parseFloat(amountwithFourAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath2;
                } else {
                  path = path1;
                }
              } else {
                if (parseFloat(amountwithThreeAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath;
                } else {
                  path = path1;
                }
              }
            }
          }
          // chk route for both (token to token, ETH to token or token to ETH)(ETHEREUM)
          else if (blockChain?.toLowerCase() == 'ethereum') {
            let path1 = [...path];
            let tempPath = [...path];
            let tempPath2 = [...path];

            tempPath.splice(1, 0, Constants.USDT_ADDRESS);
            tempPath2.splice(1, 0, Constants.WETH_MAINNET);

            let result1;
            try {
              result1 = await routerContractObject.methods.getAmountsOut(calAmount, path1).call();
            } catch (err) {
              console.log('chk result1 err ethereum::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result1 = 0;
              }
            }
            console.log('chk:::::::result1_for_ethereum', result1);
            const amountWithTwoAddressPath = result1 != undefined ? `${exponentialToDecimal((result1[result1.length - 1] / tokenSecond.decimals).toFixed(8))}` : 0;

            let result2;
            try {
              result2 = await routerContractObject.methods.getAmountsOut(calAmount, tempPath).call();
            } catch (err) {
              console.log('chk result2 err::::ethereum', err);
              if (err === 'Error: Returned error: execution reverted') {
                result2 = 0;
              }
            }
            console.log('chk:::::result2_for_ethereum', result2);
            const amountwithThreeAddressPath = result2 != undefined ? `${exponentialToDecimal((result2[result2.length - 1] / tokenSecond.decimals).toFixed(8))}` : 0;

            let result3;
            try {
              result3 = await routerContractObject.methods.getAmountsOut(calAmount, tempPath2).call();
            } catch (err) {
              console.log('chk result3 err::::ethereum', err);
              if (err === 'Error: Returned error: execution reverted') {
                result3 = 0;
              }
            }
            console.log('chk:::::result3_for_ethereum', result3);
            const amountwithFourAddressPath = result3 != undefined ? `${exponentialToDecimal((result3[result3.length - 1] / tokenSecond.decimals).toFixed(8))}` : 0;

            if (parseFloat(amountwithFourAddressPath) > parseFloat(amountwithThreeAddressPath)) {
              if (parseFloat(amountwithFourAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                path = tempPath2;
              } else {
                path = path1;
              }
            } else {
              if (parseFloat(amountwithThreeAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                path = tempPath;
              } else {
                path = path1;
              }
            }
          }

          // console.log("Final Path_getAmountsOut", path)
          result = await routerContractObject.methods.getAmountsOut(calAmount, path).call();
          console.log('=====getAmountsOut=========result', result);
        } catch (e) {
          console.log('chk getAmountsOut err::::', e);
        }
      } else {
        try {
          console.log('=====TK2=========', inputType.secondInput);
          {
            /* *********************************************************** chk route for both (token to token, BNB to token and token to BNB)(binancesmartchain)Toggle Case ********************************************************************** */
          }
          if (blockChain?.toLowerCase() == 'binancesmartchain') {
            let path1 = [...path];
            let tempPath = [...path];
            let tempPath2 = [...path];
            let tempPath3 = [...path];
            tempPath.splice(1, 0, Constants.BUSD_ADDRESS); //BUSD address
            tempPath2.splice(1, 0, Constants.WBNB_MAINNET); //WBNB address added
            tempPath3.splice(1, 0, Constants.USDT_ADDRESS); // USDT address

            let result1;
            try {
              result1 = await routerContractObject.methods.getAmountsIn(calAmount, path1).call();
            } catch (err) {
              console.log('chk result1 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result1 = 0;
              }
            }
            console.log('chk::::result1', result1);
            const amountWithTwoAddressPath = result1 != undefined ? `${exponentialToDecimal((result1[result1.length - 1] / tokenFirst.decimals).toFixed(8))}` : 0;

            let result2;
            try {
              result2 = await routerContractObject.methods.getAmountsIn(calAmount, tempPath).call();
            } catch (err) {
              console.log('chk result2 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result2 = 0;
              }
            }
            console.log('chk:::::result2', result2);
            const amountwithThreeAddressPath = result2 != undefined ? `${exponentialToDecimal((result2[result2.length - 1] / tokenFirst.decimals).toFixed(8))}` : 0;

            let result3;
            try {
              result3 = await routerContractObject.methods.getAmountsIn(calAmount, tempPath2).call();
            } catch (err) {
              console.log('chk result3 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result3 = 0;
              }
            }
            console.log('chk:::::result3', result3);
            const amountwithFourAddressPath = result3 != undefined ? `${exponentialToDecimal((result3[result3.length - 1] / tokenFirst.decimals).toFixed(8))}` : 0;

            let result4;
            try {
              result4 = await routerContractObject.methods.getAmountsIn(calAmount, tempPath3).call();
            } catch (err) {
              console.log('chk result4 err::::', err);
              if (err === 'Error: Returned error: execution reverted') {
                result4 = 0;
              }
            }
            console.log('chk:::::result4', result4);
            const amountwithFiveAddressPath = result4 != undefined ? `${exponentialToDecimal((result4[result4.length - 1] / tokenFirst.decimals).toFixed(8))}` : 0;

            if (parseFloat(amountwithFiveAddressPath) > parseFloat(amountwithFourAddressPath)) {
              if (parseFloat(amountwithFiveAddressPath) > parseFloat(amountwithThreeAddressPath)) {
                if (parseFloat(amountwithFiveAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath3;
                } else {
                  path = path1;
                }
              } else {
                if (parseFloat(amountwithThreeAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath;
                } else {
                  path = path1;
                }
              }
            } else {
              if (parseFloat(amountwithFourAddressPath) > parseFloat(amountwithThreeAddressPath)) {
                if (parseFloat(amountwithFourAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath2;
                } else {
                  path = path1;
                }
              } else {
                if (parseFloat(amountwithThreeAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                  path = tempPath;
                } else {
                  path = path1;
                }
              }
            }
          }
          //{/* *********************************************************** chk route for both (token to token,ETH to token or token to ETH)(ETHEREUM)Toggle Case ********************************************************************** */ }
          else if (blockChain?.toLowerCase() == 'ethereum') {
            let path1 = [...path];
            let tempPath = [...path];
            let tempPath2 = [...path];
            tempPath.splice(1, 0, Constants.USDT_ADDRESS);
            tempPath2.splice(1, 0, Constants.WETH_MAINNET);

            let result1;
            try {
              result1 = await routerContractObject.methods.getAmountsIn(calAmount, path1).call();
            } catch (err) {
              console.log('chk result1 err ethereum::::000', err);
              if (err === 'Error: Returned error: execution reverted') {
                result1 = 0;
              }
            }
            console.log('chk::::result1_for_ethereum000', result1);
            const amountWithTwoAddressPath = result1 != undefined ? `${exponentialToDecimal((result1[result1.length - 1] / tokenFirst.decimals).toFixed(8))}` : 0;

            let result2;
            try {
              result2 = await routerContractObject.methods.getAmountsIn(calAmount, tempPath).call();
            } catch (err) {
              console.log('chk result2 err::::ethereum000', err);
              if (err === 'Error: Returned error: execution reverted') {
                result2 = 0;
              }
            }
            console.log('chk::::result2_for_ethereum000', result2);
            const amountwithThreeAddressPath = result2 != undefined ? `${exponentialToDecimal((result2[result2.length - 1] / tokenFirst.decimals).toFixed(8))}` : 0;

            let result3;
            try {
              result3 = await routerContractObject.methods.getAmountsIn(calAmount, tempPath2).call();
            } catch (err) {
              console.log('chk result3 err::::ethereum000', err);
              if (err === 'Error: Returned error: execution reverted') {
                result3 = 0;
              }
            }
            console.log('chk:::::result3_for_ethereum000', result3);
            const amountwithFourAddressPath = result3 != undefined ? `${exponentialToDecimal((result3[result3.length - 1] / tokenFirst.decimals).toFixed(8))}` : 0;

            if (parseFloat(amountwithThreeAddressPath) > parseFloat(amountWithTwoAddressPath)) {
              if (parseFloat(amountwithFourAddressPath) > parseFloat(amountwithThreeAddressPath)) {
                path = tempPath2;
              } else {
                path = tempPath;
              }
            } else {
              if (parseFloat(amountwithFourAddressPath) > parseFloat(amountWithTwoAddressPath)) {
                path = tempPath2;
              } else {
                path = path1;
              }
            }
          }

          // console.log("Final Path000", path)
          result = await routerContractObject.methods.getAmountsIn(calAmount, path).call();
          console.log('final_Result::::::::::::getAmountsIn', result);
        } catch (e) {
          console.log('chk getAmountsIn err::::', e);
        }
      }

      console.log('::::::finalpath', path);
      console.log(':::::::::result:::::Final', result);
      return { result };
    } catch (err) {
      console.log(err.message);
      setLoading(false);
      if (err.message.includes('INSUFFICIENT_LIQUIDITY')) {
        setInsufficientBalance(true);
      }
    }
  };

  /******************************************************************************************/
  const checkContractApproval = async ({ path, result }) => {
    const userAddress = Singleton.getInstance().defaultEthAddress;
    const tokenContractObject = await getContractObject(path[0]);
    const allowance = await tokenContractObject.methods.allowance(userAddress, blockChain == 'ethereum' ? routerAddress : routerAddressBnb).call({ 'from': userAddress });
    if (BigNumber(allowance).toFixed(0) <= parseInt(result[0])) {
      setUserApproval(false);
      return false;
    } else {
      setUserApproval(true);
      return true;
    }
  };

  /******************************************************************************************/
  const onChangeTextFinal = async ({ tokenFirst, tokenSecond, type, value }) => {
    Keyboard.dismiss();
    setLoading(false);
    setLoadingText(true);
    setTimeout(() => {
      setTokenFirstForApproval(tokenFirst);
      setTokenSecondForApproval(tokenSecond);
      setInputTypeForApproval(type);
      setValueForApproval(value);
      blockChain = tokenFirst?.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
      const userAddress = Singleton.getInstance().defaultEthAddress;
      //  console.log('userAddress:::::', userAddress);
      return new Promise((resolve, reject) => {
        getWeb3Object().eth.getGasPrice().then(async gasPrice => {
          const userBal = await getUserBal(tokenFirst);
          if (!value || parseFloat(value) <= 0) {
            //empty value
            type == inputType.firstInput ? setTokenTwoAmount('') : setTokenOneAmount('');
            setLoadingText(false);
            return;
          }
          const firstAddress = tokenFirst?.is_token == 1 ? tokenFirst?.token_address?.toLowerCase() : tokenFirst?.coin_family == 2 ? WETH : WBNB;
          const secondAddress = tokenSecond?.is_token == 1 ? tokenSecond?.token_address?.toLowerCase() : tokenSecond?.coin_family == 2 ? WETH : WBNB;
          path = [firstAddress, secondAddress];
          console.log('_____________TOKEN FIRST ', tokenFirst);
          console.log('_____________TOKEN SECOND ', tokenSecond);
          const { result } = await getAmountsInOut(tokenFirst.decimals, tokenSecond.decimals, parseFloat(value), type, blockChain, tokenFirst, tokenSecond);
          console.log('_____________result ', result);
          setFinalResult(result ? result : null);
          setFinalPath(path);
          if (result) {
            setPairNotExist(false);
            type == inputType.firstInput ? setTokenTwoAmount(`${toFixedExp(result[result.length - 1] / tokenSecond.decimals, 6)}`) : setTokenOneAmount(`${exponentialToDecimal((result[0] / tokenFirst.decimals).toFixed(8))}`);
            console.log('_____________result herere,type', type);

            const routerContractObject = await getContractObject(tokenFirst.coin_family == 1 ? routerAddressBnb : routerAddress, ROUTER_ABI);
            console.log('_____________result rrouterContractObject');
            const amountAMin = BigNumber(result[0]).toFixed(0);
            console.log('amountAMin:::::', amountAMin);
            const amountBMin = BigNumber(result[result.length - 1] - (result[result.length - 1] * SLIPPERAGE_PERCENTAGE) / 100).toFixed(0);
            let deadline = Math.floor(new Date().getTime() / 1000);
            deadline = deadline + TXN_COMPLETE_MAX_TIME * 60;
            const bal_user = userBal * tokenFirst.decimals;
            if (bal_user < result[0]) {
              setInsufficientBalance(true);
            } else {
              setInsufficientBalance(false);
            }
            {/* *********************************************************** ETH To WETH || BNB To WBNB ********************************************************************** */ }
            if (((tokenFirst?.coin_symbol?.toLowerCase() == 'eth' && tokenFirst?.coin_name?.toLowerCase() == 'ethereum') && (tokenSecond?.coin_symbol?.toLowerCase() == 'weth' && tokenSecond?.coin_name?.toLowerCase() == 'wrapped ether')) || ((tokenFirst?.coin_symbol?.toLowerCase() == 'bnb' && tokenFirst?.coin_name?.toLowerCase() == 'bnb smart chain') && (tokenSecond?.coin_symbol?.toLowerCase() == 'wbnb' && tokenSecond?.coin_name?.toLowerCase() == 'wrapped bnb'))) {
              setUserApproval(true);
              console.log('here::::::ETH To WETH || BNB To WBNB')
              const contractObject = await getContractObject(firstAddress, WRAPPED_ABI);
              console.log('here::::::ETH To WETH || BNB To WBNB::::contractObject', contractObject)
              const callDeposit = await contractObject.methods.deposit().encodeABI();
              console.log('here::::::ETH To WETH || BNB To WBNB::::callDeposit', callDeposit)
              contractObject.methods.deposit().estimateGas({ from: userAddress }).then(async (gasEstimate) => {
                console.log('here::::::ETH To WETH || BNB To WBNB::::gasEstimate', gasEstimate)
                const txnFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setTransactionFee(toFixed(txnFee, 6));
                setRawTxnObj({
                  type: tokenFirst?.coin_symbol?.toLowerCase(),
                  data: callDeposit,
                  value: amountAMin.toString(),
                });
                setLoadingText(false);
                // return resolve(gasEstimate);
              }).catch(err => {
                console.log('err.message==>>>ETH To WETH || BNB To WBNB::::', err.message);
                setLoadingText(false);
                if (err.message.includes('insufficient funds')) {
                  setInsufficientBalance(true);
                } else if (err.message.includes('IDENTICAL_ADDRESSES')) {
                  setPairNotExist(true);
                }
              });
            } else if ((tokenFirst?.coin_symbol?.toLowerCase() == 'eth' && tokenFirst?.coin_name?.toLowerCase() == 'ethereum') || (tokenFirst?.coin_symbol?.toLowerCase() == 'bnb' && tokenFirst?.coin_name?.toLowerCase() == 'bnb smart chain')) {
              {/* *********************************************************** ETH To TOKEN ********************************************************************** */ }
              const swapTransaction = await routerContractObject.methods.swapExactETHForTokens(amountBMin.toString(), path, userAddress, deadline);
              swapTransaction.estimateGas({ from: userAddress, value: amountAMin.toString() }).then(async gasEstimate => {
                console.log('-----estimateGas-------1111111111', gasEstimate);
                const txnFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
                setGasEstimate(gasEstimate + GAS_BUFFER);
                setTransactionFee(toFixed(txnFee, 6));
                setRawTxnObj({
                  type: tokenFirst?.coin_symbol?.toLowerCase(),
                  data: swapTransaction.encodeABI(),
                  value: amountAMin.toString(),
                });
                setLoadingText(false);
                return resolve(gasEstimate);
              }).catch(err => {
                console.log('err.message==>>>', err.message);
                setLoadingText(false);
                if (err.message.includes('insufficient funds')) {
                  setInsufficientBalance(true);
                } else if (err.message.includes('IDENTICAL_ADDRESSES')) {
                  setPairNotExist(true);
                }
              });
            } else {
              const isApproved = await checkContractApproval({ path, result });
              console.log('isApproved ======>>', isApproved);
              if (!isApproved) {
                let tokenContractObject = await getContractObject(path[0]);
                setAllowancetxnObj({
                  tokenContractObject: tokenContractObject,
                  path: path[0],
                });
                const routerAdd = blockChain?.toLowerCase() === 'ethereum' ? routerAddress : routerAddressBnb;
                const userAddress = Singleton.getInstance().defaultEthAddress;
                tokenContractObject.methods.approve(routerAdd, BigNumber(10 ** 25).toFixed(0)).estimateGas({ from: userAddress }).then(async gasEstimate => {
                  console.log('-----estimateGas-------11', gasEstimate);
                  setGasEstimate(gasEstimate + GAS_BUFFER);
                  const txnFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
                  const finalTxnFee = toFixed(txnFee, 6);
                  setTransactionFee(finalTxnFee);
                  setLoadingText(false);
                  // return resolve(gasEstimate);
                }).catch(err => {
                  console.log('estimateGas_err', err);
                  setLoadingText(false);
                  if (err.message.includes('insufficient funds')) {
                    setInsufficientBalance(true);
                  }
                });

              } else {
                if (((tokenFirst?.coin_symbol?.toLowerCase() == 'weth' && tokenFirst?.coin_name?.toLowerCase() == 'wrapped eth') && (tokenSecond?.coin_symbol?.toLowerCase() == 'eth' && tokenSecond?.coin_name?.toLowerCase() == 'ethereum')) || ((tokenFirst?.coin_symbol?.toLowerCase() == 'wbnb' && tokenFirst?.coin_name?.toLowerCase() == 'wrapped bnb') && (tokenSecond?.coin_symbol?.toLowerCase() == 'bnb' && tokenSecond?.coin_name?.toLowerCase() == 'bnb smart chain'))) {
                  {/* *********************************************************** WETH To ETH || WBNB To BNB ********************************************************************** */ }
                  console.log('here:::::: WETH To ETH || WBNB To BNB')
                  const amountSend = exponentialToDecimalWithoutComma(value * tokenFirst?.decimals)
                  const contractObject = await getContractObject(firstAddress, WRAPPED_ABI);
                  console.log(amountSend, 'here:::::: WETH To ETH || WBNB To BNB::::contractObject', contractObject)
                  const callWithdraw = await contractObject.methods.withdraw(amountSend).encodeABI();
                  console.log('here:::::: WETH To ETH || WBNB To BNB::::callWithdraw', callWithdraw)
                  contractObject.methods.withdraw(amountSend).estimateGas({ from: userAddress }).then(async (gasEstimate) => {
                    console.log('here:::::: WETH To ETH || WBNB To BNB::::gasEstimate', gasEstimate)
                    const txnFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
                    setGasEstimate(gasEstimate + GAS_BUFFER);
                    setTransactionFee(toFixed(txnFee, 6));
                    setRawTxnObj({
                      type: 'token',
                      data: callWithdraw,
                    });
                    setLoadingText(false);
                    // return resolve(gasEstimate);
                  }).catch(err => {
                    console.log('err.message==>>> WETH To ETH || WBNB To BNB::::', err.message);
                    setLoadingText(false);
                    if (err.message.includes('insufficient funds')) {
                      setInsufficientBalance(true);
                    } else if (err.message.includes('IDENTICAL_ADDRESSES')) {
                      setPairNotExist(true);
                    }
                  });
                } else if ((tokenSecond?.coin_symbol?.toLowerCase() == 'eth' && tokenSecond?.coin_name?.toLowerCase() == 'ethereum') || (tokenSecond?.coin_symbol?.toLowerCase() == 'bnb' && tokenSecond?.coin_name?.toLowerCase() == 'bnb smart chain')) {
                  {/* *********************************************************** TOKEN To ETH ********************************************************************** */ }
                  const swapTransaction = await routerContractObject.methods.swapExactTokensForETHSupportingFeeOnTransferTokens(amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline);
                  // console.log("swapTransaction>", amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline)
                  console.log('TOKEN TO COIN ======>>', swapTransaction);
                  swapTransaction.estimateGas({ from: userAddress }).then(async gasEstimate => {
                    console.log('gasEstimate:::', gasEstimate);
                    setGasEstimate(gasEstimate + GAS_BUFFER);
                    setRawTxnObj({
                      type: 'token',
                      data: swapTransaction.encodeABI(),
                    });
                    const txnFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
                    setTransactionFee(toFixed(txnFee, 6));
                    setLoadingText(false);
                    // return resolve(gasEstimate);
                  }).catch(err => {
                    console.log('estimateGas====Err', err);
                    setLoadingText(false);
                    if (err.message.includes('insufficient funds') || err.message.includes('execution reverted')) {
                      setInsufficientBalance(true);
                    }
                  });
                } else {
                  {/* *********************************************************** TOKEN To TOKEN ********************************************************************** */ }
                  console.log('TOKEN TO TOKEN ======>>');
                  let swapTransaction;
                  if (parseFloat(amountAMin) < 200000000000000000000 && tokenFirst?.coin_symbol?.toLowerCase() == 'brg' && tokenSecond?.coin_symbol?.toLowerCase() == 'busd') {
                    swapTransaction = await routerContractObject.methods.swapExactTokensForTokens(amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline);
                  } else {
                    swapTransaction = await routerContractObject.methods.swapExactTokensForTokensSupportingFeeOnTransferTokens(amountAMin.toString(), amountBMin.toString(), path, userAddress, deadline);
                  }
                  swapTransaction.estimateGas({ from: userAddress }).then(async gasEstimate => {
                    console.log('gasEstimate=====>>>', gasEstimate);
                    setGasEstimate(gasEstimate + GAS_BUFFER);
                    setRawTxnObj({
                      type: 'token',
                      data: swapTransaction.encodeABI(),
                    });
                    let txnFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
                    setTransactionFee(toFixed(txnFee, 6));
                    setLoadingText(false);
                    // return resolve(gasEstimate);
                  }).catch(err => {
                    console.log('Token_TO_Token==Err', err);
                    setLoadingText(false);
                    if (err.message.includes('insufficient funds') || err.message.includes('execution reverted')) {
                      setInsufficientBalance(true);
                    }
                  });
                }
              }
            }
          } else {
            setLoadingText(false);
            setPairNotExist(true);
          }
        });
      });
    }, 100);
  };
  {
    /* *********************************************************** onPressToggle ********************************************************************** */
  }
  const onPressToggle = (tokenFirst, tokenSecond) => {
    if (!global.isConnected) {
      setAlertTxt(alertMessages.pleaseCheckYourNetworkConnection);
      showAlertDialogNew(true);
      setLoading(false);
      return;
    }
    // props.socketPropsUpdate({ prop: "previousAction", value: null })
    const isTogglePress = true;
    if (tokenSecond?.wallets.length == 0) {
      setAlertTxt(alertMessages.addTokenFromAddCustomToken);
      showAlertDialogNew(true);
      setLoading(false);
      return;
    }
    let temp = tokenFirst;
    setTokenFirst(tokenSecond);
    tokenOne = tokenSecond;
    setTokenSecond(temp);
    setTokenOneAmount('');
    setTokenTwoAmount('')
    setSelectedIndex(null);
    setTransactionFee('0.00');
    setInsufficientBalance(false);
    // onChangeText({
    //   tokenFirst: tokenSecond,
    //   tokenSecond: tokenFirst,
    //   value: tokenOneAmount,
    //   type: inputType.firstInput,
    //   isTogglePress,
    // });
    setToggleSwap(!toggleSwap);
  };

  /******************************************************************************************/
  const onPressSwap = async transactionFee => {
    setLoading(true);
    const fromAmount = tokenFirst?.value != undefined && currencyFormat(tokenFirst?.value * tokenOneAmount, Constants.FIAT_DECIMALS);
    const receivedAmount = tokenSecond?.value != undefined && currencyFormat(tokenSecond?.value * tokenTwoAmount, Constants.FIAT_DECIMALS);
    const percVal = (parseFloat(receivedAmount) / parseFloat(fromAmount)) * 100;
    blockChain = tokenFirst.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
    const userAddress = Singleton.getInstance().defaultEthAddress;
    const diffVal = parseFloat(fromToAmtDiff) > 0 ? fromToAmtDiff : 0;
    console.log('diffVal::::::::::', diffVal);
    getWeb3Object().eth.getGasPrice().then(async gasPrice => {
      // console.log("userBal::::::::::", userBal);
      if (tokenOneAmount == undefined || tokenOneAmount == 0) {
        setAlertTxt(alertMessages.pleaseEnterAmountToSwap);
        showAlertDialogNew(true);
        setLoading(false);
        return;
      }
      if (parseFloat(percVal) < parseFloat(diffVal)) {
        // if receiving amount less than 90% of invested amount
        setAlertTxt(alertMessages.cantSwapThesePair);
        showAlertDialogNew(true);
        setLoading(false);
        return;
      } else if (tokenTwoAmount == undefined || tokenTwoAmount == 0) {
        setAlertTxt(tokenFirst?.coin_name + alertMessages.equivalentAmountTo + tokenSecond?.coin_name + alertMessages.isNotReceived);
        showAlertDialogNew(true);
        setLoading(false);
        return;
      } else if ((tokenFirst?.coin_symbol?.toLowerCase() != 'bnb' && tokenFirst?.coin_symbol?.toLowerCase() != 'eth' && parseFloat(userBal) >= parseFloat(tokenOneAmount)) || parseFloat(userBal) > parseFloat(tokenOneAmount)) {
        if (isApproved) {
          const totalFee = exponentialToDecimal(parseFloat(gasPrice) * parseFloat(gasEstimate) * GAS_FEE_MULTIPLIER);
          // console.log('chk total fee:::::', totalFee);
          const web3Object = getWeb3Object();
          const ethBal_ = await web3Object.eth.getBalance(userAddress);
          const value = ethBal_ / tokenFirst.decimals;
          const ethBal = exponentialToDecimal(value);
          console.log('chk:::::UserBalance====', ethBal);
          const calcAmount = parseFloat(value) - parseFloat(totalFee);
          // console.log("calcAmount====", calcAmount);
          if (calcAmount < 0) {
            setAlertTxt(alertMessages.youDontHaveEnough + `${tokenFirst.coin_family == 1 ? 'BNB' : 'ETH'}` + alertMessages.toPerformTransaction);
            showAlertDialogNew(true);
            setLoading(false);
            return;
          }
          setConfirmTxnModalSwap(true);
          // swap();
        } else {
          const totalFee = (gasPrice * gasEstimate).toFixed(0);
          const web3Object = getWeb3Object();
          const ethBal = await web3Object.eth.getBalance(userAddress);
          if (ethBal - exponentialToDecimal(totalFee) < 0) {
            setAlertTxt(alertMessages.youDontHaveEnough + `${tokenFirst.coin_family == 1 ? 'BNB' : 'ETH'}` + alertMessages.toPerformTransaction);
            showAlertDialogNew(true);
            setLoading(false);
            return;
          }
          setLoading(false);
          setAlertText(alertMessages.youHaveToPay + `${parseFloat(transactionFee).toFixed(6)} ${tokenFirst.coin_family == 1 ? 'BNB' : 'ETH'}` + alertMessages.areYouWillingToGiveApproval);
          setShowApproveModal(true);
        }
      } else {
        setAlertTxt(alertMessages.youDontHaveEnough + `${tokenFirst.coin_family == 1 ? 'BNB' : 'ETH'}` + alertMessages.toPerformTransaction);
        showAlertDialogNew(true);
        setLoading(false);
        return;
      }
    }).catch(err => {
      setLoading(false);
    });
  };

  /******************************************************************************************/
  const getApproval = async () => {
    const blockChain = tokenFirst?.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
    setLoading(true);
    setTimeout(async () => {
      setShowApproveModal(false);
      const approveRes = await approveTransaction(
        allownceTxnObj.tokenContractObject,
        blockChain == 'ethereum' ? routerAddress : routerAddressBnb,
        allownceTxnObj.path,
      );
      // console.log('chk app res::::', approveRes);
      if (approveRes) {
        setTimeout(async () => {
          const contract = await getWeb3Object();
          const txnReceipt = await contract.eth.getTransactionReceipt(approveRes?.tx_hash || approveRes?.transactionHash);
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
            showAlertDialog1(true);
            setLoading(false);
          }
        }, 6000);
      } else {
        setTimeout(async () => {
          const isApproved = await checkContractApproval({ finalPath, finalResult });
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
  const approveTransaction = async (tokenContractObject, spenderAddress, tokenAddress) => {
    return new Promise(async (resolve, reject) => {
      try {
        // console.log('\n\n\n **** APPROVED TRANSACTION ALERT ***** \n\n\n');
        const userAddress = Singleton.getInstance().defaultEthAddress;
        console.log('\n\n\n **** APPROVED TRANSACTION userAddress ***** \n\n\n', userAddress);
        blockChain = tokenFirst.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
        getWeb3Object().eth.getGasPrice().then(async gasPrice => {
          const web3Object = getWeb3Object();
          const approveTrans = await tokenContractObject.methods.approve(spenderAddress, BigNumber(10 ** 25).toFixed(0));
          console.log('approveTrans ===>>>', approveTrans);
          const approveGasLimit = await approveTrans.estimateGas({ from: userAddress });
          // console.log('approveGasLimit ===>>>', approveGasLimit);
          const nonce = await web3Object.eth.getTransactionCount(userAddress);
          console.log('nonce ===>>>approve', nonce);
          console.log('gasPrice ===>>>approve', gasPrice);
          const resultApprove = await makeTransaction(approveTrans.encodeABI(), gasPrice, approveGasLimit + 10000, nonce, '0x0', tokenAddress, true);
          console.log('chk approve Result::::', resultApprove);
          // setLoading(false);
          return resolve(resultApprove);
        }).catch(err => {
          console.log('error in approval ', err);
          setLoading(false);
        });
      } catch (e) {
        console.log('chk approve txn err::::', e);
        return reject(null);
      }
    });
  };

  /******************************************************************************************/
  const swap = async () => {
    setLoading(true);
    setTimeout(() => {
      const userAddress = Singleton.getInstance().defaultEthAddress;
      // console.log('\n\n\n **** SWAP TRANSACTION ALERT ***** \n\n\n');
      blockChain = tokenFirst?.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
      // console.log("rawTxnObj.value====>>>", rawTxnObj.value);
      getWeb3Object().eth.getGasPrice().then(async gasPrice => {
        const web3Object = getWeb3Object();
        const nonce = await web3Object.eth.getTransactionCount(userAddress);
        console.log('chk gasEstimate::::::', gasEstimate);
        const token1CoinSymbol = tokenFirst?.coin_symbol?.toLowerCase();
        const token1CoinName = tokenFirst?.coin_name?.toLowerCase();
        const token2CoinSymbol = tokenSecond?.coin_symbol?.toLowerCase();
        const token2CoinName = tokenSecond?.coin_name?.toLowerCase();
        let toAddress = ''
        if (((token1CoinSymbol == 'eth' && token1CoinName == 'ethereum') && (token2CoinSymbol == 'weth' && token2CoinName == 'wrapped ether')) || ((token1CoinSymbol == 'bnb' && token1CoinName == 'bnb smart chain') && (token2CoinSymbol == 'wbnb' && token2CoinName == 'wrapped bnb'))) {
          toAddress = token1CoinSymbol == 'eth' ? WETH : WBNB
        } else if (((token1CoinSymbol == 'weth' && token1CoinName == 'wrapped ether') && (token2CoinSymbol == 'eth' && token2CoinName == 'ethereum')) || ((token1CoinSymbol == 'wbnb' && token1CoinName == 'wrapped bnb') && (token2CoinSymbol == 'bnb' && token2CoinName == 'bnb smart chain'))) {
          toAddress = token1CoinSymbol == 'weth' ? WETH : WBNB
        } else {
          toAddress = blockChain == 'ethereum' ? routerAddress : routerAddressBnb
        }
        const result = await makeTransaction(
          rawTxnObj.data,
          gasPrice,
          gasEstimate,
          nonce,
          rawTxnObj.type != 'token' ? rawTxnObj.value : '0x0',
          toAddress,
          false,
        );

        console.log('--------------result---------------', result);
        setRawTxnObj({});
        getUserBal(tokenFirst);
        setLoading(false);
        if (result) {
          setShowSucess(true);
          setAlertTxt(result?.message);
          showAlertDialog1(true);
        }
        return result;
      }).catch(err => {
        console.log('error swap', err);
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
  ) => {
    setLoading(true);
    const pvtKey = await getData(`${Singleton.getInstance().defaultEthAddress}_pk`);
    const from = Singleton.getInstance().defaultEthAddress;
    return new Promise(async (resolve, reject) => {
      // console.log('chk pvt key::::::::', pvtKey);
      console.log('chk value ::::::::', value);
      const web3Object = getWeb3Object();

      const rawTransaction = {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
        to: to,
        value: value,
        data: transactionData,
        nonce: nonce,
        from: from,
        chainId: tokenFirst?.coin_family == 1 ? Constants.network == 'testnet' ? 97 : 56 : Constants.network == 'testnet' ? 5 : 1,
      };

      console.log('rawTransaction =>', rawTransaction);
      console.log('fromApproval =>', fromApproval);
      const txn = await web3Object.eth.accounts.signTransaction(rawTransaction, pvtKey);
      // console.log('chk signtxn:::::', txn);

      const sendCoinReq = {
        nonce: nonce,
        tx_raw: txn.rawTransaction.slice(2),
        from: from,
        to: to,
        amount: tokenOneAmount,
        gas_estimate: gasLimit,
        gas_price: gasPrice,
        tx_type: fromApproval == true ? 'Approve' : 'Swap',
        approval: fromApproval == true ? 1 : 0,
      };
      const access_token = await getData(Constants.ACCESS_TOKEN);
      //  console.log('sendCoinReq::::::', sendCoinReq);
      const symbol = tokenFirst?.token_address != null ? tokenFirst?.token_address : tokenFirst?.coin_symbol?.toLowerCase();
      const blockChainSymbol = tokenFirst?.coin_family == 1 ? 'binancesmartchain' : 'ethereum';
      await dispatch(requestSendCoin({ url: `${blockChainSymbol}/${symbol}/send`, sendCoinReq, token: access_token })).then(res => {
        fromApproval == true ? setLoading(true) : setLoading(false);
        return resolve(res);
      }).catch(err => {
        console.log('chk err:::::data', err);
        setLoading(false);
        setAlertTxt(err);
        showAlertDialogNew(true);
        return reject(null);
      });
    });
  };

  /******************************************************************************************/
  const onChangeNumber = value => {
    if (value.includes(',')) value = value.replace(',', '.');
    if (value == '.') value = '0.';
    if (/^\d*\.?\d*$/.test(value)) {
      if (value.includes('.') && value.split('.')[1].length > 18) {
        return;
      } else {
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
    tokenSecond && setNonExistingCoinModal(true);
    setSearch('');
    tokenSecond && setNonExistingCoinList(coinList.filter(item => item.coin_family == tokenFirst?.coin_family));
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
      setSearch('');
      tokenFirst && setExistingCoinList(coinList.filter(item => item.wallets?.length > 0));
    }
  };

  /******************************************************************************************/
  const onPressItem = (item, index) => {
    var amount = 0;
    setSelectedIndex(index);
    const balance = tokenFirst?.wallets[0].balance;
    const totalFee = gasEstimate * gasPrice * GAS_FEE_MULTIPLIER;
    console.log('total fee %>>>>>>>', totalFee);
    setSelectedInput(inputType.firstInput);
    if (index == 0) {
      amount = tokenFirst?.is_token == 1 ? toFixedExp(0.25 * parseFloat(balance), 8).toString() : toFixedExp(0.15 * parseFloat(balance), 8).toString();
    } else if (index == 1) {
      amount = tokenFirst?.is_token == 1 ? toFixedExp(0.5 * parseFloat(balance), 8).toString() : toFixedExp(0.4 * parseFloat(balance), 8).toString();
    } else if (index == 2) {
      amount = tokenFirst?.is_token == 1 ? toFixedExp(0.75 * parseFloat(balance), 8).toString() : toFixedExp(0.65 * parseFloat(balance), 8).toString();
    } else if (index == 3) {
      if (tokenFirst?.is_token == 1) {
        amount = toFixedExp(balance, 8).toString();
      } else {
        if (balance > totalFee) {
          amount = toFixedExp((balance * 0.9 - totalFee).toString(), 8).toString();
        } else {
          amount = toFixedExp(balance, 8).toString();
        }
      }
    }
    setTokenOneAmount(amount);
    setToggleSwap(false);
    if (amount?.length == 0 || amount == 0 || amount == '.' || amount?.trim() == '' || amount.includes('-') || parseFloat(amount) <= 0) {
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
    Singleton.bottomBar?.navigateTab('WalletMain');
    Actions.jump('WalletMain');
  };

  /******************************************************************************************/
  if (!props?.isVisible) {
    return <View />;
  }

  /******************************************************************************************/
  return (
    <View style={styles.ViewStyle}>
      <ScrollView
        ref={scrollRef}
        bounces={false}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}>
        <View style={styles.ViewStyle1}>
          <SelectCurrencyNew
            item={tokenFirst}
            tokenOneAmount={exponentialToDecimal(tokenOneAmount)}
            maxLength={10}
            label=""
            placeholder="0.0000"
            custStyle={{ textAlign: 'right' }}
            onPressCoin={() => onPressCoinFirst()}
            value={tokenOneAmount}
            keyboardType={'numeric'}
            onChangeNumber={value => {
              onChangeNumber(value);
            }}
          />

          {/* <---------------------------------------------------------------------------------------------------------------------------------> */}
          <TouchableOpacity
            onPress={() => { onPressToggle(tokenFirst, tokenSecond) }}
            style={[styles.ViewStyle2, { borderWidth: props?.themeSelected == 1 ? 0 : 1, borderColor: ThemeManager.colors.borderColor }]}>
            <Image source={ThemeManager.ImageIcons.toggle} style={[styles.imgstyle]} />
          </TouchableOpacity>
          {/* <---------------------------------------------------------------------------------------------------------------------------------> */}

          <SelectCurrencyNew
            inputandselectStyle={{ marginTop: 12 }}
            styleImg={{ height: 28, width: 28 }}
            item={tokenSecond}
            placeholder="---"
            editable={false}
            custStyle={{ textAlign: 'right' }}
            onPressCoin={() => onPressCoin()}
            value={tokenTwoAmount}
            tokenOneAmount={exponentialToDecimal(tokenTwoAmount)}
            keyboardType={'numeric'}
          />
        </View>

        {/* <---------------------------------------------------------------------------------------------------------------------------------> */}
        <Text
          allowFontScaling={false}
          style={[styles.textStyle, { color: ThemeManager.colors.lightGrayTextColor }]}>
          {sendTrx.transactionFee}:
          <Text
            allowFontScaling={false}
            style={{
              color: ThemeManager.colors.pasteInput,
              fontSize: 12,
              fontFamily: Fonts.dmRegular,
            }}>
            {' '}
            {transactionFee}
            {tokenFirst?.coin_family == 1 ? ' BNB' : ' ETH'}{' '}
          </Text>
        </Text>
        {/* <-------------------------------------percentage work start here--------------------------------------------------------------------------------------------> */}

        {/* <View style={{ justifyContent: 'space-between', marginTop: 15 }}>
          <View style={styles.sliderView}>
            {tabData.map((item, index) => (
              <TouchableOpacity
                key={index + ''}
                onPress={async () => onPressItem(item, index)}
                style={[styles.tabsView, { backgroundColor: selectedIndex == index ? ThemeManager.colors.activeTab : ThemeManager.colors.Mainbg, borderColor: ThemeManager.colors.borderColor }]}>
                <Text
                  allowFontScaling={false}
                  style={{ color: selectedIndex == index ? ThemeManager.colors.Mainbg : ThemeManager.colors.inActiveTabText, fontSize: 16, fontFamily: Fonts.dmMedium }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View> */}

        {/* *********************************************************** MODAL FOR EXISTING COINS ********************************************************************** */}
        <ModalCoinList
          showSearch={true}
          openModel={ExistingCoinModal}
          handleBack={() => {
            setExistingCoinModal(false);
            setSearch('');
          }}
          list={ExistingCoinList}
          onPress={item => {
            onPressExistList(item);
          }}
          pressClear={() => existingCoinList('')}
          onChangeNumber={text => existingCoinList(text)}
          search={search}
          fromSearch={fromSearch}
        />

        {/* *********************************************************** MODAL FOR NON-EXISTING COINS ********************************************************************** */}
        <ModalCoinList
          showSearch={true}
          openModel={NonExistingCoinModal}
          handleBack={() => {
            setNonExistingCoinModal(false);
            setSearch('');
          }}
          list={NonExistingCoinList}
          onPress={item => {
            onPressNonExistList(item);
          }}
          pressClear={() => nonExistingCoinList('')}
          onChangeNumber={text => nonExistingCoinList(text)}
          search={search}
          fromSearch={fromSearch}
        />
      </ScrollView>

      <View style={styles.btnView}>
        <Button
          buttontext={isInsufficientBalance ? alertMessages.insufficientBalance : PairNotExist ? swapText.pairNotSupported : isApproved ? swapText.swap : swapText.approval}
          restoreStyle={{ color: ThemeManager.colors.whiteText }}
          themeSelected={props?.themeSelected}
          onPress={async () => {
            if (!isLoading || !isLoadingText) {
              onPressSwap(transactionFee);
            }
          }}
          disabled={isInsufficientBalance || PairNotExist || !tokenFirst}
        />
      </View>
      {AlertDialogNew && (
        <AppAlert
          showSuccess={showSuccess}
          alertTxt={alertTxt}
          hideAlertDialog={() => {
            showAlertDialogNew(false);
            setShowSucess(false);
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
          handleBack={() => {
            setLoading(false);
            setConfirmTxnModalApprove(false);
          }}
          text={swapText.approve}
          onPress={() => {
            setConfirmTxnModalApprove(false);
            getApproval();
          }}
          nativePrice={toFixedExp(
            parseFloat(transactionFee) * parseFloat(nativePrice),
            2,
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
          handleBack={() => {
            setLoading(false);
            setConfirmTxnModalSwap(false);
          }}
          text={swapText.swap}
          onPress={() => {
            setConfirmTxnModalSwap(false);
            swap();
          }}
          nativePrice={toFixedExp(parseFloat(transactionFee) * parseFloat(nativePrice), 2)}
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
    </View>
  );
};
export default memo(OnChainSwapNew);
