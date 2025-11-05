import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import Playlist from "./components/Playlist";
import Homepage from "./components/Homepage";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/" />
          <Route element={<Registration />} path="/register" />
          <Route element={<Homepage />} path="/homepage" />
          <Route element={<Playlist />} path="/playlist" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
