import { Platform, StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';
import { ThemeManager } from '../../../../ThemeManager';
import { dimen, hasNotchWithIOS, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
    mainImg: {
        height: heightDimen(229),
        width: widthDimen(381),
        alignSelf: "center",
        borderRadius: dimen(14),
        resizeMode:"contain"
    },
    description: {
        fontFamily: Fonts.dmRegular,
        fontSize: 14,
        lineHeight: 24,
        marginHorizontal: 24,
        marginTop: 14
    },
    ViewStyle1: {
        // height:heightDimen(221),
        width: widthDimen(382),
        alignSelf: "center",
        borderRadius: dimen(14),
        marginTop: heightDimen(20)
    },
    btnView:{
        marginHorizontal: 24,
         marginBottom: hasNotchWithIOS() ? dimen(52) : dimen(30)
    }


});
