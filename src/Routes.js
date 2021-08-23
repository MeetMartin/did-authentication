import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Page404 from './pages/404';
import HomePage from './pages/HomePage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import WelcomePage from './pages/WelcomePage';

const Routes = () => (
    <Switch>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/sign-in' component={SignInPage} />
        <Route exact path='/sign-up' component={SignUpPage} />
        <Route exact path='/welcome' component={WelcomePage} />

        <Route component={Page404} />
    </Switch>
);

export default Routes;