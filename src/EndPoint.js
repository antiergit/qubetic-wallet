export const IS_PRODUCTION = 1;
const MAIN_URL = "https://stage-wallet-api.qubetics.work"
export const BASE_URL = `${MAIN_URL}/api/v1/`;

export const BASE_IMAGE_URL = IS_PRODUCTION == 0 ? 'https://stage-novatide-wallet.s3.us-east-2.amazonaws.com' : 'https://stage-novatide-wallet.s3.us-east-2.amazonaws.com';
/**************************************USER APIs****************************************************/
export const REGISTER_API = 'user/register';
export const LOGIN_API = 'user/create/wallet';
export const API_ADD_ADDRESS = 'user/add_address_book';
export const API_SEARCH_WALLET_NAME = 'user/get_wallet_name';
export const API_SEARCH_CONTACT_NAME = 'user/search';
export const API_GET_ADDRESS = 'user/address_book';
export const API_NOTIFICATIONS_LIST = 'user/notification/list';
export const API_DELETE_ADDRESS_BOOK = 'user/delete_address_book_wallet_address';
export const API_DELETE_CONTACT = 'user/delete_address_book';
export const API_LOGOUT = 'user/logout';
export const API_ANNOUNCEMENTS = 'makerChecker/notifications';
export const API_ANNOUNCEMENTS_STATUS = 'user/announcement/view_status';

/**************************************WALLET APIs****************************************************/
export const GET_COIN_LIST_API = 'wallet/portfolio';
export const GET_COIN_LIST_API_MERCURYIO = 'wallet/mercuroSupportedCoins';
export const IMPORT_MERCURYO_COINS = 'wallet/import_mercuro_coins_in_wallet';
export const COIN_GRAPH_API = 'wallet/coinGraphData';
export const TOOGLE_COIN_LIST = 'wallet/toggleCoinList';
export const ACTIVE_INACTIVE_COIN = 'wallet/activeinactive';
export const LISTING_WALLET = 'wallet/walletList';
export const UPDATE_COIN_LIST_API = 'wallet/getUpdateUserCoinBalances';
export const TRANSACTION_LIST_API = 'wallet/transaction/list';
export const GET_TRANSACTION_DETAIL_API = 'wallet/transaction/details';
export const SEARCH_CUSTOM_TOKEN_API = 'wallet/search';
export const ADD_CUSTOM_TOKEN_API = 'wallet/addtoken';
export const SWAP_COIN_LIST = 'wallet/swap/coinlist';
export const API_MANAGE_WALLET = 'wallet/order/update';
export const API_CURRENCY = 'wallet/currencyfiatlist';
export const COIN_DETAIL = 'wallet/coin/details';
export const NATIVE_PRICE = 'wallet/nativeCoinFiatPrice';
export const GET_WATCH_LIST = 'wallet/getWatchlist';
export const UPDATE_WATCH_LIST = 'wallet/updateWatchlist';
export const DOWNLOAD_CSV = 'wallet/transaction/downloadcsv/';
export const FIAT_VAL = 'wallet/getFiatPrice';
export const GET_REALTIME_BAL = 'wallet/rpcBalance';
export const UPDATE_CRYPTO_BALANCE = 'wallet/updateBalance';
export const COIN_DETAILS = 'wallet/coinWalletDetail';
export const GET_FEE_LIMIT = 'wallet/fee';
export const NATIVE_COIN_BALANCE = 'wallet/nativeCoinBalance';
export const NATIVE_PRICE_ALERT = 'wallet/checkFiatBalance';
export const GET_DAPP_LIST = 'dapp/list'

/**************************************GECKO APIs****************************************************/
export const GECKO_SYMBOL_URL = 'https://api.coingecko.com/api/v3/coins/list';
// export const API_MYWALLETS = 'wallet/mywallet';
/**************************************SWFT APIs****************************************************/
export const API_SWFT_GET_COINLIST = 'swftc/queryCoinList';
export const API_SWFT_LAST_PAIRS = 'swftc/queryCoinData';
export const API_SWFT_COININFO = 'swftc/getBaseInfo';
export const API_SWFT_ACCOUNT_EXCHANGE = 'swftc/accountExchange';
export const API_GET_ORDER_DETAIL = 'https://www.swftc.info/api/v2/queryOrderState';
export const SWFT_LIST = 'SWFTC/get_data';

/**************************************REFRESHTOKEN APIs****************************************************/
export const API_REFRESHTOKEN = 'auth/authorisation';

