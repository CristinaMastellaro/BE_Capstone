import {
  Action,
  combineReducers,
  configureStore,
  ThunkDispatch,
} from "@reduxjs/toolkit";
import allSongsReducer from "../reducers/allSongsReducer";
import { useDispatch, useSelector } from "react-redux";
import playerReducer from "../reducers/playerReducer";

const rootReducer = combineReducers({
  allSongs: allSongsReducer,
  player: playerReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableStateInvariant: false,
    }),
});

export type IRootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppDispatchFunction = ThunkDispatch<IRootState, unknown, Action>;

export const useAppDispatchFunction =
  useDispatch.withTypes<AppDispatchFunction>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<IRootState>();

export default store;
