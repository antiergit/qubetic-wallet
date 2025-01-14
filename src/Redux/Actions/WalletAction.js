import { GET_COIN_LIST, GET_COIN_LIST_SUCCESS, GET_COIN_LIST_FAIL, THEME_STORE } from './types';
import { APIClient } from '../../components/Api';
import { GET_COIN_LIST_API, UPDATE_COIN_LIST_API, API_MANAGE_WALLET, TOOGLE_COIN_LIST, ACTIVE_INACTIVE_COIN, API_CURRENCY, API_NOTIFICATIONS_LIST, API_SWFT_COININFO, API_REFRESHTOKEN, COIN_DETAIL, ON_CHAIN_SWAP_LIST, GET_SWAP_AMOUNT_DIFF_URL, NATIVE_PRICE, API_LOGOUT, API_GET_RPC_URL, DOWNLOAD_CSV, API_SWFT_ACCOUNT_EXCHANGE, FIAT_VAL, SWFT_LIST, UPDATE_CRYPTO_BALANCE, GET_FEE_LIMIT, BASE_IMAGE_URL, API_ANNOUNCEMENTS, API_ANNOUNCEMENTS_STATUS, NATIVE_PRICE_ALERT, INCH_GET_QUOTE, INCH_CHECK_ALLOWANCE, INCH_SWAP, INCH_TOKENLIST, INCH_COMMISSION_DATA, API_GET_MATACHA_PRICE, GET_DAPP_LIST, API_GASLESS_SWAP_LIST, API_MAKER_SEND_TRANSAC, API_MAKER_DETAILS_UPDATE, API_CHANGELLY_COIN_LIST, API_CHANGELLY_MIN_AMOUNT, API_CHANGELLY_CREATE_TRANSACTION, CHANGELLY_ONOFFRAMP, CHANGELLY_GET_OFFER, CHANGELLY_ONOFF_CREATE_ORDER, API_ALL_WALLET_BALANCE, API_MAKER_APPROVAL_REQUEST, INCH_SPENDER, API_SAVE_SOL_TRANSACTION_ID, COIN_DETAILS, GET_REALTIME_BAL, GET_CROSS_CHAIN_LIST, API_SWFT_GET_COINLIST, API_SWFT_LAST_PAIRS, GET_NFT_LIST, SAVE_MERCURYO_TRANSACTION } from '../../../src/EndPoint';
import * as Constants from '../../Constants';
import { getData, saveData, toFixedExp } from '../../Utils/MethodsUtils';
import Singleton from '../../Singleton';


/************************************** themeAction ****************************************************/

