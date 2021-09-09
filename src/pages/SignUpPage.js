import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import shortid from 'shortid';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Page from './Page';
import { StoreContext } from '../store/StoreContext';
import UserNameForm from '../components/UserNameForm';
import MobileAppDownload from '../components/MobileAppDownload';
import AuthenticationQRCode from '../components/AuthenticationQRCode';
import LeftColumn from '../components/LeftColumn';

const ErrorParagraph = styled.p`
    color: red;
`;

const SignUpPage = () => {
    const { state, actions } = useContext(StoreContext);

    const [challengeId, setChallengeId] = useState(shortid.generate());
    const [timedOutStatusCheck, setTimedOutStatusCheck] = useState(false);

    const history = useHistory();

    useEffect(() => {
        actions.receiveSignUpError(); // clear errors when page is opened

        const statusCheckInterval = setInterval(() => {
            !timedOutStatusCheck && actions.requestSignUp(challengeId);
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
        state.requestedSignUp && state.bearer && actions.createUser();
    }, [state.bearer]);

    useEffect(() => {
        state.authenticated && history.push('/welcome');
    }, [state.authenticated]);

    return (
        <Page>
            <Helmet>
                <title>DID Authentication Sign Up | DID Auth 7urtle JavaScript</title>
                <meta property='og:title' content="DID Authentication Sign Up | 7urtle JavaScript" />
                <meta name='twitter:title' content="DID Authentication Sign Up | 7urtle JavaScript" />
                <meta name='description' content='Sign Up using Decentralized Identifiers (DIDs), user-controlled digital identities.' />
                <meta name='og:description' content='Sign Up using Decentralized Identifiers (DIDs), user-controlled digital identities.' />
                <meta name='twitter:description' content='Sign Up using Decentralized Identifiers (DIDs), user-controlled digital identities.' />
                <meta property='og:locale' content='en_EN' />
                <meta property='og:type' content='website' />
                <meta property='og:image' content={require('../assets/did-authentication.jpg').default} />
                <meta property='twitter:image' content={require('../assets/did-authentication.jpg').default} />
                <meta name='twitter:card' content='summary_large_image' />
            </Helmet>
            <LeftColumn>
                <h1>
                    Sign Up
                </h1>
                <ErrorParagraph>{state.signUpError}</ErrorParagraph>
                <MobileAppDownload />
                {
                    !state.userName
                    ?   <>
                            <h2>Account Info</h2>
                            <UserNameForm />
                        </>
                    :
                    <>
                        <h2>
                            {state.userName}:<br/>
                            Claim Your Account<br />
                            With MATTR Wallet
                        </h2>
                        <AuthenticationQRCode QRInput={challengeId} />
                    </>
                }
                <p>
                    Already a member? <Link to='/sign-in'>Sign In to your account</Link>.
                </p>
            </LeftColumn>
        </Page>
    );
};

export default SignUpPage;