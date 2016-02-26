/* @flow */

import '../modules/client/client';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from './components/views/Home.web';
import Provider from '../modules/store/Provider';
import * as store from '../modules/store/store';

ReactDOM.render(
	<Provider store={store}>
		<Home />
	</Provider>,
	document.getElementById('root')
);