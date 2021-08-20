import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import Page from './Page';
import { StoreContext } from '../store/StoreContext';
import SignUpForm from '../components/SignUpForm';
import QRInfo from '../components/QRInfo';
import LeftColumn from '../components/LeftColumn';
import GlassButton from '../components/GlassButton';

const SignUpPage = () => {
    const { state } = useContext(StoreContext);

    return (
        <Page>
            <LeftColumn>
                <h1>
                    Sign Up
                </h1>
                <SignUpForm />
                {state.userName &&
                    <>
                        <h2>Claim Your Account<br />With MATTR Wallet</h2>
                        <QRInfo />
                        <p>Once you are verified in the MATTR Wallet:</p>
                        <GlassButton>Verified in Wallet</GlassButton>
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