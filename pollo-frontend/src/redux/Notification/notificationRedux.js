import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    SetNotifications: "[Set Notifications] Action",
};

const initialNotificationState = {
    notifications: null,
};

export const reducer = persistReducer(
    { storage, key: "pollo-metamask-notification", whitelist: ["notifications"] },
    (state = initialNotificationState, action) => {
        switch (action.type) {

            case actionTypes.SetNotifications: {
                const { notifications } = action.payload;
                return { ...state, notifications: notifications };
            }

            default:
                return state;
        }
    }
);

export const actions = {
    SetNotifications: (notifications) => ({ type: actionTypes.SetNotifications, payload: { notifications } }),
};

export function* saga() {

}
