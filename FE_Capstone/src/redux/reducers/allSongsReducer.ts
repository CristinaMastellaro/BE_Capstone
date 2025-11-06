import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";
import { ALL_SONGS_MOOD } from "../actions";

type myMap = {
  [key: string]: ShowSongType[];
};

interface AllSongsState {
  moodName: string;
  moods: myMap;
}

const initialState: AllSongsState = {
  moodName: "",
  moods: {},
};

const allSongsReducer = (
  state = initialState,
  action: ActionType<[string, ShowSongType[]]>
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
    default:
      console.log("You're in the default state");
      return state;
  }
};

export default allSongsReducer;
