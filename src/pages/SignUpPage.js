import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import shortid from 'shortid';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import Page from './Page';
import { StoreContext } from '../store/StoreContext';
import SignUpForm from '../components/SignUpForm';
import QRInfo from '../components/QRInfo';
import LeftColumn from '../components/LeftColumn';
import GlassButton from '../components/GlassButton';

const ErrorParagraph = styled.p`
    color: red;
`;

const SignUpPage = () => {
    const { state, actions } = useContext(StoreContext);

    const [challengeId, setChallengeId] = useState(shortid.generate());

    const history = useHistory();
    
    useEffect(() => {
        state.requestedSignUp && state.bearer && actions.createUser();
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
                {
                    !state.userName
                    ? <SignUpForm />
                    :
                    <>
                        <h2>
                            {state.userName}:<br/>
                            Claim Your Account<br />
                            With MATTR Wallet
                        </h2>
                        <QRInfo QRInput={challengeId} />
                        <p>Once you are verified in the MATTR Wallet:</p>
                        <GlassButton onClick={() => actions.requestSignUp(challengeId)}>Verified in Wallet</GlassButton>
                        <ErrorParagraph>{state.signUpError}</ErrorParagraph>
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