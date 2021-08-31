import React, { useEffect, useContext, useState } from 'react';
import QRCode from 'qrcode.react';
import { isEqual, isNothing, isJust, includes, reduce, lowerCaseOf } from '@7urtle/lambda';

import { StoreContext } from '../store/StoreContext';
import GlassButton from './GlassButton';

const AuthenticationQRCode = ({ QRInput }) => {
    const { state, actions } = useContext(StoreContext);

    const isDevelopment = isEqual('development')(process.env.NODE_ENV);

    const [isMobile, setMobile] = useState(false);
    const [didcomm, setDidcomm] = useState(`didcomm://${window.location.origin}/.netlify/functions/did/authentication/${QRInput}`);

    const mobileDevices = ['ipad', 'iphone', 'ipod', 'android'];
    const includesAnyOf = where => reduce(false)((a, c) => includes(c)(where) ? true : a);
    const isDeviceMobile = () =>
        includesAnyOf(lowerCaseOf(navigator.userAgent))(mobileDevices) ||
        includesAnyOf(lowerCaseOf(navigator.platform))(mobileDevices) ||
        (includes("Mac")(navigator.userAgent) && "ontouchend" in document);

    useEffect(() => isDevelopment && isNothing(state.ngrokURL) && actions.requestNgrokURL(), []);
    useEffect(() => { isJust(state.ngrokURL) && setDidcomm(`didcomm://${state.ngrokURL}/did/authentication/${QRInput}`) }, [state.ngrokURL])
    useEffect(() => setMobile(isDeviceMobile()), []);

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
                    <a href={`global.mattr.wallet://accept/${window.btoa(unescape(encodeURIComponent(didcomm)))}`}>
                        <GlassButton>Authenticate in MATTR Wallet on Mobile</GlassButton>
                    </a>
                    <div>{`global.mattr.wallet://accept/${window.btoa(unescape(encodeURIComponent(didcomm)))}`}</div>
                    <a href={`global.mattr.wallet://accept/${window.btoa((encodeURIComponent(didcomm)))}`}>
                        <GlassButton>Authenticate in MATTR Wallet on Mobile</GlassButton>
                    </a>
                    <div>{`global.mattr.wallet://accept/${window.btoa((encodeURIComponent(didcomm)))}`}</div>
                    <a href={`global.mattr.wallet://accept/${window.btoa(((didcomm)))}`}>
                        <GlassButton>Authenticate in MATTR Wallet on Mobile</GlassButton>
                    </a>
                    <div>{`global.mattr.wallet://accept/${window.btoa(((didcomm)))}`}</div>
                    <div>{`global.mattr.wallet://accept/${didcomm}`}</div>
                </p>
            }
        </>
    );
};

export default AuthenticationQRCode;
