import { combineReducers } from 'redux';
import { createStore } from 'redux';
import { tokenReducer } from './reducers/tokenReducer';
import { filterReducer } from './reducers/filterReducer';

const rootReducer = combineReducers({
    token: tokenReducer,
    filter: filterReducer
});

const store = createStore(rootReducer);

export default store;