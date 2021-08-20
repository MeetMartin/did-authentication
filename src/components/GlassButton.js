import React from 'react';
import styled from 'styled-components';

const GlassButtonTag = styled.button`
    background: rgba(255,255,255,0.8);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.4);
    padding: 15px;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 700;
    &:hover {
        background: rgba(255,255,255,0.8);
    }
`;

const GlassButton = ({ children, onClick, disabled }) => 
    <GlassButtonTag onClick={onClick} disabled={disabled}>
        <span>{children}</span>
    </GlassButtonTag>;

export default GlassButton;