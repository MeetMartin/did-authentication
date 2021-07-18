import React from 'react';
import styled from 'styled-components';

import HomePage from './pages/HomePage';

const BaseStyles = styled.span`
    color: #000;
`;

/**
 * Base Template component holding the basic web application
 * @returns {JSX.Element}
 */
const App = () => {
    return (
        <BaseStyles>
            <HomePage />
        </BaseStyles>
    );
};

export default App;