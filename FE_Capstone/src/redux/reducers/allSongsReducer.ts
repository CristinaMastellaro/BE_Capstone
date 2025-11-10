import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";
import {
  ADD_NEW_FAVOURITE,
  ADD_SINGLE_MOOD,
  ALL_MOODS_NAME,
  ALL_SONGS_MOOD,
  DELETE_FAVOURITE,
  SET_FAVOURITES_FROM_DB,
} from "../actions";

export type myMap = {
  [key: string]: ShowSongType[];
};

interface AllSongsState {
  moodName: string;
  allMoodsName: string[];
  moods: myMap;
  playlists: myMap;
}

const initialState: AllSongsState = {
  moodName: "",
  allMoodsName: [],
  moods: {},
  playlists: { favourite: [] },
};

const allSongsReducer = (
  state = initialState,
  action: ActionType<
    [string, ShowSongType[]] | string[] | string | ShowSongType | ShowSongType[]
  >
) => {
  switch (action.type) {
    case ALL_SONGS_MOOD: {
      const [moodNameRetrieved, songs] = action.payload as [
        string,
        ShowSongType[]
      ];
      return {
        ...state,
        moodName: moodNameRetrieved,
        moods: {
          ...state.moods,
          [moodNameRetrieved]: songs,
        },
      };
    }
    case ALL_MOODS_NAME:
      return {
        ...state,
        allMoodsName: action.payload,
      };
    case ADD_SINGLE_MOOD:
      return {
        ...state,
        allMoodsName: state.allMoodsName.concat(action.payload as string),
      };
    case ADD_NEW_FAVOURITE:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          favourite: state.playlists.favourite.concat(
            action.payload as ShowSongType
          ),
        },
      };
    case DELETE_FAVOURITE:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          favourite: state.playlists.favourite.filter(
            (fav) => fav !== action.payload
          ),
        },
      };
    case SET_FAVOURITES_FROM_DB:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          favourite: action.payload,
        },
      };
    default:
      console.log("You're in the default state");
      return state;
  }
};

export default allSongsReducer;
