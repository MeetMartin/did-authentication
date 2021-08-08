import React from 'react';
import styled from 'styled-components';

const GlassButtonTag = styled.button`
    background: rgba(255,255,255,0.75);
    backdrop-filter: blur(5px);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.4);
    padding: 10px;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 700;
    &:hover {
        background: rgba(255,255,255,0.8);
    }
`;

const GlassButton = props => 
    <GlassButtonTag onClick={props.onClick}>
        {props.children}
    </GlassButtonTag>;

export default GlassButton;