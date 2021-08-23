import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  SetAllUsers: "[Set AllUsers] Action",
  SetUser: "[Set User] Action",
  SetWallet: "[Set Wallet] Action",
  SetWalletType: "[Set Wallet Type] Action",
  SetToken: "[Set Token] Action",
  SetRestrictedUsers: "[Set Restricted User] Action"
};

const initialAuthState = {
  allUsers: [],
  currentUser: undefined,
  currentToken: undefined,
  currentWallet: undefined,
  currentWalletType: undefined,
  restrictedUsers:[],
};

export const reducer = persistReducer(
  { storage, key: "pollo-metamask-auth", whitelist: ["allUsers", "currentUser", "currentWallet", "currentWalletType", "currentToken"] },
  (state = initialAuthState, action) => {
    switch (action.type) {

      case actionTypes.SetAllUsers: {
        const { users } = action.payload;
        return { ...state, allUsers: users };
      }
      case actionTypes.SetUser: {
        const { user } = action.payload;
        return { ...state, currentUser: user };
      }
      case actionTypes.SetToken: {
        const { token } = action.payload;
        return { ...state, currentToken: token };
      }
      case actionTypes.SetWallet: {
        const { wallet } = action.payload;
        return { ...state, currentWallet: wallet };
      }
      case actionTypes.SetWalletType: {
        const { walletType } = action.payload;
        return { ...state, currentWalletType: walletType};
      }
      case actionTypes.SetRestrictedUsers: {
        const { restrict } = action.payload;
        return { ...state, restrictedUsers: restrict };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  setUser: (user) => ({ type: actionTypes.SetUser, payload: { user } }),
  setToken: (token) => ({ type: actionTypes.SetToken, payload: { token }}),
  setAllUsers: (users) => ({ type: actionTypes.SetAllUsers, payload: { users } }),
  setWallet: (wallet) => ({ type: actionTypes.SetWallet, payload: { wallet } }),
  setWalletType: (walletType) => ({ type: actionTypes.SetWalletType, payload: { walletType }}),
  setRestrictedUsers: (restrict) => ({ type: actionTypes.SetRestrictedUsers, payload: { restrict } }),
};

export function* saga() {

}
