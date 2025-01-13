import { GET_COIN_LIST_SUCCESS, GET_COIN_LIST_FAIL, GET_COIN_LIST, GET_COIN_ON_LOG_OUT, THEME_STORE, SAVE_CHECKER_REQUESTS, CLEAR_CHECKER_REQUESTS, CHECKER_REQ_LOADING, SAVE_APPROVAL_REQUESTS } from '../Actions/types';

const INITIAL_STATE = {
  coinList: [],
  lastName: '',
  currencyList: [],
  cureentTheme: 1,
  checkerAccessReq: [],
  checkerTransactionReq: [],
  isCheckerReqLoading: true,
  checkerApprovalReq: []
};

/************************************** Register reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case THEME_STORE:
      console.log("theme---------------", action);
      let theme = action.payload.value == "darkMode" ? 1 : 2;
      return { ...state, cureentTheme: theme };
    case GET_COIN_LIST_SUCCESS:
      console.log(state.coinList, "action.payload:::::>>>>", action.payload);
      return { ...state, coinList: [...action.payload] };
    case GET_COIN_ON_LOG_OUT:
      return { ...state, coinList: [], currencyList: [] };
    case GET_COIN_LIST_FAIL:
      return { ...state, coinList: [] };
    case GET_COIN_LIST:
      return { ...state };
    case CLEAR_CHECKER_REQUESTS:
      return {
        ...state,
        checkerAccessReq: [],
        checkerTransactionReq: [],
      };
    case CHECKER_REQ_LOADING:
      return {
        ...state,
        isCheckerReqLoading: action.payload,
      };
    case SAVE_CHECKER_REQUESTS:
      const { transReq, accessReq } = action.payload;
      return {
        ...state,
        checkerAccessReq: accessReq,
        checkerTransactionReq: transReq,
      };
    case SAVE_APPROVAL_REQUESTS:
      return {
        ...state,
        checkerApprovalReq: action.payload,
      };
    default:
      return state;
  }
};
