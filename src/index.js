import React from 'react';
import { render } from 'react-dom';
import App from './App';

window.location.origin === 'http://127.0.0.1:8080'
&& (window.location = 'http://localhost:8080');

render(
    <App />,
    document.getElementById('root')
);