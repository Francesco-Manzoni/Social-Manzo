import axios from 'axios';
import { setAlert } from './alert';

import {
  DELETE_ACCOUNT,
  GET_PROFILE,
  GET_PROFILES,
  PROFILE_ERROR,
  UPDATE_PROFILE,
  CLEAR_PROFILE,
  GET_REPO,
  NO_REPOS,
} from './types';

//Ottine profilo attuale
export const getCurrentProfile = () => async (dispatch) => {
  //get api/profile/me

  try {
    const res = await axios.get('/api/profile/me');

    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

// Crea o aggiorna il profilo
//history: voglio fare un redirect dopo il submit del form quindi passo il parametro history
//che ha il metodo push che ci ridireziona verso una rout definita lato client
export const createProfile = (FormData, history, edit = false) => async (
  dispatch
) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const res = await axios.post('/api/profile', FormData, config);

    dispatch({ type: GET_PROFILE, payload: res.data });

    dispatch(setAlert(edit ? 'Profilo aggiornato' : 'Profilo Creato'));

    if (!edit) {
      history.push('./dashboard');
    }
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Aggiungi esperienza
export const addExperience = (FormData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/experience', FormData, config);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });

    dispatch(setAlert('Esperienza aggiunta', 'success'));

    //ridereziono alla dashobard
    history.push('./dashboard');
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Aggiungi educazione
export const addEducation = (FormData, history) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const res = await axios.put('/api/profile/education', FormData, config);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });

    dispatch(setAlert('Educazione aggiunta', 'success'));

    //ridereziono alla dashobard
    history.push('./dashboard');
  } catch (error) {
    const errors = error.response.data.errors;

    if (errors) {
      errors.forEach((e) => {
        dispatch(setAlert(e.msg, 'danger'));
      });
    }

    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Cancella Esperienza
export const deleteExperience = (id) => async (dispatch) => {
  try {
    const res = await axios.delete(`api/profile/experience/${id}`);

    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert('Esperienza eliminata', 'success'));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Cancella Educazione
export const deleteEducation = (id) => async (dispatch) => {
  console.log(id, 'ID dentro profile');
  try {
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({ type: UPDATE_PROFILE, payload: res.data });
    dispatch(setAlert('Educazione eliminata', 'success'));
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Cancella account
export const deleteAccount = () => async (dispatch) => {
  if (window.confirm('Cancellare account?')) {
    try {
      await axios.delete(`/api/profile`);
      dispatch({
        type: CLEAR_PROFILE,
      });
      dispatch({ type: DELETE_ACCOUNT });
      dispatch(setAlert('Il tuo account è stato eliminato'));
    } catch (error) {
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
};

//Ottieni tutti i profili
export const getProfiles = () => async (dispatch) => {
  //faccio prima il clear del profilo singolo
  dispatch({ type: CLEAR_PROFILE });
  try {
    const res = await axios.get('/api/profile');

    dispatch({ type: GET_PROFILES, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Profilo da id
export const getProfileById = (userId) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/user/${userId}`);

    dispatch({ type: GET_PROFILE, payload: res.data });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//github repos
export const getGithubRepos = (username) => async (dispatch) => {
  try {
    const res = await axios.get(`/api/profile/github/${username}`);

    dispatch({ type: GET_REPO, payload: res.data });
  } catch (error) {
    dispatch({
      type: NO_REPOS,
    });
  }
};
