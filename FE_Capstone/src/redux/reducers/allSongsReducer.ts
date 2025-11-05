import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";
import { ALL_SONGS_MOOD } from "../actions";

interface AllSongsState {
  Mood: ShowSongType[];
}

const initialState: AllSongsState = { Mood: [] };

const allSongsReducer = (
  state = initialState,
  action: ActionType<ShowSongType[]>
) => {
  switch (action.type) {
    case ALL_SONGS_MOOD:
      //   state.set("Mood", action.payload);
      //   console.log("state mood", state);
      return { ...state, Mood: action.payload };
    default:
      console.log("You're in the default state");
      return state;
  }
};

export default allSongsReducer;