export const themeAction = ({ prop, value }) => {
  return {
    type: THEME_STORE,
    payload: { prop, value },
  };
};
/************************************** get coin list Api request ****************************************************/
export const requestCoinList = ({ data1 }) => dispatch => {
  return new Promise((resolve, reject) => {
    // console.log('data1:::::', data1);
    dispatch({ type: GET_COIN_LIST });
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      getData(Constants.SELECTED_CURRENCY).then(symbol => {
        getData(Constants.ADDRESS_LIST).then(addrs_list => {
          getData(Constants.COIN_FAMILY_LIST).then(coin_family_list => {
            const addressListKeys = JSON.parse(addrs_list);
            const CoinFamilyKeys = JSON.parse(coin_family_list);
            const data = {
              coin_family: CoinFamilyKeys,
              addressListKeys: addressListKeys,
              page: data1 ? data1.page : 1,
              limit: data1 ? data1.limit : 100,
              search: data1 ? data1.search : '',
              fiat_type: symbol ? symbol : 'USD',
            };
            console.log(">>>>>", data);

            APIClient.getInstance().post(GET_COIN_LIST_API, data, access_token).then(response => {
              let coinArray = response.data;
              console.log('chk res.dataa:::::::', response.data);
              let isSorted;
              let haveBalance;
              if (coinArray.length > 0) {
                coinArray.map((item, index) => {
                  const Item = item.coin;
                  const value = Item?.fiat_price_data == null ? '0.00' : Item?.fiat_price_data.value

                  const fiatAmt = value < 0.0000001 ? toFixedExp(value, 12) : value < 0.000001 ? toFixedExp(value, 8) : value < 0.001 ? toFixedExp(value, 6) : value < 0.01 ? toFixedExp(value, 4) : toFixedExp(value, 2)
                  const fiatPrice = fiatAmt
                  item['fiatBal'] = toFixedExp(item.balance, 8) * fiatPrice;
                  item['selectedCurrencySymbol'] = symbol ? symbol : 'USD';
                  item['currentPriceInMarket'] = fiatPrice;
                  item['price_change_percentage_24h'] = Item?.fiat_price_data == null ? 0.00 : Item?.fiat_price_data.price_change_percentage_24h;
                  item['coin_family'] = Item?.coin_family
                  item['coin_image'] = (Item?.coin_image == null || Item?.coin_image == '') ? Item?.coin_image : (Item.coin_image?.includes('https') || Item?.coin_image?.includes('http')) ? Item?.coin_image : BASE_IMAGE_URL + Item?.coin_image
                  item['coin_name'] = Item?.coin_name
                  item['coin_symbol'] = Item?.coin_symbol
                  item['decimals'] = Item?.decimals
                  item['is_token'] = Item?.is_token
                  item['token_address'] = Item?.token_address
                  item['coin_id'] = Item?.coin_id
                  item['graphData'] = (Item?.fiat_price_graph_data == null || !Array.isArray(Item?.fiat_price_graph_data?.sparkline) || Item?.fiat_price_graph_data?.sparkline?.length < 5) ? [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] : Item?.fiat_price_graph_data?.sparkline.map(ele => parseFloat(toFixedExp(ele.price, 8)));
                })
              }
              isSorted = coinArray.find((item, index) => item.sort_order != null)
              haveBalance = coinArray.find((item, index) => item.fiatBal > 0)
              if (isSorted == undefined && haveBalance == !undefined) {
                coinArray = coinArray.sort((a, b) => b.fiatBal - a.fiatBal)
              } else if (isSorted == undefined && haveBalance == undefined) {
                coinArray = coinArray.sort((a, b) => a.coin.coin_name.localeCompare(b.coin.coin_name))
              } else if (isSorted == !undefined) {
                coinArray = coinArray.sort((a, b) => a.sort_order - b.sort_order)
              }
              response.data = coinArray
              let newArray = []
              coinArray.map(data => {
                // if (data.coin_family != 3) {
                newArray.push(data)
                // }
              });
              console.log('chk response new::::::', newArray);
              saveData(Constants.MY_COIN_LIST, JSON.stringify(newArray));
              getCoinListSuccess(dispatch, newArray);
              resolve(data1 ? response : newArray);
              // resolve(data1 ? newArray : newArray);
            }).catch(error => {
              let errorMessage = error.message;
              console.log('my wallet api failed::::::', error);
              getCoinListFail(dispatch, errorMessage);
              reject(errorMessage);
            });
          });
        });
      });
    });
  });
};
// ************************************** Toogle coin list Api request ****************************************************/
export const toogleCoinList = ({ dataObj }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.SELECTED_CURRENCY).then(currency => {
      getData(Constants.ACCESS_TOKEN).then(access_token => {
        getData(Constants.ADDRESS_LIST).then(addrs_list => {
          getData(Constants.COIN_FAMILY_LIST).then(coinFamilyList => {
            let addressListKeys = JSON.parse(addrs_list);

            let data = {
              addrsListKeys: addressListKeys,
              coinFamilyKeys: JSON.parse(coinFamilyList),
              page: dataObj.page,
              limit: dataObj.limit,
              currency_code: currency.toLowerCase(),
              search: dataObj.search,
            };
            APIClient.getInstance().post(TOOGLE_COIN_LIST, data, access_token).then(response => {
              if (response.data.length > 0) {
                response.data.map((item, index) => {
                  item.walletStatus = item.wallet_data == null ? 0 : item.wallet_data.status
                })
              }
              resolve(response);
            }).catch(error => {
              let errorMessage = error.message;
              console.log('ERROR===>', error);

              reject(errorMessage);
            });
          });
        });
      });
    });
  });
};
// ************************************** active inactive Api request ****************************************************/
export const activeInactiveCoin = ({ token, coinId, walletAddress, isActive }) => dispatch => {
  return new Promise((resolve, reject) => {
    let data = {
      coinId: coinId,
      walletAddress: walletAddress,
      isActive: isActive,
    };
    // console.log('-=-=datadatadatadatadatadata=-=-=-=-', data);
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(ACTIVE_INACTIVE_COIN, data, access_token).then(response => {
        // console.log('-=-----ACTION-----activeInactiveCoin-=-=-', response);
        resolve(response);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('error catch==>', error);
        reject(errorMessage);
      });
    });
  });
};
/**************************************get ON_CHAIN_SWAP_COIN_LIST ****************************************************/
export const onChainSwapList = ({ ACCESS_TOKEN, addrsListKeys, coin_family }) => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      const data = {
        addrsListKeys: addrsListKeys,
        coin_family: coin_family,
        fiat_type: Singleton.getInstance().CurrencySelected
      };
      APIClient.getInstance().post(ON_CHAIN_SWAP_LIST, data, ACCESS_TOKEN).then(response => {
        const result = response.data;
        // console.log('API_onChainSwapList--- ', result);
        saveData(Constants.ONCHAIN_LIST, JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        console.log('error onChainSwapList-- ', error);
        reject(error);
      });
    });
  };
};
/**************************************GET SWAP PRICE DIFFERENCES ****************************************************/
export const getSwapPriceDiff = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      getData(Constants.ACCESS_TOKEN).then(access_token => {
        APIClient.getInstance().get(GET_SWAP_AMOUNT_DIFF_URL, access_token).then(response => {
          //console.log("response getSwapPriceDiff--", response)
          resolve(response?.data);
        }).catch(error => {
          console.log('error getSwapPriceDiff--', error);
          reject(error);
        });
      });
    });
  };
};
/************************************** UpdateCoinList ****************************************************/
export const updateCoinList = ({ token }) => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: GET_COIN_LIST });
    APIClient.getInstance().post(UPDATE_COIN_LIST_API, {}, token).then(response => {
      let res = response.data;
      // console.log('res', res);
      resolve(res);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('updateCoinList', error);
      reject(errorMessage);
    });
  });
};
/************************************** logoutUser ****************************************************/
export const logoutUser = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_LOGOUT, data, token).then(response => {
        let res = response.data;
        //console.log('res', res);
        resolve(res);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('logoutUser', error);
        reject(errorMessage);
      });
    });
  });
};

