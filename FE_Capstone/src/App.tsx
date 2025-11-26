import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.scss";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import Playlist from "./components/Playlist";
import Homepage from "./components/Homepage";
import MainLayout from "./components/MainLayout";
import Library from "./components/Library";
import SearchByCountry from "./components/SearchByCountry";
import Page404 from "./components/Page404";
import Search from "./components/Search";
import Settings from "./components/Settings";
import {
  ENDPOINT,
  findAllPlaylists,
  getCoutriesNames,
  setFavFromDb,
  setLoginAvatar,
  setLoginEmail,
  setLoginName,
  setLoginSurname,
  setLoginUsername,
  setToken,
} from "./redux/actions";
import { useEffect, useState } from "react";
import { useAppDispatch } from "./redux/store";
import Periods from "./components/Periods";

function App() {
  // If a user isn't logged in, it's redirected to the login page
  // const dispatch = useAppDispatch();

  // const token = localStorage.getItem("token") || "";
  // const username = localStorage.getItem("username") || "";
  // const name = localStorage.getItem("name") || "";
  // const surname = localStorage.getItem("surname") || "";
  // const email = localStorage.getItem("email") || "";
  // const avatar = localStorage.getItem("avatar") || "";

  // const navigate = useNavigate();
  // useEffect(() => {
  //   if (token === "" || username === "") {
  //     navigate("/");
  //   } else {
  //     dispatch(setToken(token));
  //     dispatch(setLoginUsername(username));
  //     dispatch(setLoginName(name));
  //     dispatch(setLoginSurname(surname));
  //     dispatch(setLoginEmail(email));
  //     dispatch(setLoginAvatar(avatar));
  //     dispatch(findAllPlaylists());
  //     dispatch(setFavFromDb());
  //     dispatch(getCoutriesNames());
  //   }
  // }, []);

  // const dispatch = useAppDispatchFunction();

  // useEffect(() => {
  // fetch(ENDPOINT + "/auth/login", {
  //   // fetch("https://wispy-sara-cristina-private-75ea3df9.koyeb.app/auth/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     username: "Augustus8",
  //     password: "Password1!",
  //   }),
  // })
  //   .then((res) => {
  //     if (res.ok) {
  //       return res.json();
  //     } else {
  //       throw new Error("Error!");
  //     }
  //   })
  //   .then((data) => {
  //     localStorage.setItem("token", data.token);
  //     dispatch(setToken(data.token));
  //     dispatch(setLoginUsername(data.username));
  //     dispatch(setLoginName(data.name));
  //     dispatch(setLoginSurname(data.surname));
  //     dispatch(setLoginEmail(data.email));
  //     dispatch(setLoginAvatar(data.avatar));
  //     dispatch(findAllPlaylists());
  //     dispatch(getCoutriesNames());
  //     dispatch(setFavFromDb());
  //   })
  //   .catch(() => {
  //     console.log("Error");
  //   });
  // }, []);

  return (
    <>
      <Routes>
        <Route element={<Login />} path="/" />
        <Route element={<Registration />} path="/register" />
        <Route element={<MainLayout />}>
          <Route element={<Homepage />} path="/homepage" />
          <Route element={<Playlist />} path="/playlist/:specification" />
          <Route element={<Library />} path="/library" />
          <Route element={<SearchByCountry />} path="/searchCountry" />
          <Route element={<Periods />} path="/periods" />
          <Route element={<Search />} path="/search" />
          <Route element={<Settings />} path="/settings" />
        </Route>
        <Route element={<Page404 />} path="*" />
      </Routes>
    </>
  );
}

export default App;
