import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import Registration from "./components/Registration";
import Playlist from "./components/Playlist";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Login />} path="/login" />
          <Route element={<Registration />} path="/register" />
          <Route element={<Playlist />} path="/" />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