/************************************** logoutUser ****************************************************/
export const logoutSingleUser = ({ data, accessToken }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_LOGOUT, data, accessToken).then(response => {
        let res = response.data;
        //console.log('res', res);
        resolve(res);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('logoutUser', error);
        reject(errorMessage);
      });
    });
  });
};
/************************************** getFeeLimit ****************************************************/
export const getFeeLimit = ({ }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(GET_FEE_LIMIT, null, token).then(response => {
        const res = response.fee;
        console.log('res getFeeLimit:::::', res);
        resolve(res);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('getFeeLimit failed', error);
        reject(errorMessage);
      });
    });
  });
};
/************************************** update balance ****************************************************/
export const Updatebalance = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(COIN_DETAILS, data, token).then(response => {
        let res = response.data;
        // console.log('res Updatebalance:::::', res);
        resolve(res);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('Updatebalance api failed', error);
        reject(errorMessage);
      });
    });
  });
};
export const getUserBalance = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(GET_REALTIME_BAL, data, token).then(response => {
        let res = response.data;
        // console.log('res Updatebalance:::::', res);
        resolve(res);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('Updatebalance api failed', error);
        reject(errorMessage);
      });
    });
  });
};
// ************************************** swap coin info ****************************************************/
export const getSwapCoinInfo = ({ depositCoinCode, receiveCoinCode }) => dispatch => {
  return new Promise((resolve, reject) => {
    let data = {
      depositCoinCode: depositCoinCode,
      receiveCoinCode: receiveCoinCode,
    };

    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance().post(API_SWFT_COININFO, data, token).then(response => {
        resolve(response.data);
      }).catch(error => {
        console.log('API_SWFT_COININFO errorrrr', error);

        let errorMessage = error.message;
        reject(errorMessage);
      });
    });
  })
};

