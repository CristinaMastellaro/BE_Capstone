import { GET_ALL_COUTRIES_NAMES, SHOW_MODAL } from "../actions";
import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";

type inistialStateType = {
  showModal: boolean;
  songToSave: ShowSongType;
  nameCountries: string[];
};

const initialState: inistialStateType = {
  showModal: false,
  songToSave: { id: "", cover: "", title: "", author: "", preview: "" },
  nameCountries: [],
};

const optionsReducer = (
  state = initialState,
  action: ActionType<[boolean, ShowSongType] | string[]>
) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload[0],
        songToSave: action.payload[1],
      };
    case GET_ALL_COUTRIES_NAMES:
      return {
        ...state,
        nameCountries: action.payload,
      };
    default:
      return state;
  }
};

export default optionsReducer;
