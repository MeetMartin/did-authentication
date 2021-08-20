import React from 'react';
import styled from 'styled-components';

const GlassInputTextTag = styled.input`
    background: rgba(255,255,255,0.6);
    border-radius: 10px;
    border: 1px solid rgba(255,255,255,0.4);
    padding: 15px;
    cursor: pointer;
    font-size: 1.5rem;
    font-weight: 700;
`;

const GlassTextField = ({value, placeholder, onClick, onChange, disabled}) => 
    <GlassInputTextTag type='text' value={value} placeholder={placeholder} onClick={onClick} onChange={onChange} disabled={disabled} />;

export default GlassTextField;