import { useEffect, useState } from 'react';
import { includes, reduce, lowerCaseOf } from '@7urtle/lambda';

const mobileDevices = ['ipad', 'iphone', 'ipod', 'android'];
const includesAnyOf = where => reduce(false)((a, c) => includes(c)(where) ? true : a);
const isDeviceMobile = () =>
    includesAnyOf(lowerCaseOf(navigator.userAgent))(mobileDevices) ||
    includesAnyOf(lowerCaseOf(navigator.platform))(mobileDevices) ||
    (includes("Mac")(navigator.userAgent) && "ontouchend" in document);
    
const useDeviceType = () => {
    const [isMobile, setMobile] = useState(false);

    useEffect(() => setMobile(isDeviceMobile()), []);

    return isMobile;
};

export default useDeviceType;