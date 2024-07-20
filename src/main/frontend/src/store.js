import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {logout, reducer as authReducer} from './auth/redux';
import {reducer as layoutReducer} from './layout/redux';
import { api as userApi } from './users/api';
import { api as projectApi } from './projects';
import { api as taskApi } from './tasks';

const appReducer = combineReducers({
  auth: authReducer,
  layout: layoutReducer,
  [userApi.reducerPath]: userApi.reducer,
  [projectApi.reducerPath]: projectApi.reducer,
  [taskApi.reducerPath]: taskApi.reducer
});

const rootReducer = (state, action) => {
  if (logout.match(action)) {
    state = undefined;
  }
  return appReducer(state, action);
};

// export const store = configureStore({
//     reducer: (state, action) => appReducer(state, action)
// });

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware()
      .concat(userApi.middleware)
      .concat(projectApi.middleware)
      .concat(taskApi.middleware)
});