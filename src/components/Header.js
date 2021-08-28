import React from 'react';
import styled from 'styled-components';

const HeaderDiv = styled.div`
    color: #FFF;
    position: absolute;
    top: 15px;
    left: 5px;
    img {
        float: left;
    }
    p {
        color: #FFF;
        display: block;
        float: left;
        font-size: 1rem;
        position: relative;
        top: 15px;
        @media only screen and (min-width: 768px) {
            font-size: 2rem;
            bottom: 12px;
        }
    }
    @media only screen and (min-width: 768px) {
        left: 35px;
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