import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import {
  getDimensionPercentage as dimen,
  heightDimen,
  widthDimen,
} from "../../Utils";
import { ThemeManager } from "../../../ThemeManager";
import { Fonts } from "../../theme";
import { BlurView } from "@react-native-community/blur";

const CommonModal = (props) => {
  return (
    <View>
      <SwipeUpDownModal
        MainContainerModal={[{ backgroundColor: ThemeManager.colors.blurBg }, props.mainContainerModal]}
        modalVisible={props.visible}
        ContentModal={
          <>
            <Pressable style={styles.centeredView}>
              <View
                style={[
                  styles.modalView,
                  {
                    minHeight:
                      Dimensions.get("window").height <= 800 ? 270 : 290,
                    backgroundColor: ThemeManager.colors.mnemonicsBg,
                  },
                ]}
              >
                <View style={styles.mainStyle}>
                  {/* {<View style={styles.swipeTopLine}></View>} */}
                  {props.children}
                </View>
              </View>
            </Pressable>
          </>
        }
        HeaderContent={props.headerContent}
        onClose={props.onClose}
        onRequestClose={props.onRequestClose}
      ></SwipeUpDownModal>
    </View>
  );
};
export default CommonModal;
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalView: {
    minHeight: 400,
    // position: "relative",
    // overflow: "hidden",
    borderTopRightRadius: dimen(14),
    borderTopLeftRadius: dimen(14),
    // borderWidth: 1,
    borderColor: ThemeManager.colors.addressBookDropBorederColor,
    // paddingTop: 8,
  },
  mainStyle: {
    // alignItems: 'center',
    marginHorizontal: dimen(24),
  },
  swipeTopLine: {
    backgroundColor: ThemeManager.colors.sheetTopLine,
    height: 5,
    width: 40,
    borderRadius: 3,
    marginTop: dimen(10),
  },
  logo: {
    height: dimen(105),
    width: dimen(101),
    resizeMode: "contain",
    marginTop: dimen(24),
  },
  headingStyle: {
    fontSize: dimen(18),
    lineHeight: dimen(22),
    paddingHorizontal: dimen(50),
    color: ThemeManager.black,
    fontFamily: Fonts.dmBold,
    textAlign: "center",
    marginTop: dimen(12),
  },
  buttonstyle: {
    backgroundColor: ThemeManager.colors.settingsText,
    width: "100%",
  },
  btnViewModal: {
    marginTop: dimen(32),
  },
});
