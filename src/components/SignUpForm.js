import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import { isLessThan, lengthOf, Either, when } from '@7urtle/lambda';

import { StoreContext } from '../store/StoreContext';
import GlassButton from './GlassButton';
import GlassTextField from './GlassInputText';

const FormTag = styled.form`
    button {
        margin-top: 20px;
    }
`;

const SignUpForm = () => {
    const [ userName, setUserName ] = useState('');
    const { state, actions } = useContext(StoreContext);

    const hookOnChange = fn => event => fn(event.target.value);
    const hookOnSubmit = event =>
        event.preventDefault() ||
        when(userName => validateUserName(userName).isSuccess)(() => actions.receiveUserName(userName))(userName);

    const validateUserName = userName => isLessThan(3)(lengthOf(userName)) ? Either.Failure('User name has to be longer than 3 characters.') : Either.Success(userName);

    return(
        <>
            {!state.userName
            ?
            <>
                <h2>Account Info</h2>
                <FormTag onSubmit={hookOnSubmit}>
                    <GlassTextField placeholder='User name' value={userName} onChange={hookOnChange(setUserName)} />
                    <GlassButton disabled={validateUserName(userName).isFailure()} onClick={hookOnSubmit}>Sign Up</GlassButton>
                </FormTag>
            </>
            :
            <p>
                <strong>User name:</strong> {state.userName}
            </p>
            }
            
        </>
    );
};

export default SignUpForm;