import React from 'react';
import styled from 'styled-components';

import GlassPaper from './GlassPaper';

const BraveDeveloperDiv = styled.div`
    float: left;
    padding: 0 5px 5px 5px;
    @media only screen and (min-width: 768px) {
        padding: 0 40px 40px 40px;
    }
    h1 {
        margin-top: 0;
    }
    button {
        display: block;
        width: 300px;
    }
`;

const YouTubeIframe = styled.iframe`
    display: none;
    @media only screen and (min-width: 768px) {
        display: block;
    }
    width: 100%;
    height: 360px;
    max-width: 560px;
    border: none;
`;

const BraveDeveloper = ({children}) =>
    <BraveDeveloperDiv>
        <GlassPaper>
            <p>Brave developer,</p>

            <p>Welcome to the demonstration of authentication based on the use of decentralized identifiers.</p>
            <YouTubeIframe src="https://www.youtube-nocookie.com/embed/lw7IumbVH_A" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="true"></YouTubeIframe>
            <p>This demo also comes together with helpful resources to empower you to create your own solution.</p>
            <ul>
                <li><a href='https://github.com/MeetMartin/did-authentication' target='_blank' title='GitHub repository: DID Authentication'>GitHub repository: DID Authentication</a></li>
                <li>YouTube video: In Progress</li>
                <li>Medium article: In Progress</li>
            </ul>
            <p>Technologies used in this project:</p>
            <ul>
                <li><a href='https://mattr.global' target='_blank' title='Decentralized identifiers at MATTR'>MATTR platform</a> for decentralized identifiers</li>
                <li><a href='https://www.7urtle.com' target='_blank' title='JavaScript Functional Programming Library'>@7urtle/lambda library</a> for functional programming</li>
                <li><a href='https://reactjs.org/' target='_blank' title='A JavaScript library for building user interfaces'>React</a> for UI with styled components and <a href='https://betterprogramming.pub/8-basic-and-advanced-react-router-tips-6993ece8f57a' target='_blank' title='8 Basic and Advanced React Router Tips'>React router</a></li>
                <li><a href='https://betterprogramming.pub/10-easy-steps-to-abandon-redux-for-the-remarkable-react-hooks-124916fc634d' target='_blank' title='10 Easy Steps To Abandon Redux for the Remarkable React Hooks'>React Hooks</a> solution to connect UI with backend functions</li>
                <li>Hosted on <a href='https://www.netlify.com/' target='_blank' title='Dynamic web experiences shipped faster'>Netlify</a> with Netlify functions for backend</li>
            </ul>
            <p>All code base is open-sourced and your <a href='https://www.youtube.com/watch?v=mRr4HPMckpA'target='_blank' title='GitHub Pull Request: How to contribute to Open Source'>pull requests</a> are welcomed to contribute.</p>
            <p>For more React and JavaScript functional programming, explore:</p>
            <ul>
                <li><a href='https://www.youtube.com/channel/UCkUWDKByhIbPVzu1H47cVow' target='_blank' title='YouTube React and JavaScript Functional Programming'>7urtle JavaScript YouTube Channel</a></li>
                <li><a href='https://meet-martin.medium.com/' target='_blank' title='Medium Programming and Agile'>Meet Martin Medium articles</a></li>
            </ul>
            <p>The background photo is from Glenorchy, New Zealand, from a chilling morning of July 2021.</p>
            <p>See you with the next project :)</p>
            <p>- Martin</p>
        </GlassPaper>
    </BraveDeveloperDiv>

export default BraveDeveloper;