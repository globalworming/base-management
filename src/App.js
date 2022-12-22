import './App.css';
import React from 'react';
import {Route, Routes,} from "react-router-dom";
import Login from "./component/page/auth/Login";
import Register from "./component/page/auth/Register";
import Reset from "./component/page/auth/Reset";
import Dashboard from "./component/page/facilitate/dashboard/Dashboard";
import Play from "./component/page/play/Play";


function App() {
  return (
    <div className="App">
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/reset" element={<Reset />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
                <Route exact path="/facilitate/:gameId" element={<h1>Facilitate</h1>} />
                <Route exact path="/join/:gameId" element={<Play />} />
            </Routes>
      </div>
  );
}

export default App;
