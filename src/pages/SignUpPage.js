import React from 'react';

import Page from './Page';
import QRInfo from '../components/QRInfo';
import LeftColumn from '../components/LeftColumn';
import { Link } from 'react-router-dom';

const SignUpPage = () => {
    return (
        <Page>
            <LeftColumn>
                <h1>
                    Sign Up<br />
                    With MATTR Wallet
                </h1>
                <QRInfo />
                <p>
                    Already a member? <Link to='/sign-in'>Sign In to your account</Link>.
                </p>
            </LeftColumn>
        </Page>
    );
};

export default SignUpPage;