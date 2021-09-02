import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import AuthenticatedPage from './AuthenticatedPage';
import { StoreContext } from '../store/StoreContext';
import LeftColumn from '../components/LeftColumn';
import BraveDeveloper from '../components/BraveDeveloper';
import GlassButton from '../components/GlassButton';

const AuthenticationOr = styled.div`
    padding: 15px;
    @media only screen and (min-width: 768px) {
        font-size: 1.5rem;
        width: 260px;
        text-align: center;
    }
`;

const WelcomePage = () => {
    const { state, actions } = useContext(StoreContext);

    return(
        <AuthenticatedPage>
            <Helmet>
                <title>DID Authentication Success | DID Auth 7urtle JavaScript</title>
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
                <h1>Welcome, {state.userName}!</h1>
                <p>
                    The database is set to store your account only for 30 days.
                </p>
                <h2>Let's try auth again!</h2>
                <Link to='/' onClick={() => actions.requestSignOut()}>
                    <GlassButton>Sign Out</GlassButton>
                </Link>
                <AuthenticationOr>or</AuthenticationOr>
                <Link to='/' onClick={() => actions.deleteUser()}>
                    <GlassButton>Delete User</GlassButton>
                </Link>
            </LeftColumn>
            <BraveDeveloper />
        </AuthenticatedPage>
    );
};

export default WelcomePage;