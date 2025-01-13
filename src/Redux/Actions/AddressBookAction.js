import { APIClient } from '../../components/Api';
import * as Constants from '../../Constants';
import { API_ADD_ADDRESS, API_DELETE_ADDRESS_BOOK, API_DELETE_CONTACT, API_GET_ADDRESS, API_SEARCH_CONTACT_NAME, API_SEARCH_WALLET_NAME } from '../../EndPoint';
import { getData } from '../../Utils/MethodsUtils';

/*************************************************** Add Address API***********************************************************/
export const addAddress = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_ADD_ADDRESS, data, token).then(response => {
        let result = response;
        // console.log('addAddress Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('addAddress Error ****', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************************** searchWalletName API***********************************************************/
export const searchWalletName = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_SEARCH_WALLET_NAME, data, token).then(response => {
        let result = response?.wallet_name;
        // console.log('searchWalletName Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('searchWalletName Error ****', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************************** searchContactName API***********************************************************/
export const searchContactName = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_SEARCH_CONTACT_NAME, data, token).then(response => {
        let result = response.contact_name;
        // console.log('searchContactName Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('searchContactName Error ****', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************************** Get AddressBook API***********************************************************/
export const getAddressBook = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_GET_ADDRESS, data, token).then(response => {
        // console.log(result);
        let result = response;
        // console.log('getAddressBook Success **** ' + result);
        resolve(result);
      }).catch(error => {
        let errorMessage = error?.message;
        console.log('getAddressBook Error ****', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************************** Delete AddressBook API***********************************************************/
export const deleteAddressBookId = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_DELETE_ADDRESS_BOOK, data, token).then(response => {
        let result = response.data;
        // console.log('getAddressBook Success **** ' + result);
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('getAddressBook Error ****bfgjhgyguyg', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************************** Delete AddressBook API***********************************************************/
export const deleteContact = rowKey => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_DELETE_CONTACT, { id: rowKey }, token).then(response => {
        let result = response.data;
        console.log('deleteContact Success **** ' + result);
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('deleteContact Error **** ', error);
        reject(errorMessage);
      });
    });
  });
};
