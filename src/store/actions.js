import types from "./types";

export const useActions = (state, dispatch) => ({
    requestNgrokURL: payload => dispatch({type: types.REQUEST_NGROK_URL, payload: payload})
});