// ************************************** ACCOUNT EXCHANGE ****************************************************/
export const accountExchange = ({ depositCoinCode, receiveCoinCode, depositCoinAmt, receiveCoinAmt, destinationAddr, refundAddr }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {

      let data = {
        depositCoinCode: depositCoinCode,
        receiveCoinCode: receiveCoinCode,
        depositCoinAmt: parseFloat(depositCoinAmt),
        receiveCoinAmt: parseFloat(receiveCoinAmt),
        destinationAddr: destinationAddr,
        refundAddr: refundAddr,
        equipmentNo: '123456568',
        sourceType: 'iOS',
      };
      APIClient.getInstance().post(API_SWFT_ACCOUNT_EXCHANGE, data, token).then(response => {
        resolve(response.data);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('API_SWFT_ACCOUNT_EXCHANGE errorrrr');
        reject(errorMessage);
      });
    });
  });
};
// ************************************** sortManageWallet ****************************************************/
export const sortManageWallet = ({ token, data }) => dispatch => {
  return new Promise((resolve, reject) => {
    let dataObj = {
      wallets: data,
    };
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_MANAGE_WALLET, dataObj, token).then(response => {
        resolve(response);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('sortManageWallet api failed');
        reject(errorMessage);
      });
    });
  });
};

// ************************************** getNotificationList ****************************************************/
export const getNotificationList = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      getData(Constants.COIN_FAMILY_LIST).then(coinfamilyList => {
        const coin_families = JSON.parse(coinfamilyList);
        data.coin_family = coin_families
        APIClient.getInstance().post(API_NOTIFICATIONS_LIST, data, access_token).then(response => {
          // console.log('getNotificationList res::::::', response);
          resolve(response);
        }).catch(error => {
          let errorMessage = error.message;
          console.log('API_NOTIFICATIONS_LIST api failed');
          reject(errorMessage);
        });
      });
    });
  });
};

// ************************************** adminAnnouncements ****************************************************/
export const getAdminAnnouncements = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(API_ANNOUNCEMENTS, data, access_token).then(response => {
        console.log('getAdminAnnouncements res::::::', response);
        resolve(response);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('getAdminAnnouncements api failed');
        reject(errorMessage);
      });
    });
  });
};

// ************************************** adminAnnouncements ****************************************************/
export const getNotiStatus = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      getData(Constants.ADDRESS_LIST).then(addrs_list => {
        const addressListKeys = JSON.parse(addrs_list);
        data.addrsListKeys = addressListKeys
        APIClient.getInstance().post(API_ANNOUNCEMENTS_STATUS, data, access_token).then(response => {
          console.log('getNotiStatus res::::::', response);
          resolve(response);
        }).catch(error => {
          let errorMessage = error.message;
          console.log('getNotiStatus api failed :::::');
          reject(errorMessage);
        });
      })
    });
  });
};
/**************************************get Currency Api****************************************** */
export const getCurrencyPref = () => dispatch => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance().get(API_CURRENCY, '').then(response => {
      let res = response.data;
      resolve(res);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('getCurrencyPref api failed');
      reject(errorMessage);
    });
  });
};
/**************************************get fiatValue Api****************************************** */
export const getFiatValue = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(FIAT_VAL, data, token).then(res => {
        let response = res.price;
        resolve(response);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('getFiatValue api failed');
        reject(errorMessage);
      });
    });
  });
};

