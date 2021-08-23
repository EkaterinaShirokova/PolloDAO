import { all } from "redux-saga/effects";
import { combineReducers } from "redux";

import * as auth from "./Auth/authRedux";
import * as post from "./Post/postRedux";
import * as role from "./Role/roleRedux";
import * as proposal from "./Proposal/proposalRedux";
import * as notification from "./Notification/notificationRedux";
import * as global from "./GlobalSetting/globalRedux";


export const rootReducer = combineReducers({
    auth: auth.reducer,
    post: post.reducer,
    proposal: proposal.reducer, 
    notification: notification.reducer, 
    role: role.reducer,
    global: global.reducer,
});

export function* rootSaga() {
  yield all([auth.saga()]);
  yield all([post.saga()]);
  yield all([proposal.saga()]);
  yield all([notification.saga()]);
  yield all([role.saga()]);
  yield all([global.saga()]);

}
