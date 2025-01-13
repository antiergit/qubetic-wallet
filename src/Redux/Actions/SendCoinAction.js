import { GET_GAS_PRICE } from './types';
import { APIClient } from '../../components/Api';
import { TRANSACTION_LIST_API, API_GET_ORDER_DETAIL, GET_TRANSACTION_DETAIL_API, NATIVE_COIN_BALANCE } from '../../../src/EndPoint';
import * as Constants from '../../Constants';
import Singleton from '../../Singleton';
import { getData } from '../../Utils/MethodsUtils';

/*************************************get oracle gas estimate*********************************************** */
export const requestgasprice = (token, coin_family) => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: GET_GAS_PRICE });
    APIClient.getInstance().get(coin_family ? `wallet/gasprice?coin_family=1` : `wallet/gasprice`, token).then(response => {
      let result = response.data;
      let gasObj = {
        safeLow: parseFloat(result.SafeGasPrice),
        standard: parseFloat(result.SafeGasPrice),
        fast: parseFloat(result.ProposeGasPrice),
        fastest: parseFloat(result.FastGasPrice),
      };
      // console.log('Oracle Gas Price Success **** ' + JSON.stringify(gasObj));
      resolve(gasObj);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('Oracle Gas Price Error ****', error);
      reject(errorMessage);
    });
  });
};
/*************************************Get gas estimation api*********************************************** */
export const requestGasEstimation = ({ url, gasEstimationReq, token }) => dispatch => {
  return new Promise((resolve, reject) => {
    console.log("url >>>>>>>", url);

    dispatch({ type: GET_GAS_PRICE });
    APIClient.getInstance().post(url, gasEstimationReq, token).then(response => {
      let result = response;
      //console.log('Req Gas Estimation Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('Req Gas Estimation Error ****', error);
      reject(errorMessage);
    });
  });
};
/*************************************Get nonce APi*********************************************** */
export const requestNonce = ({ url, coinSymbol, nonceReq, token }) => dispatch => {
  return new Promise((resolve, reject) => {
    dispatch({ type: GET_GAS_PRICE });
    let nonceReq1 = {
      amount: '',
      wallet_address: Singleton.getInstance().defaultEthAddress,
    };
    console.log('requestGasLimitForDapp ****', nonceReq1);

    APIClient.getInstance().post(url, nonceReq1, token).then(response => {
      let result = response;
      //  console.log('Nonce Request  Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('Nonce request  Error ****', error);
      reject(errorMessage);
    });
  });
};
/*************************************Get Gas Limit for DAPP*********************************************** */
export const requestGasLimitForDapp = ({ url, data }) => dispatch => {
  return new Promise((resolve, reject) => {
    let dataLimit = data;
    delete dataLimit.gasPrice;
    let nonceReq1 = {
      jsonrpc: '2.0',
      method: 'eth_estimateGas',
      params: [dataLimit],
      id: 1,
    };
    console.log('requestGasLimitForDapp ****', nonceReq1);

    APIClient.getInstance().postWithFullUrl(url, nonceReq1).then(response => {
      let result = response;
      console.log('Gas Limit for Dapp  Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('Gas Limit for Dapp  Error ****', error);
      reject(errorMessage);
    });
  });
};

export const requestCoinBalance = (data) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(NATIVE_COIN_BALANCE, data, token).then(response => {
        let result = response;
        // console.log('Coin Balance Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {

      })
    })
  })
}
/*************************************Send Coin APi*********************************************** */
export const requestSendCoin = ({ url, sendCoinReq, token }) => dispatch => {
  return new Promise((resolve, reject) => {
    // console.log("url, sendCoinReq, token:::::", url, sendCoinReq, token);
    dispatch({ type: GET_GAS_PRICE });
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(url, sendCoinReq, token).then(response => {
        let result = response;
        console.log('Send Coin Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('Send Coin Error ****', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************Dapp List APi*********************************************** */
export const requestDefiLinks = ({ url, token }) => dispatch => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance().get(url, token).then(response => {
      let result = response;
      // console.log('Defi Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('Defi Error ****', error);
      reject(errorMessage);
    });
  });
};

/************************************** getBTCprice Api request ****************************************************/
export const requestBTCgasprice = () => dispatch => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance().getGasPrice(`https://api.blockchain.info/mempool/fees`).then(response => {
      let result = response;
      // console.log('Get BTC fees price Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('Get BTC fees price  Error ****', error);
      reject(errorMessage);
    });
  });
};
/************************************** getUnspent BTC Api request ****************************************************/
export const requestUnspent = (address, token, coin) => dispatch => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance().get(`bitcoin/unspent/${address}`, token).then(response => {
      let result = response;
      console.log('BTCUNSPENT Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('BTCUNSPENT Error ****', error);
      reject(errorMessage);
    });
  });
};
/************************************** getUnspent BTC Api request ****************************************************/
export const requestLtcUnspent = (address, token, coin) => dispatch => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance().get(`litecoin/unspent/${address}`, token).then(response => {
      let result = response;
      // console.log('LTCUNSPENT Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('LTCUNSPENT Error ****', error);
      reject(errorMessage);
    });
  });
};
/*************************************Transaction List*********************************************** */
export const getTransactionList = ({ getTxnReq }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(TRANSACTION_LIST_API, getTxnReq, token).then(response => {
        let result = response;
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('TransactionList Error ****', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************Transaction Detail*********************************************** */
export const getTransactionDetail = ({ getTxnDetailReq, token }) => dispatch => {
  //console.log(getTxnDetailReq);
  return new Promise((resolve, reject) => {
    APIClient.getInstance().post(GET_TRANSACTION_DETAIL_API, getTxnDetailReq, token).then(response => {
      let result = response;
      //console.log('Get transaction detail Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('get Transaction detail Error ****', error);
      reject(errorMessage);
    });
  });
};
/*************************************OREDR Detail*********************************************** */
export const getOrderState = order_id => dispatch => {
  //console.log(order_id);
  return new Promise((resolve, reject) => {
    const data = {
      equipmentNo: '123456568',
      orderId: order_id,
      sourceType: 'iOS',
    };
    APIClient.getInstance().postSwap(API_GET_ORDER_DETAIL, data, '').then(response => {
      let result = response;
      //  console.log('API_GET_ORDER_DETAIL **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('get API_GET_ORDER_DETAIL Error ****', error);
      reject(errorMessage);
    });
  });
};

