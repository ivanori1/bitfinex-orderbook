import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBids, updateAsks } from './redux/orderbookSlice';
import { w3cwebsocket as W3CWebSocket } from 'websocket';
import './index.css'

const symbol = 'tMXNT:USD'

const Orderbook = () => {
  const dispatch = useDispatch();
  const bids = useSelector((state) => state.orderbook.bids);
  const asks = useSelector((state) => state.orderbook.asks);
  
  // Define spread state at the top level of your component
  const [spread, setSpread] = useState(null);

  useEffect(() => {
    const socket = new W3CWebSocket('wss://api-pub.bitfinex.com/ws/2');
    
    socket.addEventListener('open', () => {
      console.log('WebSocket open');
      const msg = JSON.stringify({
        event: 'subscribe',
        channel: 'book',
        symbol: symbol,
        freq: 'F0',
        prec: 'P0',
      });
      socket.send(msg);
    });

    socket.addEventListener('message', (message) => {
      const data = JSON.parse(message.data);
     // console.log(Array.isArray(data))
      //console.log(data.length)
      //console.log(Array.isArray(data))
      if (Array.isArray(data) && data.length === 2) {
        if(data[1] ==='hb') {
          return
        }
        if(data[1].length === 50) {
          const bids = data[1].slice(0, 25);
          const asks = data[1].slice(25, 50);
          console.log(bids)
          console.log(asks)
          
          dispatch(updateBids(bids));
          dispatch(updateAsks(asks));
        }
        
        // // Update the spread state
        // const bestBid = bids[0]?.[0];
        // const bestAsk = asks[0]?.[0];
        // if (bestBid && bestAsk) {
        //   const spread = (bestAsk - bestBid).toFixed(2);
        //   setSpread(spread);
        // } else {
        //   setSpread(null);
        // }
      }
    });

    // Return a cleanup function to close the WebSocket connection
    // return () => {
    //   socket.close();
    // };
  }, [dispatch]);

  // Render the bids and asks
  const renderRows = (data) => {
    return data.map((item, index) => (
      <tr key={index}>
        <td>{item[1]}</td>
        <td>{Math.abs(item[2])}</td>
        <td>{item[0]}</td>
      </tr>
    ));
  };

  return (
    <div >
      <h1>Orderbook {symbol}</h1>
      <div className='table-container'>
      <table className='bids-table'>
        <thead >
          <tr>
            <th>Count</th>
            <th>Amount</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {renderRows(bids)}
        </tbody>
      </table>
      <table className='asks-table'>
        <thead>
          <tr>
            <th>Count</th>
            <th>Amount</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {renderRows(asks)}
        </tbody>
      </table>
      </div>
      {spread && <p>Spread: {spread}</p>}
    </div>
  );
};

export default Orderbook;
