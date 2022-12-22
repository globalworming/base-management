import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {useNavigate} from "react-router-dom";
import {auth, db} from "../../../../config/firebaseConfig";
import {addDoc, collection, onSnapshot, query, where} from "firebase/firestore";
import ShowsAuth from "../../../organism/debug/ShowsAuth";

function Dashboard() {
    const [user, loading, error] = useAuthState(auth);
    const [games, setGames] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) return
        const q = query(collection(db, "games"), where("facilitator", "==", user.uid));
        return onSnapshot(q, (querySnapshot) => {
            const games = [];
            querySnapshot.forEach((doc) => {
                let game = doc.data();
                game.id = doc.id
                games.push(game);
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
            facilitator: user.uid,
        });
    };

    async function copyTextToClipboard(text) {
        if ('clipboard' in navigator) {
            return await navigator.clipboard.writeText(text);
        } else {
            return document.execCommand('copy', true, text);
        }
    }


    return (<>
            <h1>Welcome Facilitator</h1>
            <button onClick={createGame}>
                create new game
            </button>
            <h2>Games in progress</h2>
            {games.map(it => {
                const inviteLink = window.location.protocol + "//" + window.location.host + "/join/" + it.id;

                return <div key={it.id}>
                    <pre>{JSON.stringify(it, null, 2)}</pre>
                    <button>continue</button>
                    <button onClick={() => copyTextToClipboard(inviteLink)}>copy invitation link</button>
                    <input type="text" readOnly value={inviteLink}/></div>;
            })}

            <ShowsAuth/>

    </>);
}

export default Dashboard;