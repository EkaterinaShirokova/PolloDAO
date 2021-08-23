import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  SetAllRoles: "[Set AllRoles] Action",
 
};

const initialRoleState = {
  allRoles: [],
  
};

export const reducer = persistReducer(
  { storage, key: "pollo-metamask-roles", whitelist: ["allRoles"] },
  (state = initialRoleState, action) => {
    switch (action.type) {

      case actionTypes.SetAllRoles: {
        const { roles } = action.payload;
        return { ...state, allRoles: roles };
      }
      

      default:
        return state;
    }
  }
);

export const actions = {
  
  setAllRoles: (roles) => ({ type: actionTypes.SetAllRoles, payload: { roles } }),
};

export function* saga() {

}
