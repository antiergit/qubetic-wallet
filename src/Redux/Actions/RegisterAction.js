import {
  REGISTER_USER,
  REGISTER_USER_FAIL,
  REGISTER_USER_SUCCESS,
  REGISTER_FORM_UPDATE,
  SAVE_CHECKER_REQUESTS,
  CLEAR_CHECKER_REQUESTS,
  CHECKER_REQ_LOADING,
  SAVE_APPROVAL_REQUESTS,
} from "./types";
import { APIClient } from "../../components/Api";
import {
  API_CHECKER_CODE,
  API_CHECKER_CODE_REFRESH,
  API_CHECKER_REQUESTS,
  API_CHECKER_REQ_UPDATE,
  API_GET_REFERRAL_STATUS,
  API_MAKER_ACCOUNT,
  API_MAKER_AUTH_TOKEN,
  API_MAKER_REQ_STATUS,
  LOGIN_API,
} from "../../../src/EndPoint";
import { getData } from "../../Utils/MethodsUtils";
import * as Constants from '../../Constants';
import Singleton from "../../Singleton";

/**************************************Update prop values ****************************************************/
export const registerUser = ({ prop, value }) => {
  return {
    type: REGISTER_FORM_UPDATE,
    payload: { prop, value },
  };
};

/************************************** login APi request ****************************************************/
export const requestWalletLogin = ({ data }) => (dispatch) => {
  console.log("RequestWallet-------", data);
  return new Promise((resolve, reject) => {
    dispatch({ type: REGISTER_USER });
    APIClient.getInstance()
      .post(LOGIN_API, data)
      .then((response) => {
        let result = response;
        console.log("Login Success", response);
        registerSuccess(dispatch, result);
        resolve(result);
      })
      .catch((error) => {
        let errorMessage = error.message;
        console.log("Login Failed", error);
        registerFail(dispatch, errorMessage);
        reject(errorMessage);
      });
  });
};

/************************************** login referral status ****************************************************/
export const getReferralStatus = ({ data }) => (dispatch) => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance()
      .post(API_GET_REFERRAL_STATUS, data)
      .then((response) => {
        let result = response;
        console.log("referral Success", response);
        resolve(result);
      })
      .catch((error) => {
        let errorMessage = error.message;
        console.log("referral Failed", error);
        reject(errorMessage);
      });
  });
};
/************************************* Success/Fail Dispatches ***************************************************/
const registerFail = (dispatch, errorMessage) => {
  dispatch({
    type: REGISTER_USER_FAIL,
    payload: errorMessage,
  });
};
const registerSuccess = (dispatch, user) => {
  dispatch({
    type: REGISTER_USER_SUCCESS,
    payload: user,
  });
};

export const getCheckerCodes = () => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((access_token) => {
      APIClient.getInstance()
        .get(API_CHECKER_CODE, access_token)
        .then((response) => {
          let result = response;
          console.log("getCheckerCodes Success");
          resolve(result?.data);
        })
        .catch((error) => {
          let errorMessage = error.message;
          console.log("getCheckerCodes Failed", error);
          reject(errorMessage);
        });
    });
  });
};

export const refreshCheckerCode = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((access_token) => {
      APIClient.getInstance()
        .post(API_CHECKER_CODE_REFRESH, data, access_token)
        .then((response) => {
          let result = response;
          console.log("refreshCheckerCode Success");
          resolve(result);
        })
        .catch((error) => {
          let errorMessage = error.message;
          console.log("refreshCheckerCode Failed", error);
          reject(errorMessage);
        });
    });
  });
};

export const createMakerAccount = (data) => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance()
      .post(API_MAKER_ACCOUNT, data)
      .then((response) => {
        let result = response;
        console.log("createMakerAccount Success");
        resolve(result);
      })
      .catch((error) => {
        let errorMessage = error.message;
        console.log("createMakerAccount Failed", error);
        reject(errorMessage);
      });
  });
};

export const getMakerReqStatuses = (data) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((access_token) => {
      APIClient.getInstance()
        .post(API_MAKER_REQ_STATUS, data, access_token)
        .then((response) => {
          let result = response;
          console.log("getMakerReqStatuses Success");
          resolve(result);
        })
        .catch((error) => {
          let errorMessage = error.message;
          console.log("getMakerReqStatuses Failed", error);
          reject(errorMessage);
        });
    });
  });
};

export const getMakerAuthTokens = (data) => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance()
      .post(API_MAKER_AUTH_TOKEN, data)
      .then((response) => {
        let result = response;
        console.log("getMakerAuthTokens Success");
        resolve(result);
      })
      .catch((error) => {
        let errorMessage = error.message;
        console.log("getMakerAuthTokens Failed", error);
        reject(errorMessage);
      });
  });
};

export const clearCheckerReq = () => (dispatch) => {
  dispatch({
    type: CLEAR_CHECKER_REQUESTS,
  });
}

export const getCheckerRequests = () => (dispatch) => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(async (access_token) => {
      let multiWallet = await getData(Constants.MULTI_WALLET_LIST)
      let multiWalletData = await JSON.parse(multiWallet)
      let currentWallet = await multiWalletData.filter(el => el?.defaultWallet == true)?.[0]

      const query = `/${Singleton.getInstance().CurrencySelected}/${currentWallet?.coinFamilyKeys}`;
      dispatch({
        type: CHECKER_REQ_LOADING,
        payload: true,
      });
      APIClient.getInstance()
        .get(API_CHECKER_REQUESTS + query, access_token)
        .then((response) => {
          let result = response;
          console.log("getCheckerRequests Success", response?.data);
          if (!response?.data) {
            return;
          }
          const isApproval = response?.data?.trnxRequests?.filter((item)=>item?.type === 'Approval')          
          const transReq = response.data.trnxRequests;
          const accessReq = response.data.accessRequests;
          const payload = {
            transReq,
            accessReq,
          };
          dispatch({
            type: SAVE_APPROVAL_REQUESTS,
            payload: isApproval,
          });
          dispatch({
            type: SAVE_CHECKER_REQUESTS,
            payload,
          });
          dispatch({
            type: CHECKER_REQ_LOADING,
            payload: false,
          });
          resolve(result);
        })
        .catch((error) => {
          let errorMessage = error.message;
          console.log("getCheckerRequests Failed", error);
          dispatch({
            type: CHECKER_REQ_LOADING,
            payload: false,
          });
          reject(errorMessage);
        });
    });
  });
};

export const updateAccessReqByChecker = (data) => { 
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then((access_token) => {
      APIClient.getInstance()
        .post(API_CHECKER_REQ_UPDATE, data, access_token)
        .then((response) => {
          let result = response;
          console.log("getMakerAuthTokens Success");
          resolve(result);
        })
        .catch((error) => {
          let errorMessage = error.message;
          console.log("getMakerAuthTokens Failed", error);
          reject(errorMessage);
        });
    });
  });
 }

