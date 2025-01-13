import { StyleSheet } from "react-native";
import { dimen } from "../../../Utils";
import { Fonts } from "../../../theme";

const styles = StyleSheet.create({
    mainView: {
        flex: 1,
    },
    emptyWalletConnectionView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: dimen(50)
    },
    emptyWalletConnectionText: {
        fontSize: 24,
        fontFamily: Fonts.dmMedium,
        lineHeight: 32,
        textAlign: 'center',
        marginTop: dimen(20)
    },
    dappImage: {
        height: dimen(70),
        width: dimen(70),
        borderRadius: dimen(14)
    },
    dappName: {
        fontSize: 20,
        fontFamily: Fonts.dmBold,
        lineHeight: 30,
        textAlign: 'center',
        marginTop: dimen(20)
    },
    ethWallet: {
        fontSize: 14,
        fontFamily: Fonts.dmMedium,
        lineHeight: 18.23,
        textAlign: 'center',
        marginVertical: dimen(10)
    },
    dappUrl: {
        fontSize: 14,
        fontFamily: Fonts.dmMedium,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: dimen(10)
    },
    activeConnectionsText: {
        fontSize: 14,
        fontFamily: Fonts.dmMedium,
        lineHeight: 18.23,
        textAlign: 'center',
    }
})
export default styles;

