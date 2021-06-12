import './index.scss';
import 'regenerator-runtime/runtime';
import App from './components/App';
import {BrowserRouter} from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';

if ('serviceWorker' in navigator) navigator.serviceWorker.register('/service-worker.js');

ReactDOM.render(
  <BrowserRouter>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>,
  document.getElementById('root')
);
