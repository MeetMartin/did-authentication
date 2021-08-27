import React, { useEffect, useContext, useState } from 'react';
import QRCode from 'qrcode.react';
import { isEqual, isNothing } from '@7urtle/lambda';

import { StoreContext } from '../store/StoreContext';

const AuthenticationQRCode = ({ QRInput }) => {
    const { state, actions } = useContext(StoreContext);
    const isDevelopment = isEqual('development')(process.env.NODE_ENV);
    const [isMobile, setMobile] = useState(false);

    useEffect(() => isDevelopment && isNothing(state.ngrokURL) && actions.requestNgrokURL(), []);
    useEffect(() => { window.addEventListener('resize', () => setMobile(window.innerWidth <= 768)); }, []);

    return (
        <>
            {!isMobile &&
                <>
                    <p>Scan the QR code using MATTR Wallet:</p>
                    {isDevelopment && <>{state.ngrokURL ? <QRCode value={`didcomm://${state.ngrokURL}/did/authentication/${QRInput}`} size={300} /> : <p>Loading QR Code</p>}</>}
                    {!isDevelopment && <QRCode value={`didcomm://${window.location}/.netlify/functions/did/authentication/${QRInput}`} size={300} />}
                </>
            }
            <a href={`global.mattr.wallet://accept/${window.btoa(unescape(encodeURIComponent(`didcomm://${state.ngrokURL}/did/authentication/${QRInput}`)))}`}>Authenticate in MATTR Wallet on Mobile</a>
        </>
    );
};

export default AuthenticationQRCode;
