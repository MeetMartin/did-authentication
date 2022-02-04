import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { nanoid } from 'nanoid';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Page from './Page';
import { StoreContext } from '../store/StoreContext';
import UserNameForm from '../components/UserNameForm';
import MobileAppDownload from '../components/MobileAppDownload';
import AuthenticationQRCode from '../components/AuthenticationQRCode';
import LeftColumn from '../components/LeftColumn';
import useDeviceType from '../hooks/useDeviceType';

const ErrorParagraph = styled.p`
    color: red;
`;

const SignInPage = () => {
    const { state, actions } = useContext(StoreContext);

    const [challengeId, setRequestId] = useState(nanoid());
    const [timedOutStatusCheck, setTimedOutStatusCheck] = useState(false);

    const history = useHistory();

    const isMobile = useDeviceType();

    useEffect(() => {
        actions.receiveSignUpError(); // clear errors when page is opened

        const statusCheckInterval = setInterval(() => {
            !timedOutStatusCheck && actions.requestSignIn(challengeId);
        }, 5000);

        const statusCheckTimeout = setTimeout(() => {
            setTimedOutStatusCheck(true);
        }, 300000);

        return () => {
            clearInterval(statusCheckInterval);
            clearTimeout(statusCheckTimeout);
        };
    }, []);

    useEffect(() => {
        state.userName && !state.authenticated && actions.requestSignInByName({challengeId: challengeId, userName: state.userName});
    }, [state.userName]);
    
    useEffect(() => {
        state.requestedSignIn && state.bearer && actions.readUser();
    }, [state.bearer]);

    useEffect(() => {
        state.authenticated && history.push('/welcome');
    }, [state.authenticated]);

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
                {timedOutStatusCheck && <ErrorParagraph>Sign in has timed out. Please reload the page if you still want to sign in.</ErrorParagraph>}
                <ErrorParagraph>{state.signUpError}</ErrorParagraph>
                <MobileAppDownload />
                {state.authenticating && <p>Signing in... Please check your MATTR Wallet on your mobile device.</p>}
                {!state.authenticating && <>
                    <h2>by user name</h2>
                    <UserNameForm buttonText='Sign In' />
                    <h2>{isMobile ? 'or' : 'or by a QR code'}</h2>
                    <AuthenticationQRCode QRInput={challengeId} />
                    <p>
                        Not a member yet? <Link to='/sign-up'>Sign up</Link>.
                    </p>
                </>}
                
                
            </LeftColumn>
        </Page>
    );
};

export default SignInPage;