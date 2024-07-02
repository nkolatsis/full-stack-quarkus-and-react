import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {reducer as layoutReducer} from './layout/redux';

const appReducer = combineReducers({
    layout: layoutReducer
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

// export const store = configureStore({
//     reducer: (state, action) => appReducer(state, action)
// });

export const store = configureStore({
    reducer: rootReducer
});