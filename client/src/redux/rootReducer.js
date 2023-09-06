// rootReducer.js

import { combineReducers } from 'redux';
import userReducer from './userSlice';
import alertReducer from './alertSlice';
import chatReducer from './chatSlice';
const rootReducer = combineReducers({
  user: userReducer,
  alert: alertReducer, // Add the alert reducer here
  chat: chatReducer, // Add the chat reducer here
});

export default rootReducer;