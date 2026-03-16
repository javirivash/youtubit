import appReducer from './appReducer';
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
import {
  resultVideos,
  relatedVideos,
  selectedVideo,
  currentUser,
  currentFavorites,
} from '../../utils/testMocks';

const baseState = {
  searchText: 'wizeline',
  resultVideos: [],
  relatedVideos: [],
  selectedVideo: {},
  currentUser: {},
  currentFavorites: [],
  loading: false,
  shouldShowLogin: false,
  theme: 'light',
};

describe('appReducer', () => {
  it('returns current state for unknown action', () => {
    const state = appReducer(baseState, { type: 'UNKNOWN' });
    expect(state).toBe(baseState);
  });

  describe('GET_RESULT_VIDEOS', () => {
    it('sets resultVideos, searchText, and loading to false', () => {
      const state = appReducer(
        { ...baseState, loading: true },
        {
          type: GET_RESULT_VIDEOS,
          payload: { resultVideos, query: 'react' },
        },
      );
      expect(state.searchText).toBe('react');
      expect(state.resultVideos).toHaveLength(resultVideos.length);
      expect(state.loading).toBe(false);
    });

    it('merges favorites into result videos', () => {
      const state = appReducer(
        { ...baseState, currentFavorites },
        {
          type: GET_RESULT_VIDEOS,
          payload: { resultVideos, query: 'wizeline' },
        },
      );
      const matched = state.resultVideos.find(
        (v) => v.id === currentFavorites[0].id,
      );
      expect(matched.isFavorite).toBe(true);
    });
  });

  describe('SET_SELECTED_VIDEO', () => {
    it('sets selectedVideo', () => {
      const state = appReducer(baseState, {
        type: SET_SELECTED_VIDEO,
        payload: selectedVideo,
      });
      expect(state.selectedVideo).toBe(selectedVideo);
    });
  });

  describe('LOAD_PLAYER_SUCCESS', () => {
    it('sets selectedVideo, videos, favorites, and loading to false', () => {
      const updatedLocalFavorites = {
        results: resultVideos,
        related: relatedVideos,
        favorites: currentFavorites,
      };
      const state = appReducer(
        { ...baseState, loading: true },
        {
          type: LOAD_PLAYER_SUCCESS,
          payload: { selectedVideo, updatedLocalFavorites },
        },
      );
      expect(state.selectedVideo).toBe(selectedVideo);
      expect(state.resultVideos).toBe(resultVideos);
      expect(state.relatedVideos).toBe(relatedVideos);
      expect(state.currentFavorites).toBe(currentFavorites);
      expect(state.loading).toBe(false);
    });
  });

  describe('LOAD_PLAYER_ERROR', () => {
    it('sets relatedVideos and loading to false', () => {
      const updatedLocalFavorites = { related: relatedVideos };
      const state = appReducer(
        { ...baseState, loading: true },
        {
          type: LOAD_PLAYER_ERROR,
          payload: { updatedLocalFavorites },
        },
      );
      expect(state.relatedVideos).toBe(relatedVideos);
      expect(state.loading).toBe(false);
    });
  });

  describe('SET_LOADING', () => {
    it('sets loading to true', () => {
      const state = appReducer(baseState, { type: SET_LOADING });
      expect(state.loading).toBe(true);
    });
  });

  describe('TOGGLE_THEME', () => {
    it('sets theme to payload value', () => {
      const state = appReducer(baseState, {
        type: TOGGLE_THEME,
        payload: 'dark',
      });
      expect(state.theme).toBe('dark');
    });
  });

  describe('ACTIVATE_LOGIN', () => {
    it('sets shouldShowLogin to true', () => {
      const state = appReducer(baseState, { type: ACTIVATE_LOGIN });
      expect(state.shouldShowLogin).toBe(true);
    });
  });

  describe('DEACTIVATE_LOGIN', () => {
    it('sets shouldShowLogin to false', () => {
      const state = appReducer(
        { ...baseState, shouldShowLogin: true },
        { type: DEACTIVATE_LOGIN },
      );
      expect(state.shouldShowLogin).toBe(false);
    });
  });

  describe('SIGN_UP_USER', () => {
    it('sets currentUser and resets currentFavorites', () => {
      const state = appReducer(
        { ...baseState, currentFavorites },
        { type: SIGN_UP_USER, payload: currentUser },
      );
      expect(state.currentUser).toBe(currentUser);
      expect(state.currentFavorites).toEqual([]);
    });
  });

  describe('LOG_IN_USER', () => {
    it('sets currentUser and merges favorites into videos', () => {
      const updatedLocalFavorites = {
        results: resultVideos,
        related: relatedVideos,
        favorites: currentFavorites,
      };
      const state = appReducer(baseState, {
        type: LOG_IN_USER,
        payload: { user: currentUser, updatedLocalFavorites },
      });
      expect(state.currentUser).toBe(currentUser);
      expect(state.resultVideos).toBe(resultVideos);
      expect(state.relatedVideos).toBe(relatedVideos);
      expect(state.currentFavorites).toBe(currentFavorites);
    });
  });

  describe('LOG_OUT_USER', () => {
    it('clears currentUser and currentFavorites', () => {
      const state = appReducer(
        { ...baseState, currentUser, currentFavorites },
        { type: LOG_OUT_USER },
      );
      expect(state.currentUser).toEqual({});
      expect(state.currentFavorites).toEqual([]);
    });
  });

  describe('ADD_FAVORITE', () => {
    it('updates resultVideos, relatedVideos, and currentFavorites', () => {
      const payload = {
        results: resultVideos,
        related: relatedVideos,
        favorites: currentFavorites,
      };
      const state = appReducer(baseState, {
        type: ADD_FAVORITE,
        payload,
      });
      expect(state.resultVideos).toBe(resultVideos);
      expect(state.relatedVideos).toBe(relatedVideos);
      expect(state.currentFavorites).toBe(currentFavorites);
    });
  });

  describe('REMOVE_FAVORITE', () => {
    it('updates resultVideos, relatedVideos, and currentFavorites', () => {
      const payload = {
        results: resultVideos,
        related: relatedVideos,
        favorites: [],
      };
      const state = appReducer(
        { ...baseState, currentFavorites },
        { type: REMOVE_FAVORITE, payload },
      );
      expect(state.resultVideos).toBe(resultVideos);
      expect(state.relatedVideos).toBe(relatedVideos);
      expect(state.currentFavorites).toEqual([]);
    });
  });
});
