import React from 'react';
import styled from 'styled-components';

const FooterDiv = styled.div`
    color: #FFF;
    position: absolute;
    bottom: 40px;
    right: 40px;
    a {
        color: #FFF;
    }
`;

const Footer = () => 
    <FooterDiv>
        Made by <a href='http://www.meet-martin.com' title='Martin Novak' target='_blank'>Martin Novak</a>.
    </FooterDiv>;

export default Footer;