import React, { useEffect, useContext } from 'react';
import QRCode from 'qrcode.react';
import { isEqual, isNothing } from '@7urtle/lambda';
import shortid from 'shortid';

import { StoreContext } from '../store/StoreContext';

const AuthenticationQRCode = () => {
    const { state, actions } = useContext(StoreContext);
    const isDevelopment = isEqual('development')(process.env.NODE_ENV);
    const uniqueID = shortid.generate();

    useEffect(() => isDevelopment && isNothing(state.ngrokURL) && actions.requestNgrokURL(), []);

    return (
        <>
            {isDevelopment && <>{state.ngrokURL ? <QRCode value={`didcomm://${state.ngrokURL}/did/authentication/${uniqueID}`} size={300} /> : <p>Loading QR Code</p>}</>}
            {!isDevelopment && <QRCode value={`didcomm://${window.location}/.netlify/functions/did/authentication/${uniqueID}`} size={300} />}
        </>
    );
};

export default AuthenticationQRCode;
