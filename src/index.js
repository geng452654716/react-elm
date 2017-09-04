import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import {applyMiddleware} from 'redux'
import thunk from 'redux-thunk'

import RouterMap from './router/RouterMap'
import configureStore from './store'

const store = configureStore(applyMiddleware(thunk));

ReactDOM.render(
<Provider store={store}>
    <RouterMap />
</Provider>,
 document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}
