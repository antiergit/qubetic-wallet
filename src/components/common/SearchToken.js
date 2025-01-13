import React, { useState } from 'react';
import {
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import { ThemeManager } from '../../../ThemeManager';
import { horizontalScale, moderateScale, verticalScale } from '../../layouts/responsive';
import { Actions } from 'react-native-router-flux';
import Singleton from '../../Singleton';
import { Fonts, Images } from '../../theme';

const SearchToken = props => {
  const [istouch, setistouch] = useState(false);

  //******************************************************************************************/
  return (
    <View
      style={{
        flexDirection: "row",

        marginTop: verticalScale(20),
      }}
    >
      <View
        style={[{
          flexDirection: "row",
          borderWidth: 0.5,
          borderColor: "rgba(115, 115, 115, 0.5)",
          alignItems: "center",
          flex: 1,
          borderRadius: moderateScale(10),
          paddingHorizontal: 10,
          marginRight: 10
        }, props.viewStyle]}
      >
        <View>
          <Image
            style={[
              {
                height: 22,
                width: 22,
                resizeMode: "contain",
              },
            ]}
            source={ThemeManager.ImageIcons.searchIcon}
          />
        </View>
        <TextInput
          placeholderTextColor={"#737373"}
          placeholder="Search Assets"
          style={{
            paddingLeft: horizontalScale(5),
            color: ThemeManager.colors.blackWhiteText,
            height: moderateScale(40),

            width: '90%'
            // width: moderateScale(260),
          }}
          value={props.value}
          onChangeText={(text) => {
            props.onChangeText(text)
            //   this.setState({ search: text, fromSearch: true })
            //   this.updateSearch(text);
          }}
          onSubmitEditing={(e) => props.onSubmitEditing(e.nativeEvent?.text)
            // this.updateSearch(this.state.search)
          }
          {...props?.inputProps}

        />
      </View>
      {props.isIconsShow && <TouchableOpacity
        disabled={istouch}
        style={{ marginRight: 10 }}
        onPress={() => {
          setistouch(true)
          props.manage()
          setTimeout(() => {
            setistouch(false)
          }, 2000);

        }
        }>

        <Image
          source={ThemeManager.ImageIcons.manageIcon}
          resizeMode={"contain"}
          style={{ width: moderateScale(40), height: moderateScale(40) }}
        />
      </TouchableOpacity>}
      {props.isIconsShow && <TouchableOpacity
        disabled={istouch || Singleton.getInstance().isMakerWallet}

        style={{}}
        // onPress={() => Actions.WatchList()}
        onPress={() => {
          setistouch(true)
          Actions.currentScene != "AddressBook" &&
            Actions.AddressBook({ symbol: "all" });
          setTimeout(() => {
            setistouch(false)
          }, 2000);

        }}

      >
        <Image
          source={ThemeManager.ImageIcons.addPeopleicon}
          resizeMode={"contain"}
          style={{ width: moderateScale(40), height: moderateScale(40) }}
        />
      </TouchableOpacity>}
      {/* {props.isIconsShow && <TouchableOpacity onPress={() => props.arrangeWallet()}>

        <Image
          source={ThemeManager.ImageIcons.manageIcon}
          resizeMode={"contain"}
          style={{ width: moderateScale(40), height: moderateScale(40) }}
        />
      </TouchableOpacity>} */}

    </View>
  );
};
const PortfolioManageButton = props => {
  const [istouch, setistouch] = useState(false);

  //******************************************************************************************/
  return (
    <View
      style={{
        flexDirection: "row",

        marginTop: verticalScale(20),
      }}
    >
      <View
        style={[{
          flex: 1,
          borderRadius: moderateScale(10),
          paddingHorizontal: 10,

        }, props.viewStyle]}
      >
        <Text style={{
          color: ThemeManager.colors.blackWhiteText,
          fontSize: moderateScale(18),
          lineHeight: moderateScale(24.84),
          fontFamily: Fonts.dmMedium
        }}>Crypto</Text>
      </View>

      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => {
          props.nft()
        }}
      >
        <Image
          source={Images.nftButtonIcon}
          resizeMode={"contain"}
          style={{ width: moderateScale(40), height: moderateScale(40) }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginRight: 10 }}
        onPress={() => {
          props.manage()
        }
        }>
        <Image
          source={ThemeManager.ImageIcons.manageIcon}
          resizeMode={"contain"}
          style={{ width: moderateScale(40), height: moderateScale(40) }}
        />
      </TouchableOpacity>



    </View>
  );
};



export { SearchToken, PortfolioManageButton };



