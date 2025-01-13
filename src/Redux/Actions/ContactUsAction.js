import { APIClient } from '../../components/Api';
import { CONTACT_US, QUERY_API, UPLOAD_IMAGE } from '../../EndPoint';
import { getData } from '../../Utils/MethodsUtils';
import * as Constants from '../../Constants';

/*************************************************** Contact us API***********************************************************/
export const hitContactUs = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(CONTACT_US, data, token).then(response => {
        let result = response;
        console.log('hitContactUs Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('hitContactUs Error ****', error);
        reject(errorMessage);
      });
    })
  });
};
/*************************************************** uploadImage API***********************************************************/
export const uploadImage = (formData) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      console.log('chk formData:::::::', formData)
      APIClient.getInstance().postFileNew(UPLOAD_IMAGE, formData, token).then((response) => {
        let result = response?.data;
        console.log('response uploadImage --**** ' + JSON.stringify(result));
        resolve(result);
      })
        .catch((error) => {
          console.log('error uploadImage -- ****', error);
          reject(error);
        });
    })
  })
};
/*************************************************** Query List API***********************************************************/
export const getQueryList = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(QUERY_API, data, token).then((response) => {
        let result = response;
        console.log('response getQueryList --**** ' + JSON.stringify(result));
        resolve(result);
      }).catch((error) => {
        console.log('error getQueryList -- ****', error);
        reject(error);
      });
    })
  })
};
