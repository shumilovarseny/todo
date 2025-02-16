const SET_FILTER = 'SET_FILTER';
const initialState = {
    value: []
};

export const setFilter = (payload) => ({ type: SET_FILTER, payload });
export const filterReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_FILTER:
            return { value: action.payload };
        default:
            return state;
    }
};