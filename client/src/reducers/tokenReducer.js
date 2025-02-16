const SET_TOKEN = 'SET_TOKEN';
const initialState = {
    value: null
};

export const setToken = (payload) => ({ type: SET_TOKEN, payload });
export const tokenReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_TOKEN:
            return { value: action.payload };
        default:
            return state;
    }
};