// ************************************** refresh token ****************************************************/
export const refreshToken = ({ token, refreshToken }) => dispatch => {
  return new Promise((resolve, reject) => {
    let data = {
      token: token,
      refreshToken: refreshToken,
    };
    APIClient.getInstance().post(API_REFRESHTOKEN, data, '').then(response => {
      // console.log('-=-----API_refreshToken-', response);
      resolve(response);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('refreshToken errorrrr');
      reject(errorMessage);
    });
  });
};
//************************************* coin Detail ********************************************** */
export const coinDetail = data => dispatch => {
  return new Promise((resolve, reject) => {
    console.log('-=-=coinDetail=-=-=-=-');
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(COIN_DETAIL, data, token).then(response => {
        // console.log('-=-----API_COIN_DETAIL-');
        resolve(response.data);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('COIN_DETAIL errorrrr');
        reject(errorMessage);
      });
    });
  });
};
// ************************************** fetchNativePrice Api request ****************************************************/
export const fetchNativePrice = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(NATIVE_PRICE, data, access_token).then(response => {
        resolve(response.data);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('ERROR===>', error);
        reject(errorMessage);
      });
    });
  });
};
// ************************************** fetchNativeCoinPrice Api request ****************************************************/
export const fetchNative_CoinPrice = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(NATIVE_PRICE_ALERT, data, access_token).then(response => {
        console.log('fetchNativeCoinPrice res===>', response);
        resolve(response);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('fetchNativeCoinPrice err===>', error);
        reject(errorMessage);
      });
    });
  });
};
// ************************************** downloadcsv Api request ****************************************************/
export const downloadcsv = ({ }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.USER_ID).then(userId => {
      APIClient.getInstance().get(`${DOWNLOAD_CSV}${parseInt(userId)}`, '').then(response => {
        resolve(response);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('ERROR===>', error);
        reject(errorMessage);
      });
    });
  });
};
// ************************************** rpc Api request ****************************************************/
export const getRpcUrl = ({ }) => dispatch => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance().get(API_GET_RPC_URL, '').then(response => {
      console.log('chk rpc url res::::', response);
      Singleton.getInstance().ETH_RPC_URL = response.ETH_RPC_URL
      Singleton.getInstance().BTC_RPC_URL = response.BTC_RPC_URL
      Singleton.getInstance().BSC_RPC_URL = response.BNB_RPC_URL
      Singleton.getInstance().SOL_RPC_URL = response.SOL_RPC_URL
      Singleton.getInstance().MATIC_RPC_URL = response.POL_RPC_URL
      Singleton.getInstance().ETH_DAPP_RPC_URL = response.ETH_DAPP_RPC_URL
      resolve(response);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('ERROR===>', error);
      reject(errorMessage);
    });
  });
};
/************************************* Success/Fail Dispatches ***************************************************/
const getCoinListFail = (dispatch, errorMessage) => {
  dispatch({
    type: GET_COIN_LIST_FAIL,
    payload: errorMessage,
  });
};

const getCoinListSuccess = (dispatch, data) => {
  dispatch({
    type: GET_COIN_LIST_SUCCESS,
    payload: data,
  });
};




// ************************************** 1Inch apis ****************************************************/
// ************************************** get commision data****************************************************/
export const getCommissionData = () => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().get(INCH_COMMISSION_DATA, token).then(response => {
        let res = response;
        console.log('INCH_COMMISSION_DATA::::::successs******', res);
        resolve(res);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('INCH_COMMISSION_DATA failed:::::::::::', error);
        reject(errorMessage);
      });
    });
  });
};
// ************************************** get inch token list ****************************************************/
export const getInchTokenList = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(INCH_TOKENLIST, data, access_token).then(response => {
        console.log('INCH_TOKENLIST res===>', response);
        resolve(response);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('INCH_TOKENLIST err===>', error);
        reject(errorMessage);
      });
    });
  });
};

// ************************************** get quote ****************************************************/
export const getInchQuote = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(INCH_GET_QUOTE, data, access_token).then(response => {
        console.log('INCH_GET_QUOTE res===>', response);
        resolve(response?.data);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('INCH_GET_QUOTE err===>', error);
        reject(errorMessage);
      });
    });
  });
};

