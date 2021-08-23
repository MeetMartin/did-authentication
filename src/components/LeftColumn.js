import React from 'react';
import styled from 'styled-components';

import GlassPaper from '../components/GlassPaper';

const LeftColumnDiv = styled.div`
    float: left;
    max-width: 600px;
    padding: 120px 0 40px 40px;
    h1 {
        margin-top: 0;
    }
    button {
        display: block;
        width: 300px;
    }
`;

const LeftColumn = ({children}) =>
    <LeftColumnDiv>
        <GlassPaper>
            {children}
        </GlassPaper>
    </LeftColumnDiv>

export default LeftColumn;