//*******************************************ON_CHAIN_SWAP_LIST**********************************************/
export const ON_CHAIN_SWAP_LIST = 'wallet/swap_coinlist';
export const GET_SWAP_AMOUNT_DIFF_URL = 'wallet/fetchValue';
export const CHAINGE_CHAIN_LIST = 'wallet/chainge/supportChains';
export const CHAINGE_CHAIN_PRICE_QUERY = 'wallet/chainge/crossChainQuote';
export const CHAINGE_CHAIN_GET_TRANSFER_MINT_RAW = 'wallet/chainge/getTransferToMinterRaw';
export const CHAINGE_CHAIN_SUBMIT_RAW = 'wallet/sendToken';

//******************************************* ALCHEMY **********************************************/
export const AL_GET_MY_TOKEN = '/wallet/alchemy/getToken';
export const AL_FIAT_LIST = '/wallet/alchemy/fiat_list';
export const AL_CRYPTO_LIST = '/wallet/alchemy/crypto_list';
export const AL_PRICE_QUERY = '/wallet/alchemy/order_quote';
export const AL_CREATE_ORDER = '/wallet/alchemy/createOrder';

//******************************************* Swap support for add custom token **********************************************/
export const SWAP_SUPPORT = '/wallet/swapSupported';

//******************************************* priceAlert API's **********************************************/
export const API_DELETE_PRICE_ALERT = 'price_alert/delete';
export const API_ADD_PRICE_ALERT = 'price_alert/add';
export const API_GET_PRICE_ALERT = 'price_alert/get';
export const API_GET_LIST = 'price_alert/coins';

//******************************************* RPC Url API's **********************************************/
export const API_GET_RPC_URL = 'wallet/rpcUrl';

//******************************************* Alchemy API's **********************************************/
export const API_GET_SIGN = 'alchemy/encrypt';
export const ORDER_INIT_ALCHEMY_URL = "on_off_ramp/alchemy/initaiteTx";
export const API_GET_BUYSELL_STATUS = "alchemy/getBuySell";
export const API_FIAT_LIST_ALCHEMY = "alchemy/fiat_list";
export const API_CONVERSION_ALCHEMY = "alchemy/order_quote";
export const ALCHEMY_WEBHOOK = IS_PRODUCTION == 0 ? 'https://stage-api.triskel-cap.com/api/v1/on_off_ramp/alchemy_webhook' : 'https://api.triskel-cap.com/api/v1/on_off_ramp/alchemy_webhook';

//******************************************* ON OFF RAMP API's **********************************************/
export const API_SUPPORTED_RAMP_FIAT_LIST = 'on_off_ramp/fiat_list';
export const API_CONVERSION_RAMP = 'on_off_ramp/fetch_price';
export const ORDER_INIT_URL = "on_off_ramp/initiateTx";
//******************************************* Referral API's **********************************************/
export const API_GET_REFERRAL_STATUS = 'referral/check_device_id';

//*****************************************Cards virtual****************************************************/
export const SEND_MOBILE_OTP = 'card/mobile_otp';
export const SEND_EMAIL_OTP = 'card/email_otp';
export const VERIFY_OTP = 'card/verify_otp';
export const SAVE_USER_DATA_VIRTUAL = 'card/user_data';
export const CARD_STATUS = 'card/view_card_status';
export const CARD_FEES = 'card/cardFeesData';
export const APPLY_CARD = 'card/card_applied';
export const GET_CARD_DETAILS = 'card/card_details';
export const GET_CARD_HISTORY = 'card/deposit_history';
export const GET_COUNTRY_CODES = 'card/get_country_codes';
export const GET_MINIMUM_RECHARGE_AMOUNT = 'card/fee_details';
export const CALCULATE_DEPOSIT = 'card/liminalCalculator';

//***************************************** US Preferred Cards****************************************************/
export const GET_ALL_CARDS = 'card/all_cards';
export const GET_SUPPORTED_COINLIST = 'card/supportedCoin';
export const USER_DETAILS = '/card/user_details';
export const USP_CARD_STATUS = 'card/view_status';
export const UPLOAD_KYC_DETAILS = 'card/upload_kyc_details'

