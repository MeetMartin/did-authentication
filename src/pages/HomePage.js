import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import Page from './Page';
import GlassButton from '../components/GlassButton';
import LeftColumn from '../components/LeftColumn';

const AuthenticationOr = styled.div`
    font-size: 1.5rem;
    width: 300px;
    text-align: center;
    padding: 15px;
`;

const HomePage = () => {
    return (
        <Page>
            <LeftColumn>
                <h1>
                    Decentralized Identifiers<br />
                    Are Here!
                </h1>
                <p>Decentralized Identifiers (DIDs) are user-controlled digital identities based on W3C standard using secure modern encryption.</p>
                <h2>Try DID For Authentication</h2>
                <Link to='/sign-in' title='Sign in using Decentralized Identifier'>
                    <GlassButton>Sign In</GlassButton>
                </Link>
                <AuthenticationOr>or</AuthenticationOr>
                <Link to='/sign-up' title='Sign up using Decentralized Identifier'>
                    <GlassButton>Sign Up</GlassButton>
                </Link>
            </LeftColumn>
        </Page>
    );
};

export default HomePage;