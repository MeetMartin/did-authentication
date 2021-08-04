import React, { createContext, useReducer, useEffect } from 'react';

import logger from '../logger';
import { reducer, initialState } from './reducers';
import { useActions } from './actions';
import { applyMiddleware } from './middleware';

const StoreContext = createContext(initialState);

const StoreProvider = ({ children }) => {
    // Set up reducer with useReducer and our defined reducer, initialState from reducers.js
    const [state, dispatch] = useReducer(reducer, initialState);

    // Attach middleware to capture every dispatch
    const enhancedDispatch = applyMiddleware(state)(dispatch);

    // Create an object of all our actions, handling special cases where a simple dispatch is too primitive
    const actions = useActions(state, enhancedDispatch);

    // Log new state
    useEffect( () => {
        logger.debug('[StoreProvider state] state updated', state);;
    }, [state]);

    return (
        <StoreContext.Provider value={{ state, enhancedDispatch, actions }}>
            {children}
        </StoreContext.Provider>
    );
};

export { StoreContext, StoreProvider };