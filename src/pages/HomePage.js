import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import Page from './Page';
import GlassButton from '../components/GlassButton';
import LeftColumn from '../components/LeftColumn';
import BraveDeveloper from '../components/BraveDeveloper';

const AuthenticationOr = styled.div`
    padding: 15px;
    @media only screen and (min-width: 768px) {
        font-size: 1.5rem;
        width: 260px;
        text-align: center;
    }
`;

const HomePage = () => {
    return (
        <Page>
            <Helmet>
                <title>DID Authentication Demonstration | DID Auth 7urtle JavaScript</title>
                <meta property='og:title' content="DID Authentication Demonstration | 7urtle JavaScript" />
                <meta name='twitter:title' content="DID Authentication Demonstration | 7urtle JavaScript" />
                <meta name='description' content='Authentication using Decentralized Identifiers (DIDs), user-controlled digital identities. Demonstration with full GitHub project, YouTube video, and Medium article for you.' />
                <meta name='og:description' content='Authentication using Decentralized Identifiers (DIDs), user-controlled digital identities. Demonstration with full GitHub project, YouTube video, and Medium article for you.' />
                <meta name='twitter:description' content='Authentication using Decentralized Identifiers (DIDs), user-controlled digital identities. Demonstration with full GitHub project, YouTube video, and Medium article for you.' />
                <meta property='og:locale' content='en_EN' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={require('../assets/did-authentication.jpg').default} />
                <meta property='twitter:image' content={require('../assets/did-authentication.jpg').default} />
                <meta name='twitter:card' content='summary_large_image' />
            </Helmet>
            <LeftColumn>
                <h1>
                    Decentralized Identifiers<br />
                    Are Here!
                </h1>
                <p>
                    Decentralized Identifiers (DIDs) are user-controlled digital identities based on W3C standard using secure modern encryption.
                </p>
                <ul>
                    <li>Your identity is stored in your digital wallet, not controlled by any third party.</li>
                    <li>Because you own your identity, you have controll over your privacy.</li>
                    <li>The website stores only your DID ID, which cannot be used to impersonate you or gain access to your account.</li>
                    <li>There is no password to steal, making your accounts that much more secure.</li>
                </ul>
                <h2>Try DID For Authentication</h2>
                <Link to='/sign-in' title='Sign in using Decentralized Identifier'>
                    <GlassButton>Sign In</GlassButton>
                </Link>
                <AuthenticationOr>or</AuthenticationOr>
                <Link to='/sign-up' title='Sign up using Decentralized Identifier'>
                    <GlassButton>Sign Up</GlassButton>
                </Link>
            </LeftColumn>
            <BraveDeveloper />
        </Page>
    );
};

export default HomePage;