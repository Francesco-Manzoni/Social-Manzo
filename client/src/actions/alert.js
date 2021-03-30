import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuid } from 'uuid';

//qua creo gli alert che verranno usati in altre parti del programma

export const setAlert = (msg, alertType, timeout = 5000) => (dispatch) => {
  const id = uuid(); //ritorna un id randomico
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id },
  });

  //imposto un timer per rimuovere l'alert dopo 5 secondi
  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout);
};
