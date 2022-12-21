import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {auth, db, logout} from "../../../config/firebaseConfig";
import {addDoc, collection, onSnapshot, query, where} from "firebase/firestore";


function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const navigate = useNavigate();
    const [games, setGames] = useState([]);


    useEffect(() => {
        if (!user) return
        const q = query(collection(db, "games"), where("facilitator", "==", user.uid));
        return onSnapshot(q, (querySnapshot) => {
            const games = [];
            querySnapshot.forEach((doc) => {
                games.push(doc.data());
            });
            setGames(games)
        })
    }, [user])
    useEffect(() => {
        if (loading) return;
        if (!user) return navigate("/");
    }, [user, loading]);

    const createGame = () => {
        addDoc(collection(db, "games"), {
            name: "some game " + Date.now(),
            facilitator: user.uid
        });
    };

    return (<div>
        <div>
            <h1>Welcome Facilitator</h1>
            <button onClick={createGame}>
                create new game
            </button>
            <h2>in progress</h2>
            {games.map(it => <p key={it.name.replaceAll(" ", "")}>{it.name} <button>continue</button> <button>copy invitation link</button></p>)}
        </div>

        <div>
            <h2>Debug</h2>
            Auth:
            <pre>{JSON.stringify(user, null, 2)}</pre>
            <button onClick={logout}>
                Logout
            </button>
        </div>
    </div>);
}

export default Dashboard;