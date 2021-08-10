import React from 'react';
import styled from 'styled-components';

const HeaderDiv = styled.div`
    color: #FFF;
    position: absolute;
    top: 15px;
    left: 35px;
    img {
        float: left;
    }
    p {
        color: #FFF;
        display: block;
        float: left;
        font-size: 2rem;
        position: relative;
        bottom: 12px;
    }
`;

const Header = () => 
    <HeaderDiv>
        <a href='/' title='Decentralized Identifiers Authentication'>
            <img src={require('../assets/turtle-js-logo-white.png').default} height='80' />
            <p>
                DID Authentication
            </p>
        </a>
    </HeaderDiv>;

export default Header;