import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  SetGlobalSetting: "[Set Global] Action",
 
};

const initialGlobalState= {
  globalSettings: [],
  
};

export const reducer = persistReducer(
  { storage, key: "pollo-metamask-global", whitelist: ["globalSettings"] },
  (state = initialGlobalState, action) => {
    switch (action.type) {

      case actionTypes.SetGlobalSetting: {
        const { global } = action.payload;
        return { ...state, globalSettings: global };
      }
      

      default:
        return state;
    }
  }
);

export const actions = {
  
    setGlobalSetting: (global) => ({ type: actionTypes.SetGlobalSetting, payload: { global } }),
};

export function* saga() {

}
