import { BlurView } from "@react-native-community/blur";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import { LanguageManager } from "../../../LanguageManager";
import { ThemeManager } from "../../../ThemeManager";
import { dimen, heightDimen, widthDimen } from "../../Utils";
import { Fonts } from "../../theme";
import { HeaderMain } from "./HeaderMain";
import { InputtextSearch } from "./InputTextSearch";
import { SvgUri } from "react-native-svg";

const ModalList = ({
  openModel,
  handleBack,
  title,
  list,
  onPress,
  noStyle,
  isResetSearchOnBack
}) => {
  const { commonText } = LanguageManager;
  const [searchQuery, setSearchQuery] = useState("");

  // Filter the list only when there is a search query; otherwise, return the full list
  const filteredList = searchQuery
    ? list.filter((item) =>
      (item?.currency_code || item?.currency)
        ?.toLowerCase()
        .includes(searchQuery?.toLowerCase()?.trim())
    )
    : list;

  useEffect(() => {
    if (!openModel && isResetSearchOnBack) {
      setSearchQuery("")
    }
  }, [isResetSearchOnBack, openModel]);

  return (
    <Modal
      statusBarTranslucent
      animationType="fade"
      transparent
      visible={openModel}
      onRequestClose={handleBack}
    >
      <ImageBackground
        source={ThemeManager.ImageIcons.mainBgImgNew}
        style={{ flex: 1, backgroundColor: ThemeManager.colors.mainBgNew }}
      >
        <View
          style={[
            styles.centeredView,
          ]}
        >
          <HeaderMain backCallBack={handleBack} BackButtonText={title} />
          <InputtextSearch
            placeholder={LanguageManager.commonText.Search}
            value={searchQuery}
            onChangeNumber={(text) => setSearchQuery(text.trimStart())}
            search={!searchQuery}
            pressClear={() => setSearchQuery("")} // Clear the search input and reset the list
          />
          <FlatList
            bounces={false}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            data={filteredList}
            style={styles.flatList}
            ListEmptyComponent={() => (
              <View style={[styles.emptyView1, noStyle]}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.noListText,
                    { color: ThemeManager.colors.blackWhiteText },
                  ]}
                >
                  {commonText.NoListFound}
                </Text>
              </View>
            )}
            renderItem={({ item }) => <ListItem item={item} onPress={onPress} />}
          />
        </View>
      </ImageBackground>
    </Modal>
  );
};

const ListItem = ({ item, onPress }) => {
  const [isSvgValid, setIsSvgValid] = useState(true);

  const onSvgErr = (e) => {
    console.log(e.message);
    if (e.message) {
      setIsSvgValid(false);
    }
  };

  return (
    <View
      style={[styles.imageBackground, { backgroundColor: ThemeManager.colors.mnemonicsBg }]}
    >
      <TouchableOpacity onPress={() => onPress(item)} style={styles.viewStyle}>
        <View style={styles.itemContainer}>
          {(!!item?.image || !!item?.coin_image) && isSvgValid ? (
            item?.image?.includes(".svg") ? (
              <SvgUri
                height={heightDimen(26)}
                width={heightDimen(26)}
                uri={item?.image || item?.coin_image}
                style={[styles.imgCoin]}
                stroke={ThemeManager.colors.primaryColor}
                onError={onSvgErr}
              />
            ) : (
              <FastImage
                resizeMode="contain"
                style={[styles.imgCoin]}
                source={{
                  uri: item?.image || item?.coin_image,
                }}
              />
            )
          ) : (
            <View
              style={[
                styles.viewStyle2,
                { backgroundColor: ThemeManager.colors.primaryColor },
              ]}
            >
              <Text
                allowFontScaling={false}
                style={[
                  styles.coinInitialText,
                  { color: ThemeManager.colors.whiteBlacktext },
                ]}
              >
                {item?.currency_code?.charAt(0)}
              </Text>
            </View>
          )}
          <Text
            allowFontScaling={false}
            style={[
              styles.coinNameText,
              { color: ThemeManager.colors.blackWhiteText },
            ]}
          >
            {item?.currency_code || item?.currency}
            {item?.show_network_icon && (
              <Text
                style={{
                  color: ThemeManager.colors.lightGrayTextColor,
                }}
              >{` | ${item?.network_label}`}</Text>
            )}
          </Text>
        </View>
        <Image style={{ tintColor: ThemeManager.colors.blackWhiteText }} source={ThemeManager.ImageIcons.forwardIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default ModalList;

const styles = StyleSheet.create({
  blurView: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  centeredView: {
    flex: 1,
    width: "100%",
  },
  emptyView1: {
    alignSelf: "center",
    marginTop: Dimensions.get("screen").height / 3.5,
  },
  flatList: {
    marginBottom: heightDimen(20),
    marginTop: heightDimen(12),
  },
  imageBackground: {
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 10,
    marginHorizontal: 15,
    padding: 5,
  },
  viewStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: dimen(4),
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imgCoin: {
    width: widthDimen(33),
    height: heightDimen(33),
    borderRadius: dimen(30),
    resizeMode: "contain",
    alignSelf: "center",
  },
  viewStyle2: {
    height: widthDimen(33),
    width: widthDimen(33),
    borderRadius: widthDimen(33 / 2),
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  coinInitialText: {
    fontSize: dimen(16),
    fontFamily: Fonts.dmRegular,
  },
  coinNameText: {
    marginLeft: dimen(8),
    fontSize: dimen(16),
    fontFamily: Fonts.dmRegular,
    textAlign: "center",
  },
  noListText: {
    fontFamily: Fonts.dmSemiBold,
    fontSize: dimen(15),
    textAlign: "center",
    marginTop: dimen(10),
  },
});
