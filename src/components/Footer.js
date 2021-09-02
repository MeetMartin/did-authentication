import React from 'react';
import styled from 'styled-components';

const FooterDiv = styled.div`
    color: #FFF;
    clear: both;
    margin-bottom: 0;
    padding: 20px 5px 20px 5px;
    a {
        color: #FFF;
    }
    @media only screen and (min-width: 768px) {
        padding: 0 40px 40px 40px;
    }
`;

const Footer = () => 
    <FooterDiv>
        7urtle JavaScript, 2021. No cookies. No analytics. No tracking.
    </FooterDiv>;

export default Footer;