//*****************************************Cards Physical****************************************************/
export const SAVE_SHIPPING_ADDRESS = 'card/shipping_data';
export const PHYSICAL_CARD_STATUS = 'card/view_status'; //'card/physical_view_status';
export const BIND_PHYSICAL_CARD = 'card/binding';
export const CARD_FEES_PHYSICAL = 'card/physical/cardFeesData';
export const GET_MINIMUM_RECHARGE_AMOUNT_PHYSICAL = 'card/physical/fee_details';
export const USER_KYC = 'card/kyc_details';
export const UPLOAD_FILE = 'card/upload_image';

//*****************************************Contact US****************************************************/
export const CONTACT_US = 'user/contact_us';
export const UPLOAD_IMAGE = 'user/file_upload';
export const QUERY_API = 'user/queries';

//*****************************************LANGUAGE****************************************************/
export const GET_DEFAULT_LANGUAGE = 'user/get_language';
export const UPDATE_LANGUAGE = 'user/update_language';
export const GET_LANGUAGE = 'user/app_language';

//*****************************************Referral****************************************************/
export const GET_ROADMAP = 'referral/roadmap';
export const CREATE_LIMINAL_ADDRESS = 'referral/create_liminal_address';
export const GET_REF_DETAILS = 'referral/rewards';
export const REFERRAL_HISTORY = 'referral/withdraw_history';
export const REFERRAL_COUNTS = 'referral/counts_left';
export const SIGN_CONTRACT = 'referral/sign_contract';
export const REFERRAL_USER_STATUS = 'referral/user_status';
export const UPDATE_REF_CODE = 'referral/update_referral_code';
export const CLAIM_REWARD = 'referral/claim_rewards';
export const GET_REF_TYPE = 'referral/user_level';
export const GET_LEVEL_DETAIL = 'referral/level_detail';
//*****************************************1inch****************************************************/

export const INCH_COMMISSION_DATA = 'on-chain/commision_data';
export const INCH_TOKENLIST = 'on-chain/tokens';
export const INCH_GET_QUOTE = 'on-chain/quote';
export const INCH_CHECK_ALLOWANCE = 'on-chain/allowance';
export const INCH_SWAP = 'on-chain/swap';
export const INCH_SPENDER = 'on-chain/spender';
export const GET_REFERRAL_LIST = 'user/reward_list'

//*****************************************matcha (0x)****************************************************/
export const API_GASLESS_SWAP_LIST = 'chain/ethereum/gaslessTokens';
export const MATACHA_BASE_URL = 'https://api.0x.org/tx-relay/v1/swap/';
export const API_GET_MATACHA_PRICE = 'chain/';
export const API_ALL_WALLET_BALANCE = 'wallet/allBalances';


//*****************************************CHECKER MAKER****************************************************/
export const API_CHECKER_CODE = 'checker/codes';
export const API_CHECKER_CODE_REFRESH = 'checker/refreshCode';
export const API_MAKER_ACCOUNT = 'maker/createAccount';
export const API_MAKER_REQ_STATUS = 'maker/getDetails';
export const API_MAKER_AUTH_TOKEN = 'maker/getToken';
export const API_CHECKER_REQUESTS = 'checker/getRequests';
export const API_CHECKER_REQ_UPDATE = 'checker/updateStatus';
export const API_MAKER_SEND_TRANSAC = 'maker/makeTrnxRequest';
export const API_MAKER_APPROVAL_REQUEST = 'maker/makeTrnxApprovalRequest';
export const API_MAKER_CHECKER_NOTIF = 'makerChecker/notifications';
export const API_MAKER_DETAILS_UPDATE = 'maker/editDetails';


//*****************************************CHANGELLY CROSS CHAIN****************************************************/
export const API_CHANGELLY_COIN_LIST = 'changelly/coins';
export const API_CHANGELLY_MIN_AMOUNT = 'changelly/minAmount';
export const API_CHANGELLY_CREATE_TRANSACTION = 'changelly/createTransaction';
export const CHANGELLY_ONOFFRAMP = 'changelly/OnOffRamp/listing2';
export const CHANGELLY_GET_OFFER = 'changelly/OnOffRamp/getOffers';
export const CHANGELLY_ONOFF_CREATE_ORDER = 'changelly/OnOffRamp/createOrder';

//*****************************************Sol****************************************************/

export const API_SAVE_SOL_TRANSACTION_ID = 'solana/'
//*****************************************NFT****************************************************/
export const GET_NFT_LIST = 'wallet/nft/from_moalis'
export const MERCURYO_REDIRECT_URL = MAIN_URL + "/transaction-success"
export const SAVE_MERCURYO_TRANSACTION = 'on_off_ramp/mercuryo/initiateTx';



