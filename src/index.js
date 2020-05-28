import React, {Suspense} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import {I18nextProvider} from 'react-i18next';

import i18n from './i18n';

import App from './App';

const Loader = () => {
  return <div>Loading...</div>;
};

ReactDOM.render(
  <React.StrictMode>
  <I18nextProvider i18n={i18n}>
    <App />
  </I18nextProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
