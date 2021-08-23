import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const challengeId = shortid.generate();
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