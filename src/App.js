import React from 'react';
import { createGlobalStyle } from 'styled-components';

import HomePage from './pages/HomePage';

const GlobalStyle  = createGlobalStyle`
    html {
        height: 100%;
        @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
        font-family: 'Roboto', sans-serif;
    }
    body {
        background: linear-gradient(135deg, #553D67, #99738E);
        background-repeat: no-repeat;
        color: #FFF;
    }
`;

/**
 * Base Template component holding the basic web application
 * @returns {JSX.Element}
 */
const App = () => {
    return (
        <>
            <GlobalStyle />
            <HomePage />
        </>
    );
};

export default App;