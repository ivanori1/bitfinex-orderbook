import React, { useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBids, updateAsks } from './redux/orderbookSlice';
import { w3cwebsocket } from 'websocket';
import './index.css'

const symbol = 'tMXNT:USD'

const Orderbook = () => {
  const dispatch = useDispatch();
  const bids = useSelector((state) => state.orderbook.bids);
  const asks = useSelector((state) => state.orderbook.asks);

  // Define spread state at the top level of your component
  useEffect(() => {
    const socket = new w3cwebsocket('wss://api-pub.bitfinex.com/ws/2');

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
      console.log(data)
      if (Array.isArray(data) && data.length === 2) {
        if (data[1] === 'hb') {
          return
        }
        if (data[1].length === 50) {
          const bids = data[1].slice(0, 25);
          const asks = data[1].slice(25, 50)
          dispatch(updateBids(bids));
          dispatch(updateAsks(asks));
        }
      }
    });

  }, [dispatch]);

  // Render the bids and asks
  const renderBids = (data) => {

      return data.map((item, index) => (
        <tr key={index}>
          <td>{item[1]}</td>
          <td>{Math.abs(item[2])}</td>
          <td>{item[0]}</td>
        </tr>
      ));

    };
    const renderAsks = (data) => {

      return data.map((item, index) => (
        <tr key={index}>
          <td>{item[0]}</td>
          <td>{Math.abs(item[2])}</td>
          <td>{item[1]}</td>
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
            {renderBids(bids)}
          </tbody>
        </table>
        <table className='asks-table'>
          <thead>
            <tr>
              <th>Price</th>
              <th>Amount</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {renderAsks(asks)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orderbook;
