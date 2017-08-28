import React from 'react';
import ReactDOM from 'react-dom';

import RouterMap from './router/RouterMap'

ReactDOM.render(<RouterMap />, document.getElementById('root'));

if (module.hot) {
    module.hot.accept();
}
