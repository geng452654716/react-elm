import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import RouterMap from './router/RouterMap'
import configureStore from './store'

const store = configureStore();

ReactDOM.render(
<Provider store={store}>
    <RouterMap />
</Provider>,
 document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}
