import { APIClient } from '../../components/Api';
import { LISTING_WALLET } from '../../../src/EndPoint';

export const getWalletList = ({ token }) => dispatch => {
  return new Promise((resolve, reject) => {
    APIClient.getInstance().post(LISTING_WALLET, {}, token).then(response => {
      let result = response;
      //console.log('Manage Wallet List Success **** ' + JSON.stringify(result));
      resolve(result);
    }).catch(error => {
      let errorMessage = error.message;
      console.log('Manage Wallet List Error ****', error);
      reject(errorMessage);
    });
  });
};


