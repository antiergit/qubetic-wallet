import React, { Component } from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { PieChart } from 'react-native-svg-charts';
import { ThemeManager } from '../../../ThemeManager';
import { Colors, Fonts } from '../../theme';
import { LanguageManager } from '../../../LanguageManager';
import { getDimensionPercentage as dimen, heightDimen, widthDimen } from '../../Utils';

export class AllocationGraph extends Component {
  constructor(props) {
    super(props);
  }
  /******************************************************************************************/
  render() {
    const { commonText } = LanguageManager;

    return (

      <View style={[{
        flex: 1,
      }]}>
        <View
          style={{
            flex: 1,
            alignSelf: "center",
            justifyContent: 'center',
            alignItems: 'center',
            // marginTop: Platform.OS == 'ios' ? dimen(30) : dimen(75),
            // marginBottom: 20,
            shadowOpacity: 0.3, // Shadow opacity
            shadowRadius: 4, // Shadow radius
            flex: 1

          }}>

          <PieChart
            style={styles.pieChart}
            data={this.props?.pieData}
            outerRadius="95%"
            innerRadius="49%"
            padAngle={0.02}
            animate={true}
          />
        </View>
      </View>
    );
  }
}

/******************************************************************************************/
const styles = StyleSheet.create({
  ViewStyle: {
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    marginBottom: 25,
  },
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: heightDimen(Platform.OS == 'ios' ? 20 : 10),
    // marginBottom:  heightDimen( Platform.OS == 'ios' ? 25 : 5),
    flex: 1,
    borderRadius: 110,
    // width: 210,
    // height: 230,
  },
  container1: {
    zIndex: 16,
    position: 'absolute',
    // top: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: widthDimen(154),
    width: widthDimen(154),
    borderRadius: widthDimen(80),
    // backgroundColor:"red",
    overflow: "hidden",
    borderWidth: 1,

    // flex:1,

  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.dmRegular,
  },
  title1: {
    fontSize: dimen(22),
    fontFamily: Fonts.dmExtraBold,
    marginTop: -5,
    lineHeight: dimen(33),
  },
  pieChart: {
    height: 150,
    width: 150,
  },
});
