import React, { useReducer, useEffect, useState } from 'react';
import AppContext from './appContext';
import AppReducer from './appReducer';
import { youtubeSearch, youtubeVideos } from '../../api/youtube';
import { auth, db } from '../../firebase/client';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, set, remove } from 'firebase/database';
import validateItems from '../../utils/validateItems';
import getFavorites from '../../utils/getFavorites';
import updateLocalFavorites from '../../utils/updateLocalFavorites';
import { useAlertContext } from '../alert/alertContext';
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme, GlobalStyles } from './themes';
import {
  GET_RESULT_VIDEOS,
  SET_SELECTED_VIDEO,
  LOAD_PLAYER_SUCCESS,
  LOAD_PLAYER_ERROR,
  SET_LOADING,
  TOGGLE_THEME,
  ACTIVATE_LOGIN,
  DEACTIVATE_LOGIN,
  TOGGLE_MENU,
  SIGN_UP_USER,
  LOG_IN_USER,
  LOG_OUT_USER,
  ADD_FAVORITE,
  REMOVE_FAVORITE,
} from '../types';

const AppState = ({ children }) => {
  const initialState = {
    searchText: '',
    resultVideos: [],
    selectedVideo: {},
    relatedVideos: [],
    currentUser: {},
    currentFavorites: [],
    shouldShowMenu: false,
    shouldShowLogin: false,
    loading: true,
    theme: 'light',
  };

  const [state, dispatch] = useReducer(AppReducer, initialState);
  const [authResolved, setAuthResolved] = useState(false);
  const { setAlert } = useAlertContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          isLoggedIn: true,
        };
        const favorites = await getFavorites(user.id);
        const updatedLocalFavorites = updateLocalFavorites([], [], favorites);
        dispatch({ type: LOG_IN_USER, payload: { user, updatedLocalFavorites } });
      }
      setAuthResolved(true);
    });
    return unsubscribe;
  }, []);

  // GET RESULT VIDEOS
  const getResultVideos = async (query) => {
    setLoading();
    try {
      const data = await youtubeSearch({ q: query });
      const resultVideos = validateItems(data.items);
      const updatedLocalFavorites = updateLocalFavorites(
        resultVideos,
        state.relatedVideos,
        state.currentFavorites,
      );

      dispatch({
        type: GET_RESULT_VIDEOS,
        payload: { query, updatedLocalFavorites },
      });
    } catch (error) {
      setAlert('Error: Failed fetching results');
      console.error('getResultVideos: Something went wrong... ', error);
    }
  };

  // SET SELECTED VIDEO
  const setSelectedVideo = (video) => {
    dispatch({ type: SET_SELECTED_VIDEO, payload: video });
  };

  // LOAD PLAYER VIDEOS
  const loadPlayerById = async ({ videoId, includeRelated }) => {
    setLoading();

    try {
      const data = await youtubeVideos({ videoId, includeRelated });
      const relatedVideos = includeRelated
        ? validateItems(data.relatedItems || [])
        : [];

      const updatedLocalFavorites = updateLocalFavorites(
        state.resultVideos,
        relatedVideos,
        state.currentFavorites,
      );

      dispatch({
        type: LOAD_PLAYER_SUCCESS,
        payload: {
          selectedVideo: data.selectedVideo,
          updatedLocalFavorites,
        },
      });
    } catch (error) {
      setAlert('Error: Failed loading player');
      console.error('loadPlayerById failed:', error);

      dispatch({
        type: LOAD_PLAYER_ERROR,
        payload: {
          updatedLocalFavorites: {
            results: state.resultVideos,
            related: [],
            favorites: state.currentFavorites,
          },
        },
      });
    }
  };

  // SET LOADING
  const setLoading = () => {
    dispatch({ type: SET_LOADING });
  };

  // TOGGLE THEME
  const toggleTheme = () => {
    const updatedTheme = state.theme === 'light' ? 'dark' : 'light';
    dispatch({ type: TOGGLE_THEME, payload: updatedTheme });
  };

  // ACTIVATE LOGIN
  const activateLogin = () => {
    dispatch({ type: ACTIVATE_LOGIN });
  };

  // DEACTIVATE LOGIN
  const deactivateLogin = () => {
    dispatch({ type: DEACTIVATE_LOGIN });
  };

  //TOGGLE MENU
  const toggleMenu = () => {
    const updatedState = !state.shouldShowMenu;
    dispatch({ type: TOGGLE_MENU, payload: updatedState });
  };

  // SIGN UP USER
  const signUpUser = async (email, password) => {
    let user;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      user = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        isLoggedIn: true,
      };
      deactivateLogin();
      setAlert(`You've successfully signed up as ${user.email}`);
    } catch (error) {
      user = {};
      setAlert('Error while signing up: ' + error.message);
    }

    dispatch({
      type: SIGN_UP_USER,
      payload: user,
    });
  };

  // LOG IN USER
  const logInUser = async (email, password) => {
    let user = {};
    let updatedLocalFavorites = {
      results: state.resultVideos,
      related: state.relatedVideos,
      favorites: state.currentFavorites,
    };
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      user = {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        isLoggedIn: true,
      };
      const favorites = await getFavorites(user.id);
      updatedLocalFavorites = updateLocalFavorites(
        state.resultVideos,
        state.relatedVideos,
        favorites,
      );
      deactivateLogin();
      setAlert(`You've successfully logged in as ${user.email}`);
    } catch (error) {
      setAlert('Error while logging in: ' + error.message);
    }

    dispatch({
      type: LOG_IN_USER,
      payload: { user, updatedLocalFavorites },
    });
  };

  // LOG OUT USER
  const logOutUser = async () => {
    try {
      await signOut(auth);
      setAlert('You have successfully logged out');
    } catch (error) {
      setAlert('There was a problem while logging out' + error.mess);
      console.error('logOutUser: Something went wrong... ', error);
    }

    dispatch({
      type: LOG_OUT_USER,
    });
  };

  // ADD FAVORITE
  const addFavorite = async (video) => {
    const userId = state.currentUser.id;
    let updatedLocalFavorites = {
      results: state.resultVideos,
      related: state.relatedVideos,
      favorites: state.currentFavorites,
    };
    try {
      await set(ref(db, `users/${userId}/${video.id}`), video);
      const favorites = await getFavorites(userId);
      updatedLocalFavorites = updateLocalFavorites(
        state.resultVideos,
        state.relatedVideos,
        favorites,
      );
      setAlert('Added to Favorites');
    } catch (error) {
      setAlert('There was an error while adding to Favorites' + error.message);
      console.error('addFavorite: Something went wrong... ', error);
    }
    dispatch({
      type: ADD_FAVORITE,
      payload: updatedLocalFavorites,
    });
  };

  // REMOVE FAVORITE
  const removeFavorite = async (videoId) => {
    const userId = state.currentUser.id;
    let updatedLocalFavorites = {
      results: state.resultVideos,
      related: state.relatedVideos,
      favorites: state.currentFavorites,
    };
    try {
      await remove(ref(db, `users/${userId}/${videoId}`));
      const favorites = await getFavorites(userId);
      updatedLocalFavorites = updateLocalFavorites(
        state.resultVideos,
        state.relatedVideos,
        favorites,
      );
      setAlert('Removed from Favorites');
    } catch (error) {
      setAlert(
        'There was an error while removing from Favorites' + error.message,
      );
      console.error('removeFavorite: Something went wrong... ', error);
    }

    dispatch({
      type: REMOVE_FAVORITE,
      payload: updatedLocalFavorites,
    });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        authResolved,
        getResultVideos,
        setSelectedVideo,
        loadPlayerById,
        setLoading,
        toggleTheme,
        activateLogin,
        deactivateLogin,
        toggleMenu,
        signUpUser,
        logInUser,
        logOutUser,
        addFavorite,
        removeFavorite,
      }}
    >
      <ThemeProvider theme={state.theme === 'light' ? lightTheme : darkTheme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
};

export default AppState;
