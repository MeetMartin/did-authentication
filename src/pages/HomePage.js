import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
    max-width: 1000px;
    margin: 100px auto;
`;

const HomePage = () => {
    return (
        <Wrapper>
            <h1>
                How To Easily Improve Authentication?<br />
                Decentralized Identifiers Are Here!
            </h1>
            <p>Something</p>
        </Wrapper>
    );
};

export default HomePage;