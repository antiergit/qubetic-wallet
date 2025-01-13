import React, { useCallback, useState, useMemo } from "react";
import { FlatList, Text, View } from "react-native";
import { LanguageManager } from "../../../../LanguageManager";
import { ThemeManager } from "../../../../ThemeManager";
import { Images } from "../../../theme";
import { getDimensionPercentage } from "../../../Utils";
import { HeaderMain, InputtextSearch } from "../../common";
import GradentCardView from "../../common/GradentCardView";
import { styles } from "./styles";
import { Actions } from "react-native-router-flux";

const SelectChain = (props) => {
  const coinList = [
    { symbol: "BTC", name: "BTC", coin_name: "Bitcoin", icon: Images.btc, coin_family: 3 },
    { symbol: "TRX", name: "TRX", coin_name: "Tron", icon: Images.tron, coin_family: 6 },
    { symbol: "ETH", name: "ETH", coin_name: "Ethereum", icon: Images.eth, coin_family: 2 },
    { symbol: "BNB", name: "BSC", coin_name: "Binance Smart Chain", icon: Images.bnb, coin_family: 1 },
  ]
  const { makerchecker } = LanguageManager;
  const screenParams = props;
  const isFromManageWallet = screenParams?.isFromManageWallet;
  const isMakerWallet = screenParams?.walletType == "makerWallet";
  const [coinData, setCoinData] = useState(coinList);
  const [searchText, setSearchText] = useState("");

  const onPressCain = useCallback((index, item) => {
    if (isMakerWallet) {
      Actions.CreateMakerAccount({ selectedChain: item, isFromManageWallet })
    } else {
      Actions.ImportWalletByPrivateKey({ selectedChain: item, isFromManageWallet })
    }
  }, []);

  const filterCoinList = (text) => {
    let list = coinList.filter(res => res.coin_name?.toLowerCase().startsWith(text.toLowerCase()) || res.name?.toLowerCase().startsWith(text.toLowerCase()))
    setCoinData(list)
  }

  const ListHeaderComponent = useMemo(() => {
    return (
      <View>
        <InputtextSearch
          style={{ width: '100%' }}
          placeholder={LanguageManager.walletMain.search}
          returnKeyType={'done'}
          value={searchText}
          search={true}
          clear={searchText != "" ? true : false}
          pressClear={() => {
            setSearchText("")
            filterCoinList("")
          }}
          onChangeNumber={text => {
            setSearchText(text)
            filterCoinList(text)
          }}
          onSubmitEditing={() => {
            filterCoinList(searchText)
          }}
          maxLength={15}
          inputStyle={{ fontSize: 14 }}
        />
        <Text
          style={[
            styles.createMArkerStyle,
            { color: ThemeManager.colors.blackWhiteText },
          ]}
        >
          {makerchecker.createMarkerWallet}
        </Text>
      </View>
    );
  }, [searchText]);

  const renderItem = useCallback(({ item, index }) => {
    return (
      <GradentCardView
        leftIcon={item.icon}
        title={item.name}
        subTitle={item.coin_name}
        onPress={() => onPressCain(index + 1, item)}
      />
    );
  }, [onPressCain,]);

  return (
    <View style={[{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }]}>
      <HeaderMain BackButtonText={LanguageManager.makerChecker.selectChain} />
      <View style={[styles.maincontainer]}>
        <FlatList
          data={coinData}
          // contentContainerStyle={{ paddingTop: getDimensionPercentage(24) }}
          ListHeaderComponent={ListHeaderComponent}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ItemSeparatorComponent={() => (
            <View style={{ height: getDimensionPercentage(10) }} />
          )}
        />
      </View>
    </View>
  );
};

export default SelectChain;
