import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const challengeId = shortid.generate();
    const history = useHistory();
    
    useEffect(() => {
        state.requestedSignUp && state.bearer && actions.createUser();
    }, [state.bearer]);

    useEffect(() => {
        state.authenticated && history.push('/welcome');
    }, [state.authenticated]);

    return (
        <Page>
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