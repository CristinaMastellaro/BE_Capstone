import ActionType from "../../types/ActionType";
import ShowSongType from "../../types/ShowSongType";
import {
  ADD_NEW_FAVOURITE,
  ADD_SINGLE_MOOD,
  ADD_SONG_TO_PLAYLIST,
  ALL_MOODS_NAME,
  ALL_PLAYLISTS,
  ALL_SONGS_MOOD,
  CREATE_NEW_PLAYLIST,
  DELETE_FAVOURITE,
  DELETE_SONG_FROM_PLAYLIST,
  PLAYLIST_NOT_TO_SAVE,
  SET_FAVOURITES_FROM_DB,
} from "../actions";

// export type myMap = {
//   [key: string]: ShowSongType[];
// };

interface AllSongsState {
  moodName: string;
  allMoodsName: string[];
  moods: Record<string, ShowSongType[]>;
  playlistNotPermanentlySaved: ShowSongType[];
  playlists: Record<string, ShowSongType[]>;
}

const initialState: AllSongsState = {
  moodName: "",
  allMoodsName: [],
  moods: {},
  playlistNotPermanentlySaved: [],
  playlists: { favourite: [] },
};

const allSongsReducer = (
  state = initialState,
  action: ActionType<
    | [string, ShowSongType[]]
    | string[]
    | string
    | ShowSongType
    | ShowSongType[]
    | [string, ShowSongType]
    | Record<string, ShowSongType[]>
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
    case ALL_PLAYLISTS:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          ...(action.payload as Record<string, ShowSongType[]>),
        },
      };
    case CREATE_NEW_PLAYLIST:
      console.log("I'm trying to create a new playlist");
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [action.payload as string]: [],
        },
      };
    case ADD_SONG_TO_PLAYLIST: {
      const key = (action.payload as [string, ShowSongType])[0];
      console.log("state.playlists", state.playlists);
      console.log("state.playlists[key]", state.playlists[key]);
      console.log("key", key);
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [key]: state.playlists[key].concat(
            (action.payload as [string, ShowSongType])[1]
          ),
        },
      };
    }
    case DELETE_SONG_FROM_PLAYLIST: {
      const key = (action.payload as [string, ShowSongType])[0];
      return {
        ...state,
        playlists: {
          ...state.playlists,
          [key]: state.playlists[key].filter(
            (song) =>
              song.id !== (action.payload as [string, ShowSongType])[1].id
          ),
        },
      };
    }
    case SET_FAVOURITES_FROM_DB:
      return {
        ...state,
        playlists: {
          ...state.playlists,
          favourite: action.payload,
        },
      };
    case PLAYLIST_NOT_TO_SAVE:
      return {
        ...state,
        playlistNotPermanentlySaved: action.payload as ShowSongType[],
      };
    default:
      console.log("You're in the default state");
      return state;
  }
};

export default allSongsReducer;
