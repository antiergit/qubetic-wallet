import { MULTI_SENDER_UDPATE } from '../Actions/types';

const INITIAL_STATE = {
    selectedCoin: null,
};

/************************************** Register reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case MULTI_SENDER_UDPATE:
            return { ...state, [action.payload.prop]: action.payload.value };
        default:
            return state;
    }
};
