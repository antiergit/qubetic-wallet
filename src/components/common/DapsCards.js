import { FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { Dimensions } from "react-native";
import { heightDimen } from "../../Utils";
import fonts from "../../theme/Fonts";
import { ThemeManager } from "../../../ThemeManager";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../theme";
const { width } = Dimensions.get("window");
const DapsCards = ({ data, onPress = (item) => { } }) => {
  const baseURL = "https://stage-novatide-wallet.s3.us-east-2.amazonaws.com";
  console.log(data.data, "datadatadatadata");
  return (
    <View>
      <Text
        style={{
          color: ThemeManager.colors.blackWhiteText,
          ...styles.headerName,
        }}
      >
        {data?.name}
      </Text>

      {/* <LinearGradient
        start={{ x: -0.9, y: 0.9 }}
        end={{ x: 0.9, y: 0.7 }}
        colors={ThemeManager.colors.gradientColorCard}
        style={{
          padding: heightDimen(20),
          alignSelf: "center",
          borderRadius: heightDimen(14),
        }}
      > */}
      {/* <ImageBackground
        style={{
          padding: heightDimen(20),
          alignSelf: "center",
          borderRadius: heightDimen(14),
        }}
        resizeMode="stretch"
        imageStyle={{
          height: heightDimen(150)
        }}
        source={ThemeManager.ImageIcons.headerBackground}
      > */}
      <View
        style={{
          backgroundColor: ThemeManager.colors.mnemonicsBg, padding: heightDimen(20),
          alignSelf: "center",
          borderRadius: heightDimen(14),
        }}
      >


        <FlatList
          data={data?.dapps}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  width: "50%",
                  alignItems: "flex-start",
                }}
                onPress={() => onPress(item)}
              >
                <View>
                  <Image
                    source={{ uri: `${baseURL}${item?.image}` }}
                    style={styles.iconStyle}
                  />
                </View>
                <View>
                  <Text style={{ ...styles.title, color: ThemeManager.colors.blackWhiteText, }}>{item?.dapp_name}</Text>
                  <Text
                    style={{
                      color: ThemeManager.colors.legalGreyColor,
                      maxWidth: width / 3.8,
                      fontFamily: fonts.dmRegular,
                      fontSize: heightDimen(12),
                    }}
                    numberOfLines={1}
                  >
                    {item?.about}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        />
        {/* </ImageBackground> */}
        {/* </LinearGradient> */}
      </View>
    </View>
  );
};

export default DapsCards;

const styles = StyleSheet.create({
  iconStyle: {
    height: heightDimen(40),
    width: heightDimen(40),
    borderRadius: heightDimen(40),
    marginRight: heightDimen(8),
  },
  headerName: {
    fontFamily: fonts.dmRegular,
    marginBottom: heightDimen(10),
    fontSize: heightDimen(18),
    lineHeight: heightDimen(18),
  },
  title: {
    fontFamily: fonts.dmMedium,
    marginBottom: heightDimen(5),
    fontSize: heightDimen(16),
    maxWidth: width / 3,
    color: ThemeManager.colors.blackWhiteText,
  },
});
