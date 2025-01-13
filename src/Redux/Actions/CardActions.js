import { APIClient } from '../../components/Api';
import * as Constants from '../../Constants';
import { getData } from '../../Utils/MethodsUtils';
import { APPLY_CARD, BASE_URL, BIND_PHYSICAL_CARD, CALCULATE_DEPOSIT, CARD_FEES, CARD_STATUS, GET_ALL_CARDS, GET_CARD_DETAILS, GET_CARD_HISTORY, GET_COUNTRY_CODES, GET_MINIMUM_RECHARGE_AMOUNT, GET_MINIMUM_RECHARGE_AMOUNT_PHYSICAL, GET_SUPPORTED_COINLIST, PHYSICAL_CARD_STATUS, SAVE_SHIPPING_ADDRESS, SAVE_USER_DATA_VIRTUAL, SEND_EMAIL_OTP, SEND_MOBILE_OTP, UPLOAD_KYC_DETAILS, USER_DETAILS, USER_KYC, USP_CARD_STATUS, VERIFY_OTP } from '../../EndPoint';
import axios from 'axios';
import NodeRSA from 'node-rsa';

/******************************************************************************************/
export const getAllCards = ({ }) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(GET_ALL_CARDS, token).then(response => {
                let result = response.data;
                console.log('getAllCards success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getAllCards Error ****', error);
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getSupportedCoinList = ({ }) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(GET_SUPPORTED_COINLIST, token).then(response => {
                let result = response.data;
                console.log('getSupportedCoinList success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getSupportedCoinList Error ****', error);
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const sendOtp = ({ sendOtpReq, type }) => dispatch => {
    console.log("sendOtpReq::::::", sendOtpReq);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(type == 'email' ? SEND_EMAIL_OTP : SEND_MOBILE_OTP, sendOtpReq, token).then(response => {
                let result = response;
                console.log('send otp success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('send otp Error ****', error);
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const verifyOTP = (verifyOtpReq) => dispatch => {
    console.log("verifyOtpReq::::::", verifyOtpReq);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(VERIFY_OTP, verifyOtpReq, token).then(response => {
                let result = response;
                console.log('verify otp success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('verify otp Error ****', error);
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const saveUserData = (saveDataReq) => dispatch => {
    console.log("saveDataReq::::::", saveDataReq);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(SAVE_USER_DATA_VIRTUAL, saveDataReq, token).then(response => {
                let result = response;
                console.log('saveDataReq success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('saveDataReq Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const checkCardStatus = (req) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(CARD_STATUS, req, token).then(response => {
                let result = response;
                console.log('checkCardStatus success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('checkCardStatus Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const checkPhysicalCardStatus = (req) => dispatch => {
    console.log("checkPhysicalCardStatus::::::", req);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(PHYSICAL_CARD_STATUS, req, token).then(response => {
                let result = response.data;
                console.log('checkPhysicalCardStatus success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('checkPhysicalCardStatus Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const checkUSPCardStatus = (req) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(USP_CARD_STATUS, req, token).then(response => {
                let result = response.data;
                console.log('checkUSPCardStatus success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('checkUSPCardStatus Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getVirtualCardFees = () => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(CARD_FEES, token).then(response => {
                let result = response;
                console.log('getVirtualCardFees success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getVirtualCardFees Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getUspCardFees = (cardID) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(CARD_FEES + `?cardId=${cardID}`, token).then(response => {
                let result = response;
                console.log('getUspCardFees success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getUspCardFees Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const applyCard = (applyCardReq) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(APPLY_CARD, applyCardReq, token).then(response => {
                let result = response;
                console.log('applyCard success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('applyCard Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getCardDetail = (type) => dispatch => {
    console.log("getCardDetailReq:::::");
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(type == 'Physical' ? GET_CARD_DETAILS + '?card=Physical' : GET_CARD_DETAILS, token).then(response => {
                let result = response;
                console.log('getCardDetailReq success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCardDetailReq Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getUSPCardDetail = (cardID) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(GET_CARD_DETAILS + `?cardId=${cardID}`, token).then(response => {
                let result = response;
                console.log('getUSPCardDetail success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getUSPCardDetail Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getPhysicalCardDetail = (cardID) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(GET_CARD_DETAILS + `?cardId=${cardID}`, token).then(response => {
                let result = response;
                console.log('getPhysicalCardDetail success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getPhysicalCardDetail Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getCardHistory = (getCardHistoryReq) => dispatch => {
    console.log("getCardHistoryReq:::::", getCardHistoryReq);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(GET_CARD_HISTORY, getCardHistoryReq, token).then(response => {
                let result = response;
                console.log('getCardHistory success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCardDetailReq Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getCountryCodes = () => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(GET_COUNTRY_CODES, token).then(response => {
                let result = response;
                // console.log('getCountryCodes success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getCountryCodes Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getMinimumRechargeAmount = () => dispatch => {
    console.log("getMinimumRechargeAmount:::::");
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(GET_MINIMUM_RECHARGE_AMOUNT, token).then(response => {
                let result = response;
                console.log('getMinimumRechargeAmount success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getMinimumRechargeAmount Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const calculateCardDeposit = (calculateCardDepositReq) => dispatch => {
    console.log("calculateCardDepositReq:::::");
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(CALCULATE_DEPOSIT, calculateCardDepositReq, token).then(response => {
                let result = response;
                console.log('calculateCardDeposit success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('calculateCardDeposit Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
}

/******************************************************************************************/
export const saveShippingAddress = (saveShippingAddressReq) => dispatch => {
    console.log("saveShippingAddressReq:::::", saveShippingAddressReq);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(SAVE_SHIPPING_ADDRESS, saveShippingAddressReq, token).then(response => {
                let result = response;
                console.log('saveShippingAddressReq success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('saveShippingAddressReq Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
}

/******************************************************************************************/
export const getMinimumRechargeAmountPhysical = (req) => dispatch => {
    console.log("getMinimumRechargeAmountPhysical:::::", req);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(GET_MINIMUM_RECHARGE_AMOUNT_PHYSICAL, req, token).then(response => {
                let result = response;
                console.log('getMinimumRechargeAmountPhysical success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getMinimumRechargeAmountPhysical Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const getPhysicalCardFees = (cardID) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().get(CARD_FEES + `?cardId=${cardID}`, token).then(response => {
                let result = response;
                console.log('getPhysicalCardFees success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getPhysicalCardFees Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const bindPhysicalCard = (req) => dispatch => {
    console.log("bindPhysicalCard::::::::", req);
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(BIND_PHYSICAL_CARD, req, token).then(response => {
                let result = response;
                console.log('bindPhysicalCard success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('bindPhysicalCard Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
};

/******************************************************************************************/
export const userKyc = (req) => dispatch => {
    return new Promise((resolve, reject) => {
        console.log("promise:::");
        getData(Constants.ACCESS_TOKEN).then(token => {
            console.log('UserToken', token)
            console.log('url', `${BASE_URL}${USER_KYC}`)
            console.log("params11", req);
            axios.post(`${BASE_URL}${USER_KYC}`, req, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: token,
                }
            }).then(async res => {
                if (res.status == 200) {
                    resolve(res)
                }
            }).catch((error) => {
                const err = error?.response?.data || 'Something went wrong'
                reject(err.message);
            });

        }).catch(error => {

            console.log('userKyc Error ****', error);

        });
    });
};

/******************************************************************************************/
export const uploadKycDetails = (data) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().postFileNew(UPLOAD_KYC_DETAILS, data, token).then(response => {
                let result = response;
                console.log('uploadKycDetails success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('uploadKycDetails Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
}

/******************************************************************************************/
export const getUspUserDetails = ({ data }) => dispatch => {
    return new Promise((resolve, reject) => {
        getData(Constants.ACCESS_TOKEN).then(token => {
            APIClient.getInstance().post(USER_DETAILS, data, token).then(response => {
                let result = response.data;
                console.log('getUserDetails success **** ' + JSON.stringify(result));
                resolve(result);
            }).catch(error => {
                let errorMessage = error.message;
                if (!errorMessage)
                    errorMessage = 'Something Went Wrong '
                console.log('getUserDetails Error ****', JSON.stringify(error));
                reject(errorMessage);
            });
        });
    });
}

