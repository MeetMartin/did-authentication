import React, { useEffect, useContext } from 'react';
import QRCode from 'qrcode.react';
import { isEqual, isNothing } from '@7urtle/lambda';

import { StoreContext } from '../store/StoreContext';

const AuthenticationQRCode = ({ QRInput }) => {
    const { state, actions } = useContext(StoreContext);
    const isDevelopment = isEqual('development')(process.env.NODE_ENV);

    useEffect(() => isDevelopment && isNothing(state.ngrokURL) && actions.requestNgrokURL(), []);

    return (
        <>
            {isDevelopment && <>{state.ngrokURL ? <QRCode value={`didcomm://${state.ngrokURL}/did/authentication/${QRInput}`} size={300} /> : <p>Loading QR Code</p>}</>}
            {!isDevelopment && <QRCode value={`didcomm://${window.location}/.netlify/functions/did/authentication/${QRInput}`} size={300} />}
        </>
    );
};

export default AuthenticationQRCode;
