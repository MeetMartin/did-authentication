import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import shortid from 'shortid';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Page from './Page';
import { StoreContext } from '../store/StoreContext';
import QRInfo from '../components/QRInfo';
import LeftColumn from '../components/LeftColumn';
import GlassButton from '../components/GlassButton';

const ErrorParagraph = styled.p`
    color: red;
`;

const SignInPage = () => {
    const { state, actions } = useContext(StoreContext);

    const [challengeId, setChallengeId] = useState(shortid.generate());

    const history = useHistory();
    
    useEffect(() => {
        state.requestedSignIn && state.bearer && actions.readUser();
    }, [state.bearer]);

    useEffect(() => {
        state.authenticated && history.push('/welcome');
    }, [state.authenticated]);

    useEffect(() => {
        actions.receiveSignUpError(); // clear errors when page is opened
    }, []);

    return (
        <Page>
            <Helmet>
                <title>DID Authentication Sign In | DID Auth 7urtle JavaScript</title>
                <meta property='og:title' content="DID Authentication Sign In | 7urtle JavaScript" />
                <meta name='twitter:title' content="DID Authentication Sign In | 7urtle JavaScript" />
                <meta name='description' content='Sign In using Decentralized Identifiers (DIDs), user-controlled digital identities.' />
                <meta name='og:description' content='Sign In using Decentralized Identifiers (DIDs), user-controlled digital identities.' />
                <meta name='twitter:description' content='Sign In using Decentralized Identifiers (DIDs), user-controlled digital identities.' />
                <meta property='og:locale' content='en_EN' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={require('../assets/did-authentication.jpg').default} />
                <meta property='twitter:image' content={require('../assets/did-authentication.jpg').default} />
                <meta name='twitter:card' content='summary_large_image' />
            </Helmet>
            <LeftColumn>
                <h1>
                    Sign In<br />
                    With MATTR Wallet
                </h1>
                        <QRInfo QRInput={challengeId} />
                        <p>Once you are verified in the MATTR Wallet:</p>
                        <GlassButton onClick={() => actions.requestSignIn(challengeId)}>Verified in Wallet</GlassButton>
                        <ErrorParagraph>{state.signUpError}</ErrorParagraph>
                <p>
                    Not a member yet? <Link to='/sign-up'>Sign up</Link>.
                </p>
            </LeftColumn>
        </Page>
    );
};

export default SignInPage;