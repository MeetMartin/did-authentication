import React, { useEffect, useContext, useState } from 'react';
import QRCode from 'qrcode.react';
import { isEqual, isNothing, isJust } from '@7urtle/lambda';

import { StoreContext } from '../store/StoreContext';
import useDeviceType from '../hooks/useDeviceType';
import GlassButton from './GlassButton';

const AuthenticationQRCode = ({ QRInput }) => {
    const { state, actions } = useContext(StoreContext);

    const isDevelopment = isEqual('development')(process.env.NODE_ENV);
    
    const isMobile = useDeviceType();
    const [isMobileButtonClicked, setIsMobileButtonClicked] = useState(false);
    const [didcomm, setDidcomm] = useState(`didcomm://${window.location.origin}/.netlify/functions/did/authentication/${QRInput}`);

    useEffect(() => isDevelopment && isNothing(state.ngrokURL) && actions.requestNgrokURL(), []);
    useEffect(() => { isJust(state.ngrokURL) && setDidcomm(`didcomm://${state.ngrokURL}/did/authentication/${QRInput}`) }, [state.ngrokURL])

    return (
        <>
            {!isMobile &&
                <>
                    <p>Scan the QR code using MATTR Wallet:</p>
                    {isDevelopment && <>{state.ngrokURL ? <QRCode value={didcomm} size={300} /> : <p>Loading QR Code</p>}</>}
                    {!isDevelopment && <QRCode value={didcomm} size={300} />}
                </>
            ||
                <p>
                    {!isMobileButtonClicked &&
                        <a href={`global.mattr.wallet://accept/${window.btoa(unescape(encodeURIComponent(didcomm)))}`}
                           onClick={() => setIsMobileButtonClicked(true)}
                        >
                            <GlassButton>Authenticate in MATTR Wallet on Mobile</GlassButton>
                        </a>
                    }
                </p>
            }
        </>
    );
};

export default AuthenticationQRCode;
