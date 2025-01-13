import { REGISTER_FORM_UPDATE, REGISTER_USER_FAIL, REGISTER_USER_SUCCESS, REGISTER_USER, REGISTER_FORM_RESET } from '../Actions/types';

const INITIAL_STATE = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    registerUser: '',
    registerError: '',
    regLoading: false,
};

/************************************** Register reducer ****************************************************/
export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REGISTER_FORM_UPDATE:
            return { ...state, [action.payload.prop]: action.payload.value };
        case REGISTER_USER:
            return { ...state, regLoading: true, registerError: '' };
        case REGISTER_USER_SUCCESS:
            return { ...state, registerUser: action.payload, ...INITIAL_STATE };
        case REGISTER_USER_FAIL:
            return { ...state, registerError: action.payload, regLoading: false, };
        case REGISTER_FORM_RESET:
            return { ...state, ...INITIAL_STATE };
        default:
            return state;
    }
};
