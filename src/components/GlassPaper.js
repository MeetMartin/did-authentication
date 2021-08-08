import React from 'react';
import styled from 'styled-components';

const GlassPaperDiv = styled.div`
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.4);
    padding: 40px;
    height: calc(100% - 80px);
`;

const GlassPaper = props => 
    <GlassPaperDiv>
        {props.children}
    </GlassPaperDiv>;

export default GlassPaper;