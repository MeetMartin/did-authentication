import React from 'react';
import styled from 'styled-components';

import GlassPaper from '../components/GlassPaper';
import GlassButton from '../components/GlassButton';
import AuthenticationQRCode from '../components/AuthenticationQRCode';

const Wrapper = styled.div`
    float: left;
    max-width: 1000px;
    padding: 40px;
    height: calc(100% - 80px);
    h1 {
        margin-top: 0;
    }
`;

const HomePage = () => {
    return (
        <Wrapper>
            <GlassPaper>
            <h1>
                Decentralized Identifiers<br />
                Are Here!
            </h1>
            <p>Something</p>
            <GlassButton>Sign In</GlassButton> Or <GlassButton>Sign Up</GlassButton>
            <br /><br />
            <AuthenticationQRCode />
            </GlassPaper>
        </Wrapper>
    );
};

export default HomePage;