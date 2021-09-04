import React from 'react';
import styled from 'styled-components';

import GlassPaper from '../components/GlassPaper';

const LeftColumnDiv = styled.div`
    float: left;
    max-width: 650px;
    padding: 0 5px 5px 5px;
    @media only screen and (min-width: 768px) {
        padding: 0 0 40px 40px;
        button {
            display: block;
            width: 300px;
        }
    }
    h1 {
        margin-top: 0;
    }
`;

const LeftColumn = ({children}) =>
    <LeftColumnDiv>
        <GlassPaper>
            {children}
        </GlassPaper>
    </LeftColumnDiv>

export default LeftColumn;