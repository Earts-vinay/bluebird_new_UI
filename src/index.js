import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import { Provider } from 'react-redux';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
      <ToastContainer />
      </PersistGate>
    </Provider>
);

reportWebVitals();


