import ActionType from "../../types/ActionType";
import {
  SET_EMAIL,
  SET_NAME,
  SET_SURNAME,
  SET_TOKEN,
  SET_USERNAME,
} from "../actions";

type stateType = {
  username: string;
  name: string;
  surname: string;
  email: string;
  token: string;
};

const initialState: stateType = {
  username: "",
  name: "",
  surname: "",
  email: "",
  token: "",
};

const usernameReducer = (state = initialState, action: ActionType<string>) => {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_USERNAME:
      return {
        ...state,
        username: action.payload,
      };
    case SET_NAME:
      return {
        ...state,
        name: action.payload,
      };
    case SET_SURNAME:
      return {
        ...state,
        surname: action.payload,
      };
    case SET_EMAIL:
      return {
        ...state,
        email: action.payload,
      };
    default:
      return state;
  }
};

export default usernameReducer;
