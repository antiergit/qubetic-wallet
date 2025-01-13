import { APIClient } from '../../components/Api';
import { API_CONVERSION_ALCHEMY, API_CONVERSION_RAMP, API_FIAT_LIST_ALCHEMY, API_GET_BUYSELL_STATUS, API_GET_SIGN, API_SUPPORTED_RAMP_FIAT_LIST, ORDER_INIT_ALCHEMY_URL, ORDER_INIT_URL } from '../../EndPoint';
import { getData } from '../../Utils/MethodsUtils';
import * as Constants from '../../Constants';

/*************************************************** Add PriceAlert API***********************************************************/
export const getSign = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    // console.log('fafafghcgc==>', data);
    APIClient.getInstance().post(API_GET_SIGN, data, '').then(response => {
      let result = response.data;
      // console.log('getSign Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('getSign Error ****', error);
      reject(errorMessage);
    });
  });
};
/*************************************************** fiat list Alchemy API***********************************************************/
export const getFiatSupportedList = ({ data }) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const token = await getData(Constants.ACCESS_TOKEN);
    APIClient.getInstance().post(API_FIAT_LIST_ALCHEMY, data, token).then((response) => {
      let result = response.data;
      // console.log('getFiatSupportedList Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch((error) => {
      let errorMessage = error.message;
      console.log("getFiatSupportedList Error ****", error);
      reject(errorMessage);
    });
  });
};
/*************************************************** conversion Alchemy API***********************************************************/
export const getConversionAlchemy = ({ data }) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const token = await getData(Constants.ACCESS_TOKEN);
    APIClient.getInstance().post(API_CONVERSION_ALCHEMY, data, token).then((response) => {
      let result = response.data;
      //console.log('getConversion Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch((error) => {
      let errorMessage = error.message;
      console.log("getConversion Error ****", error);
      reject(errorMessage);
    });
  });
};
/*************************************************** order Initialize Alchemy API***********************************************************/
export const orderInitAlchemy = (data) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const token = await getData(Constants.ACCESS_TOKEN);
    APIClient.getInstance().post(ORDER_INIT_ALCHEMY_URL, data, '').then((response) => {
      let result = response;
      //console.log('orderInitAlchemy Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch((error) => {
      let errorMessage = error.message;
      console.log("orderInitApiMercuryo Error ****", error);
      reject(errorMessage);
    });
  });
};
/*************************************************** buysell status API***********************************************************/
export const getBuySellStatus = (data) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const token = await getData(Constants.ACCESS_TOKEN);
    APIClient.getInstance().post(API_GET_BUYSELL_STATUS, data, token).then((response) => {
      let result = response.data;
      console.log('getBuySellStatus Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch((error) => {
      let errorMessage = error.message;
      console.log("getBuySellStatus Error ****", error);
      reject(errorMessage);
    });
  });
};
/*************************************************** fiatList onOff Ramp API ***********************************************************/
export const getOnOffRampFiatList = ({ }) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const token = await getData(Constants.ACCESS_TOKEN);
    APIClient.getInstance().post(API_SUPPORTED_RAMP_FIAT_LIST, null, token).then((response) => {
      let result = response.data;
      console.log('getOnOffRampFiatList Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch((error) => {
      let errorMessage = error.message;
      console.log("getOnOffRampFiatList Error ****", error);
      reject(errorMessage);
    });
  });
};
/*************************************************** getCoversionRamp API***********************************************************/
export const getConversionRamp = ({ data }) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const token = await getData(Constants.ACCESS_TOKEN);
    APIClient.getInstance().post(API_CONVERSION_RAMP, data, token).then((response) => {
      let result = response.data;
      console.log('getConversionRamp Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch((error) => {
      let errorMessage = error.message;
      console.log("getConversionRamp Error ****", error);
      reject(errorMessage);
    });
  });
};
/*************************************************** initiateTx API***********************************************************/
export const initiateTx = ({ data }) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    const token = await getData(Constants.ACCESS_TOKEN);
    APIClient.getInstance().post(ORDER_INIT_URL, data, token).then((response) => {
      let result = response.data;
      console.log('initiateTx Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch((error) => {
      let errorMessage = error.message;
      console.log("initiateTx Error ****", error);
      reject(errorMessage);
    });
  });
};