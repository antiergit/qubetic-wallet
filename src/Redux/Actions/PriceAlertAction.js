import { APIClient } from '../../components/Api';
import { API_ADD_PRICE_ALERT, API_DELETE_PRICE_ALERT, API_GET_LIST, API_GET_PRICE_ALERT } from '../../EndPoint';
import * as Constants from '../../Constants';
import { exponentialToDecimal, getData } from '../../Utils/MethodsUtils';

/*************************************************** Add PriceAlert API***********************************************************/
export const addPriceAlert = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      // console.log('fafafghcgc==>', data);
      APIClient.getInstance().post(API_ADD_PRICE_ALERT, data, token).then(response => {
        let result = response;
        // console.log('addPriceAlert Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('addPriceAlert Error ****', error);
        reject(errorMessage);
      });
    });
  });
};

/*************************************************** Get PriceAlert API***********************************************************/
export const getPriceAlert = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_GET_PRICE_ALERT, data, token).then(response => {
        let result = response.data;
        // console.log('getPriceAlert Success **** ' + JSON.stringify(result));
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('getPriceAlert Error ****', error);
        reject(errorMessage);
      });
    });
  });
};
/*************************************************** Delete deletePriceAlert API***********************************************************/
export const deletePriceAlert = data => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      APIClient.getInstance().post(API_DELETE_PRICE_ALERT, { id: data }, token).then(response => {
        let result = response.data;
        // console.log('getAddressBook Success **** ' + result);
        resolve(result);
      }).catch(error => {
        let errorMessage = error.message;
        console.log('deletePriceAlert Error ****bfgjhgyguyg', error);
        reject(errorMessage);
      });
    });
  });
};
/***************************************************get List API***********************************************************/
export const getCoinList = ({ data }) => dispatch => {
  return new Promise((resolve, reject) => {
    getData(Constants.ACCESS_TOKEN).then(token => {
      getData(Constants.COIN_FAMILY_LIST).then(coinfamilyList => {
        const coin_families = JSON.parse(coinfamilyList);
        data.coin_family = coin_families
        APIClient.getInstance().post(API_GET_LIST, data, token).then(response => {
          if (response.data.length > 0) {
            response.data.map((item, index) => {
              if (item.fiat_price_data != null) {
                item.fiat_price_data.value = exponentialToDecimal(item.fiat_price_data.value)
              }
            })
          }
          // console.log('getCoinList Success **** ', response);
          const result = response;
          //  console.log('getCoinList Success **** ', result);
          resolve(result);
        }).catch(error => {
          let errorMessage = error.message;
          console.log('getCoinList Error ****bfgjhgyguyg', error);
          reject(errorMessage);
        });
      });
    });
  });
};
