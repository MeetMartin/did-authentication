import React from 'react';
import styled from 'styled-components';

import AuthenticationQRCode from '../components/AuthenticationQRCode';

const StoreBadges = styled.div`
    img {
        float: left;
    }
    padding: 20px 0;
    height: 60px;
`;
const GoogleStoreBadge = styled.div`
    img {
        height: 60px;
        position: relative;
        bottom: 10px;
    }
`;

const QRInfo = () => {
    return (
        <>
            <p>You can download the MATTR wallet app on
                the <a href="https://apps.apple.com/us/app/mattr-wallet/id1518660243" rel="noreferrer noopener">App Store</a><br /> or
                on <a href="https://play.google.com/store/apps/details?id=global.mattr.wallet" rel="noreferrer noopener">Google Play</a>.
            </p>
            <StoreBadges>
                <a href="https://apps.apple.com/us/app/mattr-wallet/id1518660243?itsct=apps_box_badge&amp;itscg=30200">
                    <img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1616544000&h=0cf6e995f93f63c55d1d2a361e37f9df" alt="Download on the App Store" />
                </a>
                <a href='https://play.google.com/store/apps/details?id=global.mattr.wallet&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'>
                    <GoogleStoreBadge>
                        <img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' />
                    </GoogleStoreBadge>
                </a>
            </StoreBadges>
            <p>Scan the QR code using MATTR wallet:</p>
            <AuthenticationQRCode />
        </>
    );
};

export default QRInfo;