// ************************************** check allowance ****************************************************/
export const checkInchAllowance = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(INCH_CHECK_ALLOWANCE, data, access_token).then(response => {
        console.log('INCH_CHECK_ALLOWANCE res===>', response);
        resolve(response?.data);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('INCH_CHECK_ALLOWANCE err===>', error);
        reject(errorMessage);
      });
    });
  });
};
// ************************************** swap spender ****************************************************/
export const inchSwapSpender = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(INCH_SPENDER, data, access_token).then(response => {
        console.log('inchSwapSpender res===>', response);
        resolve(response?.data);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('inchSwapSpender err===>', error);
        reject(errorMessage);
      });
    });
  });
};
// ************************************** swap from 1inch ****************************************************/
export const inchSwap = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(access_token => {
      APIClient.getInstance().post(INCH_SWAP, data, access_token).then(response => {
        console.log('INCH_SWAP res===>', response);
        resolve(response?.data);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('INCH_SWAP err===>', error);
        reject(errorMessage);
      });
    });
  });
};


/**************************************GET SWAP PRICE DIFFERENCES ****************************************************/
export const getDaapList = () => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      getData(Constants.ACCESS_TOKEN).then(access_token => {
        APIClient.getInstance().get(GET_DAPP_LIST, access_token).then(response => {
          console.log("response  dappp list>>>>>", response)
          resolve(response);
        }).catch(error => {
          console.log('error dappp list>>>>>', error);
          reject(error);
        });
      });
    });
  };
};
/*************************************Send Coin APi*********************************************** */
export const requestSendHash = ({ url, sendCoinReq }) => dispatch => {
  console.log("sendCoinReq::::: ", sendCoinReq)
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(url, sendCoinReq, token).then(response => {
        let result = response;
        console.log('Send HASH Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('Send HASH Error ****', error);
        reject(errorMessage);
      });
    });
  });
};

export const sendMakerTransaction = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(API_MAKER_SEND_TRANSAC, data, token)
        .then((response) => {
          console.log("sendMakerTransaction Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("sendMakerTransaction Error ****");
          reject(error);
        });
    });
  });
};
export const sendMakerApprovalRequest = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(API_MAKER_APPROVAL_REQUEST, data, token)
        .then((response) => {
          console.log("sendMakerTransaction Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("sendMakerTransaction Error ****");
          reject(error);
        });
    });
  });
};

export const updateMakerDetails = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(API_MAKER_DETAILS_UPDATE, data, token)
        .then((response) => {
          console.log("updateMakerDetails Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("updateMakerDetails Error ****");
          reject(error);
        });
    });
  });
};

/**************************************get CROSS_CHAIN_SWAP_COIN_LIST ****************************************************/
export const getCrossChainLastPair = (data) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance().post(API_SWFT_LAST_PAIRS, data, token).then(response => {
        const result = response?.data;
        resolve(result);
      }).catch(error => {
        console.log('error getCoinListChangelly-- ', error);
        reject(error);
      });
    });
  });
};
/**************************************get CROSS_CHAIN_SWAP_COIN_LIST ****************************************************/
export const getCrossChainCoinList = (data) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance().post(API_SWFT_GET_COINLIST, data, token).then(response => {
        const result = response;
        resolve(result);
      }).catch(error => {
        console.log('error getCoinListChangelly-- ', error);
        reject(error);
      });
    });
  });
};

/**************************************get CROSS_CHAIN_SWAP_MIN_AMOUNT ****************************************************/
export const getCoinMinAmnt = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance().post(API_CHANGELLY_MIN_AMOUNT, data, token).then(response => {
        console.log('getCoinMinAmnt--- ', JSON.stringify(response));
        resolve(response);
      }).catch(error => {
        console.log('error getCoinMinAmnt-- ', error);
        reject(error);
      });
    });
  });
};

/**************************************get CROSS_CHAIN_SWAP_CREATE_TRANSACTION ****************************************************/
export const createChangellyTransaction = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance().post(API_CHANGELLY_CREATE_TRANSACTION, data, token).then(response => {
        console.log('createChangellyTransaction--- ', JSON.stringify(response));
        resolve(response);
      }).catch(error => {
        console.log('error createChangellyTransaction-- ', error);
        reject(error);
      });
    });
  });
};

