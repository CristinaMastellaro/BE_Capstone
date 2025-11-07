import ActionType from "../../types/ActionType";
import { SET_USERNAME } from "../actions";

type stateType = {
  name: string;
};

const initialState: stateType = {
  name: "",
};

const usernameReducer = (state = initialState, action: ActionType<string>) => {
  switch (action.type) {
    case SET_USERNAME:
      return {
        ...state,
        name: action.payload,
      };
    default:
      return state;
  }
};

export default usernameReducer;
