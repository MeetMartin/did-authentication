import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import AuthenticatedPage from './AuthenticatedPage';
import { StoreContext } from '../store/StoreContext';
import LeftColumn from '../components/LeftColumn';
import BraveDeveloper from '../components/BraveDeveloper';
import GlassButton from '../components/GlassButton';

const AuthenticationOr = styled.div`
    padding: 15px;
    @media only screen and (min-width: 768px) {
        font-size: 1.5rem;
        width: 300px;
        text-align: center;
    }
`;

const WelcomePage = () => {
    const { state, actions } = useContext(StoreContext);

    return(
        <AuthenticatedPage>
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