export const getOnOffRampCoins = () => dispatch => {
  return new Promise((resolve, reject) => {
    fetch("https://api.mercuryo.io/v1.6/lib/currencies")
      .then(async res => {
        let jsonVal = await res.json();

        resolve(jsonVal)
      })
      .catch(err => {
        console.log("ERR>>>", err);
        if (err == "The Internet connection appears to be offline.") {
          return reject({ message: Constants.NO_NETWORK });
        } else {
          return reject(err);
        }
      })
  })
}
export const getMinMaxOnOffRamp = (from, to, type) => dispatch => {
  return new Promise((resolve, reject) => {
    fetch(`https://api.mercuryo.io/v1.6/public/currency-limits?from=${from}&to=${to}&widget_id=${Constants.MERCURYO_WIDGET_ID}&type=${type}`)
      .then(async res => {
        let jsonVal = await res.json();
        resolve(jsonVal)
      })
      .catch(err => {
        console.log("ERR>>>", err);
        if (err == "The Internet connection appears to be offline.") {
          return reject({ message: Constants.NO_NETWORK });
        } else {
          return reject(err);
        }
      })
  })
}

export const getBuySellQuoteRamp = (type, from, to, amount, network) => dispatch => {
  return new Promise((resolve, reject) => {
    const url = `https://api.mercuryo.io/v1.6/widget/${type}/rate?from=${from}&to=${to}&amount=${amount}&network=${network}&widget_id=${Constants.MERCURYO_WIDGET_ID}&is_total=true`
    console.log("url>>>", url);

    fetch(url)
      .then(async res => {
        let jsonVal = await res.json();
        resolve(jsonVal)
      })
      .catch(err => {
        console.log("ERR>>>", err);
        if (err == "The Internet connection appears to be offline.") {
          return reject({ message: Constants.NO_NETWORK });
        } else {
          return reject(err);
        }
      })
  })
}

export const onOffRampDetails = () => {
  return new Promise((resolve, reject) => {
    getData(Constants.ADDRESS_LIST).then(async addrs_list => {
      const coinFamilies = await getData(Constants.COIN_FAMILY_LIST)
      console.log("coinFamilies>>>>>", coinFamilies);

      let data = {
        fiatType: Singleton.getInstance().CurrencySelected,
        addressListKeys: JSON.parse(addrs_list),
        coinFamilies: JSON.parse(coinFamilies)
      }
      getData(Constants.ACCESS_TOKEN).then((token) => {
        APIClient.getInstance()
          .post(CHANGELLY_ONOFFRAMP, data, token)
          .then((response) => {
            console.log("changellyOnOff Success **** ");
            resolve(response);
          })
          .catch((error) => {
            console.log("changellyOnOff Error ****");
            reject(error);
          });
      });
    })
  });
};

export const onOffRampOffer = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(CHANGELLY_GET_OFFER, data, token)
        .then((response) => {
          console.log("changellyOnOffOffer Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("changellyOnOffOffer Error ****");
          reject(error);
        });
    });
  });
}

export const onOffRampCreateOrder = (data) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(SAVE_MERCURYO_TRANSACTION, data, token)
        .then((response) => {
          console.log("changellyOnOffOffer Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("changellyOnOffOffer Error ****");
          reject(error);
        });
    });
  });
}

export const getAllWalletBal = (data) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(API_ALL_WALLET_BALANCE, data, token)
        .then((response) => {
          console.log("getAllWalletBal Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("getAllWalletBal Error ****");
          reject(error);
        });
    });
  });
};

export const saveSolTransactionId = (coin, data) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(API_SAVE_SOL_TRANSACTION_ID + `${coin}/send`, data, token)
        .then((response) => {
          console.log("saveSolTransactionId Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("getAllWalletBal Error ****");
          reject(error);
        });
    });
  })
}

export const getNFtList = (data) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((token) => {
      APIClient.getInstance()
        .post(GET_NFT_LIST, data, token)
        .then((response) => {
          console.log("getNFtList Success **** ");
          resolve(response);
        })
        .catch((error) => {
          console.log("getNFtList Error ****");
          reject(error);
        });
    });
  })
}