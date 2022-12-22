import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, logout} from "../../../config/firebaseConfig";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {collection, doc, onSnapshot, query} from "firebase/firestore";


function ShowsPlayers({gameId}) {
    const [players, setPlayers] = useState(undefined)

    useEffect(() => {
        if (!gameId) return
        const q = query(collection(db, "games", gameId, "players"));
        return onSnapshot(q, (querySnapshot) => {
            const players = [];
            querySnapshot.forEach((doc) => {
                let player = doc.data();
                player.id = doc.id
                players.push(player);
            });
            setPlayers(players)
        })
    }, [gameId])
    if (!players || players.length <= 0) {
        return null;
    }

    return  <><h2>Players</h2>{players.map(player => <pre key={player.id}>{JSON.stringify(player, null, 2)}</pre>)}</>
}

export default ShowsPlayers