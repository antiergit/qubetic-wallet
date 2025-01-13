import { CUSTOM_TOKEN_REQUEST, CUSTOM_TOKEN_SUCCESS, CUSTOM_TOKEN_FAIL } from '../Actions/types'

const INITIAL_STATE = {
    searchTokenData: {},
    errorMsg: '',
};

/************************************** Register reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case CUSTOM_TOKEN_REQUEST:
            return { ...state, searchTokenData: {} };
        case CUSTOM_TOKEN_SUCCESS:
            return { ...state, searchTokenData: action.payload };
        case CUSTOM_TOKEN_FAIL:
            return { ...state, searchTokenData: {} };
        default:
            return state;
    }
};
