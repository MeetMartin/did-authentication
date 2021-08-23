import React, { useContext } from 'react';

import Page from './Page';
import Page404 from './404';
import { StoreContext } from '../store/StoreContext';

const AuthenticatedPage = ({ children }) => {
    const { state } = useContext(StoreContext);

    return(
        <Page>
            { state.authenticated ? children : <Page404 /> }
        </Page>
    );
};

export default AuthenticatedPage;