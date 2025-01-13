import { StyleSheet } from 'react-native'
import { Fonts } from '../../../theme'
import { dimen } from '../../../Utils'
export const styles = StyleSheet.create({
  mainView: {
    flex: 1,
  },
  tabText: {
    fontFamily: Fonts.dmSemiBold,
    marginBottom: dimen(11),
    fontSize: dimen(16),
    marginTop: dimen(24),
    textTransform: 'capitalize'
  },
  tabView: {
    borderBottomWidth: dimen(2),
    flex: 0.5,
    alignItems: "center",
    marginBottom: dimen(30),
  },
  payText: {
    fontFamily: Fonts.dmMedium,
    marginBottom: dimen(10),
    fontSize: dimen(14),
  },
  spaceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  receiveView: {
    marginTop: dimen(20),
    marginBottom: dimen(10)
  },
  buttonStyle: {
    marginBottom: dimen(50),
    marginHorizontal: dimen(24),
  },
});