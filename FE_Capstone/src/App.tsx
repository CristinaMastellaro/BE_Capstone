import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import Playlist from "./components/Playlist";
import Homepage from "./components/Homepage";
import MainLayout from "./components/MainLayout";
import Library from "./components/Library";
// import { useEffect } from "react";
// import { useAppDispatchFunction } from "./redux/store";
// import {
//   ENDPOINT,
//   findAllPlaylists,
//   setFavFromDb,
//   setLoginEmail,
//   setLoginName,
//   setLoginSurname,
//   setLoginUsername,
// } from "./redux/actions";
import SearchByCountry from "./components/SearchByCountry";
import Page404 from "./components/Page404";
import Search from "./components/Search";
import Settings from "./components/Settings";

function App() {
  // const dispatch = useAppDispatchFunction();

  // useEffect(() => {
  //   fetch(ENDPOINT + "/auth/login", {
  //     // fetch("https://wispy-sara-cristina-private-75ea3df9.koyeb.app/auth/login", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       username: "Augustus8",
  //       password: "Password1!",
  //     }),
  //   })
  //     .then((res) => {
  //       if (res.ok) {
  //         return res.json();
  //       } else {
  //         throw new Error("Error!");
  //       }
  //     })
  //     .then((data) => {
  //       localStorage.setItem("token", data.token);
  //       dispatch(setLoginUsername(data.username));
  //       dispatch(setLoginName(data.name));
  //       dispatch(setLoginSurname(data.surname));
  //       dispatch(setLoginEmail(data.email));
  //       dispatch(findAllPlaylists());
  //       dispatch(setFavFromDb());
  //     })
  //     .catch(() => {
  //       console.log("Error");
  //     });
  // }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<Homepage />} path="/homepage" />
            <Route element={<Playlist />} path="/playlist/:specification" />
            <Route element={<Library />} path="/library" />
            <Route element={<SearchByCountry />} path="/searchCountry" />
            <Route element={<Search />} path="/search" />
            <Route element={<Settings />} path="/settings" />
          </Route>
          <Route element={<Page404 />} path="*" />
          <Route element={<Login />} path="/" />
          <Route element={<Registration />} path="/register" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
