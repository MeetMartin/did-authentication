import types from "./types";

export const useActions = (state, dispatch) =>
    (myDispatch => ({
        requestNgrokURL: myDispatch(types.REQUEST_NGROK_URL),
        receiveUserName: myDispatch(types.RECEIVE_USER_NAME),
        requestSignUp: myDispatch(types.REQUEST_SIGN_UP)
    }))(type => payload => dispatch({ type: type, payload: payload }));