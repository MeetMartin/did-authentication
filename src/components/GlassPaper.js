import React from 'react';
import styled from 'styled-components';

const GlassPaperDiv = styled.div`
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(10px);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.4);
    height: calc(100% - 80px);
    padding: 20px 10px;
    @media only screen and (min-width: 768px) {
        padding: 40px;
    }
`;

const GlassPaper = props => 
    <GlassPaperDiv>
        {props.children}
    </GlassPaperDiv>;

export default GlassPaper;