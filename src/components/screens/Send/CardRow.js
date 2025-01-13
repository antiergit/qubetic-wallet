import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { ThemeManager } from "../../../../ThemeManager";
import { getDimensionPercentage as dimen } from "../../../Utils";
import fonts from "../../../theme/Fonts";

const CardRow = (props) => {
  return (
    <View style={styles.row}>
      <Text
        style={[styles.text1, { color: ThemeManager.colors.darkLighttext }]}
      >
        {props.text1}
      </Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {props.imageData && (
          <TouchableOpacity onPress={props?.onImgClicked}>
            <Image source={props.imageData} style={styles.imgStyle} />
          </TouchableOpacity>
        )}
        <Text
          {...(props?.isAddressTxt && {
            ellipsizeMode: "middle",
            numberOfLines: 1,
          })}
          ellipsizeMode="middle"
          style={[
            styles.text1,
            { color: ThemeManager.colors.blackWhiteText },
            props?.isAddressTxt && { width: "80%", textAlign: "right" },
            props?.text2Style,
          ]}
        >
          {props.text2}
        </Text>
      </View>
    </View>
  );
};

export default CardRow;

const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginHorizontal: dimen(16),
    marginTop: dimen(20),
  },
  text1: {
    fontSize: dimen(15),
    fontFamily: fonts.dmMedium,
  },
  imgStyle: {
    height: dimen(18),
    width: dimen(18),
    marginRight: dimen(10),
  },
});
