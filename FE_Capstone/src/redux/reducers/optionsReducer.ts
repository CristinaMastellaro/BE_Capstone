import { SHOW_MODAL } from "../actions";
import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";

type inistialStateType = {
  showModal: boolean;
  songToSave: ShowSongType;
};

const initialState: inistialStateType = {
  showModal: false,
  songToSave: { id: "", cover: "", title: "", author: "", preview: "" },
};

const optionsReducer = (
  state = initialState,
  action: ActionType<[boolean, ShowSongType]>
) => {
  switch (action.type) {
    case SHOW_MODAL:
      return {
        ...state,
        showModal: action.payload[0],
        songToSave: action.payload[1],
      };
    default:
      return state;
  }
};

export default optionsReducer;
