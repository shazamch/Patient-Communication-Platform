import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { SocketProvider } from './context/SocketProvider.jsx';

import App from './App.jsx'
import './index.css'
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <SocketProvider>
        <App />
    </SocketProvider>
  </Provider>,
)
