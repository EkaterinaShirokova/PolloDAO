import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
    StoreAllProposals: "STORE_ALL_PROPOSALS",
    StoreSingleProposal: "STORE_SINGLE_PROPOSAL"
};

const initialProposal = {createdBy: 'amirmehr', status: 'pending', options: [{}]};
const initialState = {
    items: [],
    single: initialProposal
};

export const reducer = persistReducer(
  { storage, key: "pollo-metamask-proposal", whitelist: ["proposals"] },
  (state = initialState, action) => {
    switch (action.type) {

      case actionTypes.StoreAllProposals: {
          return { ...state, items: action.payload, single: initialProposal };
      }

      case actionTypes.StoreSingleProposal: {
        return { ...state, single: action.payload };
      }

      default:
        return state;
    }
  }
);


export const actions = {
  StoreAllProposals: model => ({ type: actionTypes.StoreAllProposals, payload: model }),
  StoreSingleProposal: model => ({ type: actionTypes.StoreSingleProposal, payload: model }),
};

export function* saga() {

}
