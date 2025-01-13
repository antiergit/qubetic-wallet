import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Header, LoaderView } from '../../common';
import { ThemeManager } from '../../../../ThemeManager';
import styles from './CardTransactionHistoryStyle';
import { Fonts, Images } from '../../../theme';
import { useDispatch } from 'react-redux';
import { getCardHistory } from '../../../Redux/Actions';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { getTransactionStatus, getTransactionType } from '../../../Utils';
import { exponentialToDecimal, toFixedExp } from '../../../Utils/MethodsUtils';
import { LanguageManager } from '../../../../LanguageManager';

const CardTransactionHistory = props => {
  const { merchantCard } = LanguageManager;
  const [cardHistory, setCardHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // const key = [{ "tx_id": "202309100138010071010813", "description": "REAL CDN. WHOLESALE #6", "debit": "1.83000000", "credit": "0.00000000", "fee": "0.00000000", "type": 1, "tx_currency": "CAD", "tx_amount": "2.49000000", "status": 1, "transaction_date": "1694281076", "posting_date": "1694281076", "mc_trade_no": "" }, { "tx_id": "202309100118513111920237", "description": "DOLLARAMA #1139", "debit": "3.95000000", "credit": "0.00000000", "fee": "0.00000000", "type": 1, "tx_currency": "CAD", "tx_amount": "5.37000000", "status": 1, "transaction_date": "1694279925", "posting_date": "1694279925", "mc_trade_no": "" }, { "tx_id": "202309090753099511515552", "description": "TRACY'S NO FRILLS #365", "debit": "5.80000000", "credit": "0.00000000", "fee": "0.00000000", "type": 1, "tx_currency": "CAD", "tx_amount": "7.89000000", "status": 1, "transaction_date": "1694217183", "posting_date": "1694217183", "mc_trade_no": "" }, { "tx_id": "202309090751578053418476", "description": "TRACY'S NO FRILLS #365", "debit": "1.10000000", "credit": "0.00000000", "fee": "0.00000000", "type": 1, "tx_currency": "CAD", "tx_amount": "1.49000000", "status": 1, "transaction_date": "1694217111", "posting_date": "1694217111", "mc_trade_no": "" }, { "tx_id": "202309090750517202959516", "description": "TRACY'S NO FRILLS #365", "debit": "7.03000000", "credit": "0.00000000", "fee": "0.00000000", "type": 1, "tx_currency": "CAD", "tx_amount": "9.57000000", "status": 1, "transaction_date": "1694217044", "posting_date": "1694217044", "mc_trade_no": "" }, { "tx_id": "202309090739475920761628", "description": "REAL CDN. WHOLESALE #6", "debit": "22.05000000", "credit": "0.00000000", "fee": "0.00000000", "type": 1, "tx_currency": "CAD", "tx_amount": "30.00000000", "status": 2, "transaction_date": "1694216381", "posting_date": "1694216381", "mc_trade_no": "" }, { "tx_id": "202309072319287368264612", "description": "", "debit": "0.00000000", "credit": "12.00000000", "fee": "0.00000000", "type": 2, "tx_currency": "", "tx_amount": "0.00000000", "status": 1, "transaction_date": "1694099968", "posting_date": "1694099968", "mc_trade_no": "dGYUDdTMyiNjtPcQ4XO3Rs1" }, { "tx_id": "202309071113404598049832", "description": "", "debit": "0.00000000", "credit": "10.00000000", "fee": "0.00000000", "type": 2, "tx_currency": "usd", "tx_amount": "10.00000000", "status": 1, "transaction_date": "1694099620", "posting_date": "1694099620", "mc_trade_no": "" }]
    // setCardHistory(key)
    setLoading(true);
    if (props.usCardData?.card_type?.toLowerCase() == 'us_preferred' || props.usCardData?.card_type?.toLowerCase() == 'physical') {
      dispatch(getCardHistory({ end_time: moment(new Date()).format('MMYYYY'), start_time: moment(new Date()).subtract(5, 'months').format('MMYYYY'), cardId: props.usCardData?.card_id })).then(resCardHistory => {
        setLoading(false);
        setCardHistory(resCardHistory.data);
      }).catch(err => {
        setLoading(false);
        console.log('err::::::', err);
      });
    } else {
      dispatch(getCardHistory({ end_time: moment(new Date()).format('MMYYYY'), start_time: moment(new Date()).subtract(5, 'months').format('MMYYYY'), })).then(resCardHistory => {
        setLoading(false);
        setCardHistory(resCardHistory.data);
      }).catch(err => {
        setLoading(false);
        console.log('err::::::', err);
      });
    }

  }, []);

  /******************************************************************************************/
  const renderItemHistory = ({ item, index }) => {
    return (
      <View style={styles.renderHistoryMainView}>
        <View style={styles.renderHistoryImageContainer}>
          <FastImage style={styles.renderHistoryImage} source={parseFloat(item?.credit) > 0 ? Images.receive_bg : Images.send_bg} />
        </View>
        <View style={styles.centerContainer}>
          <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText, textTransform: 'capitalize' }]}>
            {getTransactionType(item?.type)}
            <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText, textTransform: 'capitalize', fontSize: 14 }]}>{item.description != '' ? `(${item.description.length > 13 ? item.description.slice(0, 13) + '...' : item.description})` : ''}</Text>
          </Text>
          <Text allowFontScaling={false} style={[styles.fromStatusStyle, { color: ThemeManager.colors.lightText, textTransform: 'capitalize' }]}>{merchantCard.transaction} {getTransactionStatus(item?.status)}</Text>
        </View>
        <View style={styles.priceAndDateContainer}>
          <Text allowFontScaling={false} style={[styles.fromRechargeStyle, { color: ThemeManager.colors.whiteText }]}>{toFixedExp(parseFloat(toFixedExp(exponentialToDecimal(item?.credit), 8)) > 0 ? parseFloat(toFixedExp(exponentialToDecimal(item?.credit), 8)) : parseFloat(toFixedExp(exponentialToDecimal(item.debit), 8)), 8)}{' '}{props.currency}</Text>
          <Text allowFontScaling={false} style={[styles.fromStatusStyle, { color: ThemeManager.colors.lightText }]}>{moment.unix(item.transaction_date).format('MMM DD, YYYY')}</Text>
        </View>
      </View>
    );
  };

  /******************************************************************************************/
  return (
    <View style={{ flexGrow: 1, backgroundColor: ThemeManager.colors.Mainbg }}>
      <Header BackButtonText={merchantCard.transactionHistory} bgColor={{ backgroundColor: ThemeManager.colors.colorVariation }} />
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <FlatList
            bounces={false}
            data={cardHistory}
            showsVerticalScrollIndicator={false}
            renderItem={renderItemHistory}
            keyExtractor={(item, index) => index + ''}
            ListEmptyComponent={() => {
              return (
                <View style={{ height: Dimensions.get('screen').height / 1.3, justifyContent: 'center' }}>
                  <Text allowFontScaling={false} style={[styles.transactionHistoryTitle, { color: ThemeManager.colors.whiteText, alignSelf: 'center', fontFamily: Fonts.dmMedium }]}>{merchantCard.noTransactionHistoryFound}</Text>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
      <LoaderView isLoading={loading} />
    </View>
  );
};

export default CardTransactionHistory;
