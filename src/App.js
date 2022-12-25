import './App.css';
import React from 'react';
import {Route, Routes,} from "react-router-dom";
import Login from "./component/page/auth/Login";
import Register from "./component/page/auth/Register";
import Reset from "./component/page/auth/Reset";
import Dashboard from "./component/page/facilitate/Dashboard";
import Play from "./component/page/play/Play";
import Facilitate from "./component/page/facilitate/Facilitate";


function App() {
    return (
        <div className="App" style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "flex-start",
            alignItems: "stretch",
            gap: "1%"
        }}>
            <Routes>
                <Route exact path="/" element={<Login/>}/>
                <Route exact path="/register" element={<Register/>}/>
                <Route exact path="/reset" element={<Reset/>}/>
                <Route exact path="/dashboard" element={<Dashboard/>}/>
                <Route exact path="/facilitate/:gameId" element={<Facilitate/>}/>
                <Route exact path="/join/:gameId" element={<Play/>}/>
            </Routes>
        </div>
    );
}

export default App;
