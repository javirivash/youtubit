import {
  GET_RESULT_VIDEOS,
  SET_SELECTED_VIDEO,
  LOAD_PLAYER_SUCCESS,
  LOAD_PLAYER_ERROR,
  SET_LOADING,
  TOGGLE_THEME,
  ACTIVATE_LOGIN,
  DEACTIVATE_LOGIN,
  SIGN_UP_USER,
  LOG_IN_USER,
  LOG_OUT_USER,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
} from '../types';
import updateLocalFavorites from '../../utils/updateLocalFavorites';

export default (state, action) => {
  switch (action.type) {
    case GET_RESULT_VIDEOS: {
      const merged = updateLocalFavorites(
        action.payload.resultVideos,
        state.relatedVideos,
        state.currentFavorites,
      );
      return {
        ...state,
        searchText: action.payload.query,
        resultVideos: merged.results,
        loading: false,
      };
    }
    case SET_SELECTED_VIDEO:
      return {
        ...state,
        selectedVideo: action.payload,
      };
    case LOAD_PLAYER_SUCCESS:
      return {
        ...state,
        selectedVideo: action.payload.selectedVideo,
        resultVideos: action.payload.updatedLocalFavorites.results,
        relatedVideos: action.payload.updatedLocalFavorites.related,
        currentFavorites: action.payload.updatedLocalFavorites.favorites,
        loading: false,
      };

    case LOAD_PLAYER_ERROR:
      return {
        ...state,
        relatedVideos: action.payload.updatedLocalFavorites.related,
        loading: false,
      };
    case SET_LOADING:
      return {
        ...state,
        loading: true,
      };
    case TOGGLE_THEME:
      return {
        ...state,
        theme: action.payload,
      };
    case ACTIVATE_LOGIN:
      return {
        ...state,
        shouldShowLogin: true,
      };
    case DEACTIVATE_LOGIN:
      return {
        ...state,
        shouldShowLogin: false,
      };
    case SIGN_UP_USER:
      return {
        ...state,
        currentUser: action.payload,
        currentFavorites: [],
      };
    case LOG_IN_USER: {
      const merged = updateLocalFavorites(
        state.resultVideos,
        state.relatedVideos,
        action.payload.favorites,
      );
      return {
        ...state,
        currentUser: action.payload.user,
        resultVideos: merged.results,
        relatedVideos: merged.related,
        currentFavorites: merged.favorites,
      };
    }
    case LOG_OUT_USER:
      return {
        ...state,
        currentUser: {},
        currentFavorites: [],
      };
    case ADD_FAVORITE:
      return {
        ...state,
        resultVideos: action.payload.results,
        relatedVideos: action.payload.related,
        currentFavorites: action.payload.favorites,
      };
    case REMOVE_FAVORITE:
      return {
        ...state,
        resultVideos: action.payload.results,
        relatedVideos: action.payload.related,
        currentFavorites: action.payload.favorites,
      };
    default:
      return state;
  }
};
