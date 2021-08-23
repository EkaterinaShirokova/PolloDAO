import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export const actionTypes = {
  SetPosts: "[Set Posts] Action",
  SetSelectedPost: "[Set Selected Post] Action",
  SetSelectedPostUser: "[Set Selected Post User] Action",
  SetPageNumber: "[Set Selected Page] Action",
};

const initialPostState = {
  posts: [],
  selectedPost: null,
  selectedPostUser:null,
  pageNumber: null,
};

export const reducer = persistReducer(
  { storage, key: "pollo-metamask-post", whitelist: ["posts","selectedPost","selectedPostUser","pageNumber"] },
  (state = initialPostState, action) => {
    switch (action.type) {

      case actionTypes.SetPosts: {
        const { posts } = action.payload;
        return { ...state, posts: posts };
      }
      case actionTypes.SetSelectedPost: {
        const { post } = action.payload;
        return { ...state, selectedPost: post };
      }
      case actionTypes.SetSelectedPostUser: {
        const { userPost } = action.payload;
        return { ...state, selectedPostUser: userPost };
      }
      case actionTypes.SetPageNumber: {
        const { number } = action.payload;
        return { ...state, pageNumber: number };
      }

      default:
        return state;
    }
  }
);

export const actions = {
  SetPosts: (posts) => ({ type: actionTypes.SetPosts, payload: { posts } }),
  SetSelectedPost: (post) => ({ type: actionTypes.SetSelectedPost, payload: { post } }),
  SetSelectedPostUser: (userPost) => ({ type: actionTypes.SetSelectedPostUser, payload: { userPost } }),
  SetPageNumber: (number) => ({ type: actionTypes.SetPageNumber, payload: { number } }),
};

export function* saga() {

}
