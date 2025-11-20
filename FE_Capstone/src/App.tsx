import { BrowserRouter, Route, Routes } from "react-router-dom";
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

function App() {
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
