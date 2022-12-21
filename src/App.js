import './App.css';
import React from 'react';
import {Route, Routes,} from "react-router-dom";
import Login from "./component/page/Login";
import Register from "./component/page/Register";
import Reset from "./component/page/Reset";
import Dashboard from "./component/page/dashboard/Dashboard";


function App() {
  return (
    <div className="App">
            <Routes>
                <Route exact path="/" element={<Login />} />
                <Route exact path="/register" element={<Register />} />
                <Route exact path="/reset" element={<Reset />} />
                <Route exact path="/dashboard" element={<Dashboard />} />
            </Routes>
      </div>
  );
}

export default App;
