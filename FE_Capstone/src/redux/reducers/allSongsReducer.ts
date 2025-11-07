import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";
import { ADD_SINGLE_MOOD, ALL_MOODS_NAME, ALL_SONGS_MOOD } from "../actions";

type myMap = {
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
  action: ActionType<[string, ShowSongType[]] | string[] | string>
) => {
  switch (action.type) {
    case ALL_SONGS_MOOD:
      return {
        ...state,
        moodName: action.payload[0],
        moods: {
          ...state.moods,
          [action.payload[0]]: action.payload[1],
        },
      };
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
    default:
      console.log("You're in the default state");
      return state;
  }
};

export default allSongsReducer;
