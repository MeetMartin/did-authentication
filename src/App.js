import React from 'react';
import { createGlobalStyle } from 'styled-components';

import { StoreProvider } from './store/StoreContext';
import HomePage from './pages/HomePage';

const GlobalStyle  = createGlobalStyle`
    html, body {
        height: 100%;
        margin: 0;
        font-family: 'Roboto', sans-serif;
    }
    body {
        background-image: url(${require('./assets/queenstown.jpg').default});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        color: #000;
    }
    h1 {
        font-size: 3rem;
        font-weight: 700;
    }
    #root {
        height: 100%;
    }
`;

/**
 * Base Template component holding the basic web application
 * @returns {JSX.Element}
 */
const App = () => {
    return (
        <StoreProvider>
            <GlobalStyle />
            <HomePage />
        </StoreProvider>
    );
};

export default App;