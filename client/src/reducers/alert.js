import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_ALERT:
      //faccio così perhè nel caso ci sia già uno stato ne aggiunge un altro a quello esistente
      return [...state, payload];
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
