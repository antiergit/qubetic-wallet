import { APIClient } from '../../components/Api';
import { GET_DEFAULT_LANGUAGE, GET_LANGUAGE, UPDATE_LANGUAGE } from '../../EndPoint';
import { getData } from '../../Utils/MethodsUtils';
import * as Constants from '../../Constants';

/*************************************************** getLanguageList API***********************************************************/
export const getLanguageList = ({ }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().get(GET_LANGUAGE, token).then(response => {
        let result = response.data;
        console.log('getLanguageList Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('getLanguageList Error ****', error);
        reject(errorMessage);
      });
    })
  });
};

/*************************************************** getDefaultLanguageList API***********************************************************/
export const getDefaultLanguageList = ({ }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().get(GET_DEFAULT_LANGUAGE, token).then(response => {
        let result = response;
        console.log('getDefaultLanguageList Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('getDefaultLanguageList Error ****', error);
        reject(errorMessage);
      });
    })
  });
};

/*************************************************** updateLanguage API***********************************************************/
export const updateLanguage = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(UPDATE_LANGUAGE, data, token).then((response) => {
        let result = response;
        console.log('response updateLanguage --**** ' + JSON.stringify(result));
        resolve(result);
      }).catch((error) => {
        console.log('error updateLanguage -- ****', error);
        reject(error);
      });
    })
  })
};
