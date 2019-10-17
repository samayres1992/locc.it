import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import reduxThunk from 'redux-thunk';
import 'antd/dist/antd.css'; // https://ant.design/docs/react/introduce

// Our app
import App from './components/App';

// Reducers
import reducers from './reducers';

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