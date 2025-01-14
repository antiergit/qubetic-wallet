import { API_REFRESHTOKEN, BASE_URL, BASE_URL_SWFT, MATACHA_BASE_URL } from '../../../src/EndPoint';
import * as Constants from '../../Constants';
import NodeRSA from 'node-rsa';
import { getData, saveData } from '../../Utils/MethodsUtils';
import RNFetchBlob from 'rn-fetch-blob';
import { fetch } from 'react-native-ssl-pinning';

const certs = ["coingecko", "qubetics", "swftc"]
const APIClient = class APIClient {
     static myInstance = null;
     static getInstance() {
          if (APIClient.myInstance == null) {
               APIClient.myInstance = new APIClient();
          }
          return this.myInstance;
     }
     // ************************************************* Get **************************************************
     async get(endpoint, UserToken) {
          console.log('API Client Called');
          console.log('UserToken11>>>>>>', UserToken);
          console.log('url11', `${BASE_URL}${endpoint}`);
          if (!global.isConnected) {
               return new Promise((resolve, reject) => {
                    reject({ message: Constants.NO_NETWORK });
               });
          } else {
               return new Promise(async (resolve, reject) => {
                    fetch(`${BASE_URL}${endpoint}`, {
                         method: 'GET',
                         headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                              'content-language': await getData(Constants.SELECTED_LANGUAGE) || 'en',
                              Authorization: UserToken || '',
                         },
                         sslPinning: {
                              certs: certs
                         },
                         disableAllSecurity: false
                    }).then(async res => {
                         try {
                              let jsonVal = await res.json();
                              if (jsonVal.code == 409) {
                                   this.refreshTheToken().then(async res => {
                                        const UserToken = await getData(Constants.ACCESS_TOKEN)
                                        const response = await this.get(endpoint, UserToken);
                                        return resolve(response);
                                        // this.get(endpoint, UserToken)
                                   }).catch(err => {
                                        console.log('chk refresh errrrrget', err);
                                   })
                              } else {
                                   if (res.status == false) {
                                        if (jsonVal.message == undefined) {
                                             return reject({ message: Constants.SOMETHING_WRONG });
                                        }
                                        return reject(jsonVal);
                                   }
                                   return resolve(jsonVal);
                              }
                         } catch (e) {
                              return reject({ message: Constants.SOMETHING_WRONG });
                         }
                    }).catch(err => {
                         const errorResponse = JSON.parse(err?.bodyString)
                         if (errorResponse?.code == 409) {
                              this.refreshTheToken().then(async res => {
                                   const response = await this.postToken(endpoint, data);
                                   return resolve(response);
                              }).catch(err => {
                                   return reject(err);
                              })
                         } else {
                              reject(errorResponse || err)
                         }
                    });
               });
          }
     }

     // ************************************************* Post **************************************************
     post(endpoint, data, UserToken) {
          if (!global.isConnected) {
               return new Promise((resolve, reject) => {
                    reject({ message: Constants.NO_NETWORK });
               });
          } else {
               return new Promise(async (resolve, reject) => {
                    console.log('UserToken11++++++', UserToken);
                    console.log('certs++++++', certs);
                    console.log('url11', `${BASE_URL}${endpoint}`);
                    console.log('params11', JSON.stringify(data));
                    console.log('SELECTED_LANGUAGE', await getData(Constants.SELECTED_LANGUAGE));
                    console.log('encodeData:::', data != null ? this.encodeData(data) : null);
                    fetch(`${BASE_URL}${endpoint}`, {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                              'content-language': await getData(Constants.SELECTED_LANGUAGE) || 'en',
                              Authorization: UserToken || '',
                         },
                         body: data != null ? this.encodeData(data) : '',
                         sslPinning: {
                              certs: certs
                         },
                         disableAllSecurity: false
                    }).then(async res => {
                         try {
                              const jsonVal = await res.json();
                              console.log(res, 'Json Response 1: ', jsonVal);
                              if (jsonVal.code == 409) {
                                   this.refreshTheToken().then(async res => {
                                        console.log('refresh token resp:::::::')
                                        const response = await this.postToken(endpoint, data);
                                        return resolve(response);
                                        //  this.postToken(endpoint, data)
                                   }).catch(err => {
                                        console.log('chk refresh errrrr post', err);
                                        return reject(err);
                                   })
                              } else {
                                   if (res.status == false) {
                                        if (!!jsonVal?.data?.message) {
                                             return reject(jsonVal);
                                        }
                                        if (jsonVal.message == undefined) {
                                             return reject({
                                                  message: Constants.SOMETHING_WRONG,
                                             });
                                        }
                                        return reject(jsonVal);
                                   } else {
                                        return resolve(jsonVal);
                                   }
                              }
                         } catch (e) {
                              console.log('api error99', e);
                              return reject({ message: Constants.SOMETHING_WRONG });
                         }
                    }).catch(err => {
                         const errorResponse = JSON.parse(err?.bodyString)
                         if (errorResponse?.code == 409) {
                              this.refreshTheToken().then(async res => {
                                   const response = await this.postToken(endpoint, data);
                                   return resolve(response);
                              }).catch(err => {
                                   return reject(err);
                              })
                         } else {
                              reject(errorResponse || err)
                         }
                    });
               });
          }
     }

     // ************************************************* Post With URL **************************************************
     postWithFullUrl(endpoint, data, UserToken) {
          if (!global.isConnected) {
               return new Promise((resolve, reject) => {
                    reject({ message: Constants.NO_NETWORK });
               });
          } else {
               return new Promise(async (resolve, reject) => {
                    fetch(`${endpoint}`, {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                              'content-language': await getData(Constants.SELECTED_LANGUAGE) || 'en',
                              Authorization: UserToken || '',
                         },
                         body: data != null ? JSON.stringify(data) : null,
                         sslPinning: {
                              certs: certs
                         },
                         disableAllSecurity: false
                    }).then(async res => {
                         try {
                              let jsonVal = await res.json();
                              if (jsonVal.code == 409) {
                                   this.refreshTheToken().then(async res => {
                                        const response = await this.postToken(endpoint, data);
                                        return resolve(response);
                                        // this.postToken(endpoint, data)
                                   }).catch(err => {
                                        console.log('chk refresh errrrr post full url', err);
                                   })
                              } else {
                                   if (res.status == false) {
                                        if (jsonVal.message == undefined) {
                                             return reject({ message: Constants.SOMETHING_WRONG });
                                        }
                                        return reject(jsonVal);
                                   }
                                   return resolve(jsonVal);
                              }
                         } catch (e) {
                              console.log('api error333', e);
                              return reject({ message: Constants.SOMETHING_WRONG });
                         }
                    }).catch(err => {
                         const errorResponse = JSON.parse(err?.bodyString)
                         if (errorResponse?.code == 409) {
                              this.refreshTheToken().then(async res => {
                                   const response = await this.postToken(endpoint, data);
                                   return resolve(response);
                              }).catch(err => {
                                   return reject(err);
                              })
                         } else {
                              reject(errorResponse || err)
                         }
                    });
               });
          }
     }

     // *********************************************** Get GasPrice *********************************************
     getGasPrice(endpoint, UserToken) {
          if (!global.isConnected) {
               return new Promise((resolve, reject) => {
                    reject({ message: Constants.NO_NETWORK });
               });
          } else {
               return new Promise(async (resolve, reject) => {
                    fetch(`${endpoint}`, {
                         method: 'GET',
                         headers: {
                              Accept: 'application/json',
                              'Content-Type': 'application/json',
                              'content-language': await getData(Constants.SELECTED_LANGUAGE) || 'en',
                              'api-access-token': UserToken,
                         },
                         sslPinning: {
                              certs: certs
                         },
                         disableAllSecurity: false
                    }).then(async res => {
                         try {
                              const jsonVal = await res.json();
                              if (jsonVal.code == 409) {
                                   this.refreshTheToken().then(async res => {
                                        const UserToken = await getData(Constants.ACCESS_TOKEN)
                                        this.getGasPrice(endpoint, UserToken)
                                   }).catch(err => {
                                        console.log('chk refresh errrrr gas price', err);
                                   })
                              } else {
                                   if (res.status == false) {
                                        if (jsonVal.message == undefined) {
                                             return reject({ message: Constants.SOMETHING_WRONG });
                                        }
                                        return reject(jsonVal);
                                   }
                                   return resolve(jsonVal);
                              }
                         } catch (e) {
                              return reject({ message: Constants.SOMETHING_WRONG });
                         }
                    }).catch(err => {
                         const errorResponse = JSON.parse(err?.bodyString)
                         if (errorResponse?.code == 409) {
                              this.refreshTheToken().then(async res => {
                                   const response = await this.postToken(endpoint, data);
                                   return resolve(response);
                              }).catch(err => {
                                   return reject(err);
                              })
                         } else {
                              reject(errorResponse || err)
                         }
                    });
               });
          }
     }

     // ************************************************* refreshTheToken **************************************************
     refreshTheToken() {
          return new Promise(async (resolve, reject) => {
               try {
                    const token = await getData(Constants.REFRESH_TOKEN);
                    const old_token = await getData(Constants.ACCESS_TOKEN);
                    const response = await this.postToken(API_REFRESHTOKEN, { token: old_token, refreshToken: token }, '');
                    console.log("llllllllll_____", response);
                    if (response.status) {
                         console.log('response ... ', response);
                         getData(Constants.MULTI_WALLET_LIST).then(list => {
                              const Arr = JSON.parse(list);
                              console.log('Arr', Arr);
                              const newMultiWalletArray = Arr.map((item, index) => {
                                   console.log('item________', item);
                                   if (item?.defaultWallet) {
                                        item.user_jwtToken = response.token;
                                        item.user_refreshToken = response.refreshToken;
                                   }
                                   return item;
                              });
                              saveData(Constants.MULTI_WALLET_LIST, JSON.stringify(newMultiWalletArray));
                              saveData(Constants.ACCESS_TOKEN, response.token);
                              saveData(Constants.REFRESH_TOKEN, response.refreshToken);
                              resolve()
                         })
                    } else {
                    }
               } catch (error) {
                    reject(error)
                    console.log('error refresh token ', error);
               }
          })
     };

     // ************************************************* postToken **************************************************
     async postToken(endpoint, data) {
          const UserToken = await getData(Constants.ACCESS_TOKEN);
          console.log('postToken endpoint:::::', endpoint);
          console.log('postToken data:::::', data);
          if (!global.isConnected) {
               return new Promise((resolve, reject) => {
                    reject({ message: Constants.NO_NETWORK });
               });
          } else {
               return new Promise(async (resolve, reject) => {
                    fetch(`${BASE_URL}${endpoint}`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json', Authorization: UserToken || '', 'content-language': await getData(Constants.SELECTED_LANGUAGE) || 'en', },
                         body: data != null ? endpoint.includes('user/file_upload') ? data : this.encodeData(data) : null,
                         sslPinning: {
                              certs: certs
                         },
                         disableAllSecurity: false
                    }).then(async res => {
                         try {
                              const jsonVal = await res.json();
                              console.log('Json Response 5: post toekn', jsonVal);
                              if (res.status == false) {
                                   if (jsonVal.message == undefined) {
                                        return reject({ message: Constants.SOMETHING_WRONG });
                                   }
                                   return reject(jsonVal);
                              } else {
                                   return resolve(jsonVal);
                              }
                         } catch (e) {
                              console.log('api error99', e);
                              return reject({ message: Constants.SOMETHING_WRONG });
                         }
                    }).catch(err => {
                         console.log('chk post errr::::2', err);
                         reject(err)
                    });
               });
          }
     }

     // ************************************************* Post swft  **************************************************
     swapPost(endpoint, data) {
          console.log("postSwap ", data)
          if (!global.isConnected) {
               return new Promise((resolve, reject) => {
                    reject({ message: Constants.NO_NETWORK });
               });
          } else {
               return new Promise(async (resolve, reject) => {
                    fetch(`${BASE_URL_SWFT}${endpoint}`, {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: data != null ? JSON.stringify(data) : null,
                         sslPinning: {
                              certs: certs
                         },
                         disableAllSecurity: false
                    }).then(async res => {
                         try {
                              const jsonVal = await res.json();
                              console.log('Json Response 2:', jsonVal);
                              if (res.status == false) {
                                   if (jsonVal.message == undefined) {
                                        return reject({ message: Constants.SOMETHING_WRONG });
                                   }
                                   return reject(jsonVal);
                              } else {
                                   return resolve(jsonVal);
                              }
                         } catch (e) {
                              console.log('api error99', e);
                              return reject({ message: Constants.SOMETHING_WRONG });
                         }
                    }).catch(err => {
                         console.log('chk post errr::::3', err);
                         reject(err)
                    });
               });
          }
     }

     // ************************************************* PostSwap **************************************************
     postSwap(endpoint, data, UserToken) {
          if (!global.isConnected) {
               return new Promise((resolve, reject) => {
                    reject({ message: Constants.NO_NETWORK });
               });
          } else {
               return new Promise((resolve, reject) => {
                    fetch(`${endpoint}`, {
                         method: 'POST',
                         headers: {
                              'Content-Type': 'application/json',
                              Authorization: UserToken || '',
                         },
                         body: data != null ? JSON.stringify(data) : null,
                         sslPinning: {
                              certs: certs
                         },
                         disableAllSecurity: false
                    }).then(async res => {
                         try {
                              let jsonVal = await res.json();
                              if (res.status == false) {
                                   if (jsonVal.message == undefined) {
                                        return reject({ message: Constants.SOMETHING_WRONG });
                                   }
                                   return reject(jsonVal);
                              }
                              return resolve(jsonVal);
                         } catch (e) {
                              console.log('api error111', e);
                              return reject({ message: Constants.SOMETHING_WRONG });
                         }
                    })
                         .catch(reject);
               });
          }
     }

     // ************************************************* getGeckoSymbolsL **************************************************
     getGeckoSymbols(url) {
          return new Promise((resolve, reject) => {
               fetch(url, {
                    method: 'GET',
                    sslPinning: {
                         certs: certs
                    },
                    disableAllSecurity: false
               }).then(response => response.json()).then(responseJson => {
                    resolve({ list: responseJson });
               }).catch(error => {
                    console.error(error);
                    reject();
               });
          });
     }

     // ************************************************* encodeData **************************************************
     encodeData = data => {
          console.log('chk data:::::::', data)
          const second = new NodeRSA(Constants.KEY);
          second.setOptions({ encryptionScheme: 'pkcs1' });
          const enc = second.encrypt(data, 'base64');
          const dataa = {
               dataString: enc,
          };
          return JSON.stringify(dataa);
     };

     // ************************************************* PostFile **************************************************
     postFileNew = (endpoint, data, UserToken) =>
          new Promise(async (resolve, reject) => {
               console.log('UserToken11------', UserToken);
               console.log('url11', `${BASE_URL}${endpoint}`);
               console.log('params11', JSON.stringify(data));
               fetch(`${BASE_URL}${endpoint}`, {
                    method: 'POST',
                    headers: {
                         Authorization: UserToken || '',
                         'content-language': await getData(Constants.SELECTED_LANGUAGE) || 'en',
                    },
                    body: data,
                    sslPinning: {
                         certs: certs
                    },
                    disableAllSecurity: false
               }).then(async res => {
                    try {
                         const jsonVal = await res.json();
                         console.log('Json Response 3:', jsonVal);
                         if (jsonVal.code == 409) {
                              this.refreshTheToken().then(async res => {
                                   const response = await this.postToken(endpoint, data);
                                   return resolve(response);
                                   // this.postToken(endpoint, data, false)
                              }).catch(err => {
                                   console.log('chk refresh errrrr post', err);
                              })
                         } else {
                              if (res.status == false) {
                                   if (jsonVal.message == undefined) {
                                        return reject({ message: Constants.SOMETHING_WRONG });
                                   }
                                   return reject(jsonVal);
                              } else {
                                   return resolve(jsonVal);
                              }
                         }
                    } catch (e) {
                         console.log('api error99', e);
                         return reject({ message: Constants.SOMETHING_WRONG });
                    }
               }).catch(err => {
                    const errorResponse = JSON.parse(err?.bodyString)
                    if (errorResponse?.code == 409) {
                         this.refreshTheToken().then(async res => {
                              const response = await this.postToken(endpoint, data);
                              return resolve(response);
                         }).catch(err => {
                              return reject(err);
                         })
                    } else {
                         reject(errorResponse || err)
                    }
               });
          });
};
export { APIClient };