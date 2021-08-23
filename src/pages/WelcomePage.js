import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import AuthenticatedPage from './AuthenticatedPage';
import { StoreContext } from '../store/StoreContext';
import GlassPaper from '../components/GlassPaper';
import GlassButton from '../components/GlassButton';

const WelcomePageDiv = styled.div`
    margin: 100px;
    max-width: 1000px;
`;

const WelcomePage = () => {
    const { state, actions } = useContext(StoreContext);

    return(
        <AuthenticatedPage>
            <WelcomePageDiv>
                <GlassPaper>
                    <h1>Welcome, {state.userName}!</h1>
                    <Link to='/' onClick={() => actions.requestSignOut()}>
                        <GlassButton>Sign Out</GlassButton>
                    </Link>
                </GlassPaper>
            </WelcomePageDiv>
        </AuthenticatedPage>
    );
};

export default WelcomePage;