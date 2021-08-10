import React from 'react';
import { Link } from 'react-router-dom';

import Page from "./Page";
import LeftColumn from '../components/LeftColumn';
import GlassButton from '../components/GlassButton';

/**
 * Application 404 page component
 * @returns {JSX}
 */
const Page404 = () => {
    return (
        <Page>
            <LeftColumn>
                <h1>Not Found</h1>
                <p>
                    This is not the page that you are looking for!
                </p>
                <Link to='/'><GlassButton>Go Home</GlassButton></Link>
            </LeftColumn>
        </Page>
    );
};

export default Page404;