import { generateBTCAddress } from "./BtcUtils";
import { generateEthWallet } from "./EthUtils";
import { generateLtcAddress } from "./LtcUtils";
import { saveData } from "./MethodsUtils";
/************************************** generate Addressess ************************************/
export const createWallet = async (mnemonics) => {
  try {
    //********************************** FOR ETH ************************************
    const ethWallet = await generateEthWallet(mnemonics);
    const ethAddress = ethWallet.address;
    saveData(ethAddress + '_pk', ethWallet.privateKey);
    saveData(ethAddress, mnemonics)
    //********************************** FOR BTC ************************************
    const btcWallet = await generateBTCAddress(mnemonics);
    const btcAddress = btcWallet.btcAddress;
    saveData(btcAddress + '_pk', btcWallet.btc_pvtKey);
    saveData(btcAddress, mnemonics);
    //********************************** FOR LTC ************************************
    const ltcWallet = await generateLtcAddress(mnemonics);
    const ltcAddress = ltcWallet.ltc_address;
    saveData(ltcAddress + '_pk', ltcWallet.ltcPvtKey);
    saveData(ltcAddress, mnemonics);
    return { mnemonics, ethAddress: ethAddress, btcAddress: btcAddress, ltcAddress: ltcAddress };
  } catch (e) {
    console.log('create wallet error ', e);
    return e;
  }
}
