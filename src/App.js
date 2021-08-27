import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import { StoreProvider } from './store/StoreContext';
import Routes from './Routes';

import Header from './components/Header';
import Footer from './components/Footer';

const GlobalStyle  = createGlobalStyle`
    html, body {
        height: 100%;
        margin: 0;
        font-family: 'Roboto', sans-serif;
    }
    body {
        background-image: url(${require('./assets/city.jpg').default});
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center center;
        background-attachment: fixed;
        color: #000;
    }
    main {
        padding-top: 120px;
    }
    a {
        color: #000;
        text-decoration: none;
        font-weight: 700;
        &:hover {
            text-decoration: underline;
        }
    }
    #root {
        height: 100%;
    }
    @media only screen and (min-width: 768px) {
        h1 {
            font-size: 3rem;
        }
        h2 {
            font-size: 2.4rem;
        }
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
            <Header />
            <Router>
                <Routes />
            </Router>
            <Footer />
        </StoreProvider>
    );
};

export default App;