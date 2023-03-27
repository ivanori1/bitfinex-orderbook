import { createSlice } from '@reduxjs/toolkit'

const orderbookSlice = createSlice({
  name: 'orderbook',
  initialState: {
    bids: [],
    asks: []
  },
  reducers: {
    updateBids(state, action) {
      state.bids = action.payload
    },
    updateAsks(state, action) {
      state.asks = action.payload
    }
  }
})

export const { updateBids, updateAsks } = orderbookSlice.actions
export default orderbookSlice.reducer
