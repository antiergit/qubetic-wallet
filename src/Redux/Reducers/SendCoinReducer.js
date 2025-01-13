import { GET_GAS_PRICE_SUCCESS, GET_GAS_PRICE_FAIL, GET_GAS_PRICE } from '../Actions/types';

const INITIAL_STATE = {
    gasPriceList: {},
};

/************************************** Register reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_GAS_PRICE_SUCCESS:
            return { ...state, gasPriceList: action.payload };
        case GET_GAS_PRICE_FAIL:
            return { ...state, gasPriceList: {} };
        case GET_GAS_PRICE:
            return { ...state, gasPriceList: {} };
        default:
            return state;
    }
};
