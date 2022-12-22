import React, {useEffect, useState} from "react";
import {useAuthState} from "react-firebase-hooks/auth";
import {auth, db, signInAsAnonymous} from "../../../config/firebaseConfig";
import ShowsAuth from "../../organism/debug/ShowsAuth";
import {useParams} from "react-router-dom";
import {collection, doc, onSnapshot, query} from "firebase/firestore";
import ShowsGame from "../../organism/debug/ShowsGame";
import ShowsPlayers from "../../organism/debug/ShowsPlayers";
import SelectPlayer from "./SelectPlayer";


function Play() {
    const [user, loading, error] = useAuthState(auth);
    const [game, setGame] = useState(undefined)
    const [players, setPlayers] = useState(undefined)
    const {gameId} = useParams();

    useEffect(() => {
        return onSnapshot(doc(db, "games", gameId), (doc) => {
            let game = doc.data();
            game.id = doc.id;
            setGame(game);
        });
    }, [game && game.id])

    useEffect(() => {
        if (!game) return
        const q = query(collection(db, "games", game.id, "players"));
        return onSnapshot(q, (querySnapshot) => {
            const players = [];
            querySnapshot.forEach((doc) => {
                let player = doc.data();
                player.id = doc.id
                players.push(player);
            });
            setPlayers(players)
        })
    }, [game && game.id])


    if (!loading && user === null) {
        signInAsAnonymous()
    }

    if (!game) {
        return null;
    }

    const noPlayerSelected = !players || players.length <= 0 || !players.find((player) => player.controlledBy === user.uid)
    if (noPlayerSelected) {
        return <SelectPlayer gameId={game.id}/>
    }

    return <><h1>you are playing '{game.name}' as '{players.find((player) => player.controlledBy === user.uid).name}'</h1>

        <ShowsGame gameId={game.id}/>
        <ShowsPlayers gameId={game.id}/>
        <ShowsAuth/>
    </>
}

export default Play;