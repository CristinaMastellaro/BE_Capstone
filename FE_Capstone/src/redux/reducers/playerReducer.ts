import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";
import {
  CURRENT_PLAYLIST,
  CURRENT_SONG,
  IS_ON_REPEAT,
  IS_PLAYING,
  IS_SHUFFLED,
  RESET_PLAYLIST,
} from "../actions";

type stateType = {
  currentSong: ShowSongType;
  currentPlaylist: ShowSongType[];
  isPlaying: boolean;
  isOnRepeat: boolean;
  isShuffled: boolean;
};

const initialState: stateType = {
  currentSong: { id: "", cover: "", title: "", author: "", preview: "" },
  currentPlaylist: [],
  isPlaying: false,
  isOnRepeat: false,
  isShuffled: false,
};

const playerReducer = (
  state = initialState,
  action: ActionType<ShowSongType | boolean>
) => {
  switch (action.type) {
    case CURRENT_SONG:
      return {
        ...state,
        currentSong: action.payload,
      };
    case RESET_PLAYLIST:
      return {
        ...state,
        currentPlaylist: [],
      };
    case CURRENT_PLAYLIST:
      return {
        ...state,
        currentPlaylist: state.currentPlaylist.concat(
          action.payload as ShowSongType
        ),
      };
    case IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload,
      };
    case IS_ON_REPEAT:
      return {
        ...state,
        isOnRepeat: action.payload,
      };
    case IS_SHUFFLED:
      return {
        ...state,
        isShuffled: action.payload,
      };
    default:
      return state;
  }
};

export default playerReducer;
