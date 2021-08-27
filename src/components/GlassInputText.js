import React from 'react';
import styled from 'styled-components';

const GlassInputTextTag = styled.input`
    background: rgba(255,255,255,0.6);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.4);
    padding: 15px;
    cursor: pointer;
    font-weight: 700;
    font-size: 1.2rem;
    @media only screen and (min-width: 768px) {
        font-size: 1.5rem;
    }
`;

const GlassTextField = ({value, placeholder, onClick, onChange, disabled}) => 
    <GlassInputTextTag type='text' value={value} placeholder={placeholder} onClick={onClick} onChange={onChange} disabled={disabled} />;

export default GlassTextField;