import React from 'react';

import Page from './Page';
import QRInfo from '../components/QRInfo';
import LeftColumn from '../components/LeftColumn';
import { Link } from 'react-router-dom';

const SignInPage = () => {
    return (
        <Page>
            <LeftColumn>
                <h1>
                    Sign In<br />
                    With MATTR Wallet
                </h1>
                <QRInfo />
                <p>
                    Not a member? <Link to='/sign-up'>Create new account</Link>.
                </p>
            </LeftColumn>
        </Page>
    );
};

export default SignInPage;