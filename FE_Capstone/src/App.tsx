import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.scss";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import Playlist from "./components/Playlist";
import Homepage from "./components/Homepage";
import MainLayout from "./components/MainLayout";
import Library from "./components/Library";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<Homepage />} path="/homepage" />
            <Route element={<Playlist />} path="/playlist/:specification" />
            <Route element={<Library />} path="/library" />
          </Route>
          <Route element={<Login />} path="/" />
          <Route element={<Registration />} path="/register" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
