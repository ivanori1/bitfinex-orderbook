const initialState = {
    bids: [],
    asks: [],
  }
  
  const orderbookReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_ORDERBOOK':
        const { bids, asks } = action.payload
        console.log({'reducerBid': bids,'reducerAsk': asks})
        return { bids, asks }
         default:
        return state
    }
  }
  
  export default orderbookReducer
  