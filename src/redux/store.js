import { configureStore } from '@reduxjs/toolkit';
import orderbookReducer from './orderbookSlice';


const store = configureStore({
  reducer: {
    orderbook: orderbookReducer
  }
})

export default store
