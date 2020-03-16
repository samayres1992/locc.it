import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import ReactGA from 'react-ga';
import 'antd/dist/antd.css'; // https://ant.design/docs/react/introduce
import 'antd-mobile/dist/antd-mobile.css'; 
// use gulp to compile
import './css/overrides.css';
import './css/app.css';
import './css/fancy-form.css';
import './css/passcode.css';
import './css/login.css';
import './css/mobile.css';

// Our app
import App from './App';

// Reducers
import reducers from './reducers';

ReactGA.initialize('UA-153191251-1',  { debug: true });
ReactGA.pageview(window.location.pathname + window.location.search);

// Only run devtools in dev
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const enhancer = composeEnhancers(
  applyMiddleware(reduxThunk)
);

// Redux
const store = createStore(
  reducers,
  enhancer
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);