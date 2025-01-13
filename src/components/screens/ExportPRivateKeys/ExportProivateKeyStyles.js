import { StyleSheet } from 'react-native';
import { Fonts } from '../../../theme';
import { getDimensionPercentage as dimen, getDimensionPercentage, heightDimen, widthDimen } from '../../../Utils';

export default StyleSheet.create({
    mainView: {
        flex: 1,

    },
    mainViewStyle: {
        flex: 1,
        paddingHorizontal: dimen(24),
        marginTop: heightDimen(30),
        marginBottom: heightDimen(30),
    },
    imageSymbolContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: heightDimen(10) },
    imageStyle: { height: heightDimen(27), width: widthDimen(27), resizeMode: 'contain', borderRadius: getDimensionPercentage(15) },
    symbolText: { marginLeft: widthDimen(10), fontSize: dimen(16), fontFamily: Fonts.dmMedium, },
    keyText: { fontSize: dimen(14), fontFamily: Fonts.dmMedium, },
    headingText: { fontSize: dimen(24), fontFamily: Fonts.dmMedium, lineHeight: dimen(36), textAlign: "center", marginTop: dimen(15) },

});
