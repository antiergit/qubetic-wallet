import React, { useState, useEffect } from 'react';
import styles from './ManageStyle';
import { View, Image, Text, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { Colors, Images } from '../../../theme';
import { Button, Header, HeaderMain, LoaderView } from '../../common';
import { Actions } from 'react-native-router-flux';
import { ThemeManager } from '../../../../ThemeManager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { sortManageWallet } from '../../../Redux/Actions/WalletAction';
import { bigNumberSafeMath, CommaSeprator1, toFixed } from '../../../Utils/MethodsUtils';
import { LanguageManager } from '../../../../LanguageManager';
import { horizontalScale } from '../../../layouts/responsive';
import {
  requestCoinList,
  getRpcUrl,
  getNotiStatus,
} from "../../../Redux/Actions";
import { useDispatch } from 'react-redux';

import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../../Utils";
import Singleton from '../../../Singleton';
const Manage = props => {
  const { walletMain, manage } = LanguageManager;
  const [newCoinList, setNewCoinList] = useState([]);
  // const [coinList, setCoinlist] = useState(props?.coinList);
  const [coinList, setCoinlist] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [loadList, setloadList] = useState(false);
  const [limit, setlimit] = useState(25);
  const [page, setPage] = useState(1);

  const [totalRecords, settotalRecords] = useState(50);
  const dispatch = useDispatch();

  console.log('chk coinList::::::', coinList.length);
  useEffect(() => {

    getSearchList(false);

  }, []);
  /******************************************************************************************/
  const getSearchList = (fromPagination) => {
    let data = {
      search: '',
      page: page,
      limit: 25,

    };
    fetchList(data, fromPagination);
  }
  /******************************************************************************************/
  const fetchList = (data1, fromPagination) => {
    setisLoading(true)

    setTimeout(() => {
      dispatch(requestCoinList({ data1 }))
        .then((response) => {
          console.log("response:::::", response);
          console.log("manage token order length>>>", response.data.length);
          if (response.data.length > 0) {

            settotalRecords(response?.meta?.total)
            // setCoinlist(fromPagination ? coinList.concat(response.data) : response.data)
            const newCoinList = fromPagination ? [...coinList, ...response.data] : response.data;
            setCoinlist(Array.from(new Set(newCoinList.map(coin => coin.coin_id))).map(id => newCoinList.find(coin => coin.coin_id === id)));
            // if (response.data.status == 1) {
            // response.data.forEach(element => {
            //   if (element.status == 1) {
            //     console.log("status length>>>", response.data.length);
            //     setCoinlist(fromPagination ? coinList.concat(response.data) : response.data)
            //   }
            // });

            // }

            setloadList(true)
            // console.log("manage token order length concat>>>", coinList.concat(response.data.length));
          } else {
            setCoinlist(fromPagination ? coinList : [])
          }
          setisLoading(false)

        })
        .catch((err) => {
          setisLoading(false)

        });
    }, 150);
  }
  /******************************************************************************************/
  const updateList = () => {
    setisLoading(true);
    props.sortManageWallet({ data: newCoinList }).then(e => {
      setisLoading(false);
      Actions.pop();
    });
  };

  /******************************************************************************************/
  const onDragEnd = data => {
    setCoinlist(data);
    let temp = [];
    temp = data.map((item, index) => {
      return { coin_id: item.coin_id, order: index + 1, wallet_address: item.wallet_address };
    });
    setNewCoinList(temp);
  };


  /******************************************************************************************/
  const renderItem = ({ item, index, drag, isActive }) => {
    // console.log("item==", item)
    return (
      <View
        resizeMode={"contain"}
        style={{
          flex: 1,
          alignItems: "center",
          flexDirection: 'row',
          backgroundColor: ThemeManager.colors.mnemonicsBg,
          marginBottom: heightDimen(10),
          borderRadius: dimen(14),
        }}
      >
        <TouchableOpacity
          disabled={isActive}
          onLongPress={drag}
          delayLongPress={200}
          style={[styles.ViewStyle, { marginBottom: index == coinList.length - 1 ? 15 : 15 }]}>
          <View style={{ width: "10%" }}>
            {item?.coin_image ? (<Image style={[styles.imgCoin, { borderRadius: 30, resizeMode: 'cover', backgroundColor: ThemeManager.colors.borderUnderLine }]} source={{ uri: item?.coin_image }} />)
              : (
                <View style={[styles.ViewStyle2, { backgroundColor: ThemeManager.colors.borderUnderLine }]}>
                  <Text allowFontScaling={false} style={{ color: ThemeManager.colors.Text }}>{item?.coin_name?.charAt(0)?.toUpperCase()}</Text>
                </View>
              )}
          </View>
          <View style={[styles.ViewStyle3]}>

            <View style={styles.ViewStyle1}>
              <Text allowFontScaling={false} style={[styles.txtCoin, { color: ThemeManager.colors.blackWhiteText }]}>
                {item?.coin_name?.toString().length > 12 ? item?.coin_name?.substring(0, 10) + '...' : item.coin_name}
                {(item.is_token == 1 || item.coin_family == 1) && (<Text allowFontScaling={false} style={[styles.titleTextStyle, { color: ThemeManager.colors.blackWhiteText, fontSize: dimen(14) }]}>{item.coin_family == 1 ? ' (BEP-20)' : item.coin_family == 2 ? ' (ERC-20)' : item.coin_family == 4 ? ' (POL ERC-20)' : item.coin_family == 5 ? ' (SPL)' : item.coin_family == 6 ? ' (TRC-20)' : ''}</Text>)}
              </Text>
              <View style={{ flexDirection: 'row' }}>
                <Text allowFontScaling={false} style={[styles.txtValue, { color: ThemeManager.colors.placeholderBg }]}>{Singleton.getInstance().CurrencySymbol}{parseFloat(item?.currentPriceInMarket) > 0 ? CommaSeprator1(parseFloat(item?.currentPriceInMarket), 2) : '0.00'}</Text>
                {/* //item.selectedCurrencySymbol */}
                {item?.price_change_percentage_24h?.toString().includes('-') ? (
                  <View style={styles.viewStyle22}>
                    {/* <Image style={{ height: 8, width: 6, resizeMode: 'contain' }} source={Images.loss} /> */}
                    <Text
                      allowFontScaling={false}
                      style={[styles.precentText, { color: Colors.lossColor, },
                      ]}
                    >{'-'}
                    </Text>
                    <Text allowFontScaling={false} style={[styles.titleTextStyleNew, { color: Colors.lossColor, paddingLeft: 2 }]}>{item?.price_change_percentage_24h ? item?.price_change_percentage_24h.toFixed(2).toString().replace(/[-]/g, '') : 0.0}%</Text>
                  </View>
                ) : (
                  <View style={styles.viewStyle22}>
                    {/* <Image style={{ height: 8, width: 6, resizeMode: 'contain' }} source={Images.gain} /> */}
                    <Text
                      allowFontScaling={false}
                      style={[{
                        color: Colors.profitColor,
                        // fontSize: 12,
                        // paddingRight: 5,
                        marginBottom: Platform.OS == 'ios' ? 3 : 0
                      },
                      ]}
                    >{'+'}
                    </Text>
                    <Text allowFontScaling={false} style={[styles.titleTextStyleNew, { color: Colors.profitColor }]}>{item?.price_change_percentage_24h ? (item?.price_change_percentage_24h).toFixed(2) : 0.0}%</Text>
                  </View>
                )}
              </View>
            </View>


          </View>
          <View style={{ width: "25%", paddingLeft: 5 }}>
            <Text
              numberOfLines={1}
              style={[styles.txtCoin, { color: ThemeManager.colors.blackWhiteText, fontSize: 14 }]}>
              {toFixed(item?.balance, 4)} {item?.coin_symbol?.toUpperCase()}
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.txtValue, { color: ThemeManager.colors.placeholderBg, alignSelf: 'flex-start', }]}>
              {Singleton.getInstance().CurrencySymbol}{toFixed(bigNumberSafeMath(item?.balance, "*", item?.coin?.fiat_price_data?.value), 2)}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const isCloseToBottom = async () => {
    if (coinList.length < totalRecords) {
      setPage(page + 1)
    }
    getSearchList(true)
  }


  /******************************************************************************************/
  return (
    <ImageBackground
      style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      source={ThemeManager.ImageIcons.mainBgImgNew}
    >
      <HeaderMain
        BackButtonText={"Re-Order Assets"} />
      <GestureHandlerRootView style={[styles.container]}>
        <View style={styles.container2}>
          <View style={[styles.container, { paddingBottom: dimen(10) }]}>
            {coinList.length > 0 ? (
              <DraggableFlatList
                autoscrollSpeed={2000}
                data={coinList}
                showsVerticalScrollIndicator={false}
                style={{ flex: 1 }}
                renderItem={renderItem}
                onDragEnd={({ data }) => { onDragEnd(data) }}
                keyExtractor={(item, index) => item.coin_id}
                onEndReachedThreshold={0.1}
                onEndReached={() => {
                  isCloseToBottom()
                }}
              />
            ) : (
              <View style={styles.container3}>
                <Text allowFontScaling={false} style={[styles.noAsset, { color: ThemeManager.colors.grayTextColor }]}>{walletMain.noassetsfound}</Text>
              </View>
            )}

          </View>
          <View style={{ marginBottom: dimen(52), marginTop: dimen(20) }}>
            {coinList.length > 0 ? (
              <Button
                disabled={Singleton.getInstance().isMakerWallet}
                onPress={() => { updateList() }}
                buttontext={manage.updateList}
                btnstyle={styles.update}
              />
            ) : null}
          </View>
        </View>
      </GestureHandlerRootView>
      {isLoading && <LoaderView isLoading={isLoading} />}
    </ImageBackground>
  );
};

const mapStateToProp = state => {
  const { coinList } = state.walletReducer;
  return { coinList };
};
export default connect(mapStateToProp, { sortManageWallet })(Manage);
