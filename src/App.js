import { Provider } from 'react-redux'
import Orderbook from './Orderbook'
import store from './redux/store'

const App = () => {
  return (
    <Provider store={store}>
      <Orderbook />
    </Provider>
  )
}

export default App
